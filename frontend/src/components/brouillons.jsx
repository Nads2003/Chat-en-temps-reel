import { useEffect, useRef, useState } from "react";
import api from "../api/axios";
import { Mic, ArrowLeft, Menu, X, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import VoiceMessage from "../components/VoiceMessage";
import avatarDefault from "../assets/profile.png";
import { jwtDecode } from "jwt-decode";
import { v4 as uuidv4 } from "uuid";
import Picker from "emoji-picker-react";

export default function Chat() {
  const navigate = useNavigate();
  const [showPicker, setShowPicker] = useState(false);
  const [recording, setRecording] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("access");
  const myUserId = token ? jwtDecode(token).user_id : null;
  const myUsername = token ? jwtDecode(token).username : "";

  const isProd = window.location.hostname !== "localhost";
  const WS_BASE_URL = isProd
    ? "wss://web-production-6a3e3.up.railway.app/ws/chat"
    : "ws://127.0.0.1:8000/ws/chat";

  /* =========================
     CHARGER AMIS
  ========================== */
  useEffect(() => {
    api.get("/friends/utilisateurs/")
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  const selectUser = async (user) => {
    setSelectedUser(user);
    setMessages([]);
    setConversationId(null);
    try {
      const res = await api.get(`/friends/conversation/${user.id}/`);
      setConversationId(res.data.id);
      setMobileSidebarOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  /* =========================
     MESSAGES + WEBSOCKET
  ========================== */
  useEffect(() => {
    if (!conversationId || !token) return;

    api.get(`/friends/messages/${conversationId}/`)
      .then(res => setMessages(res.data))
      .catch(err => console.error(err));

    if (socketRef.current) socketRef.current.close();

    const ws = new WebSocket(`${WS_BASE_URL}/${conversationId}/?token=${token}`);
    socketRef.current = ws;

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages(prev => {
        const index = prev.findIndex(m => m.localId === data.localId);
        if (index !== -1) {
          const copy = [...prev];
          copy[index] = data;
          return copy;
        }
        return [...prev, data];
      });
    };

    return () => ws.close();
  }, [conversationId, token]);

  /* =========================
     ENVOYER MESSAGE
  ========================== */
  const sendMessage = () => {
    if (!message.trim() || socketRef.current?.readyState !== WebSocket.OPEN) return;

    const localId = uuidv4();
    const localMessage = {
      localId,
      contenu: message,
      est_lu: false,
      expediteur: { id: myUserId, username: myUsername }
    };

    setMessages(prev => [...prev, localMessage]);
    socketRef.current.send(JSON.stringify({ message, localId }));
    setMessage("");
  };

  /* =========================
     VOCAL
  ========================== */
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = e =>
      audioChunksRef.current.push(e.data);

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const reader = new FileReader();
      const localId = uuidv4();

      reader.onload = () => {
        const base64Audio = reader.result;
        const localMessage = {
          localId,
          vocal: base64Audio,
          est_lu: false,
          expediteur: { id: myUserId, username: myUsername }
        };
        setMessages(prev => [...prev, localMessage]);
        socketRef.current.send(JSON.stringify({ vocal: base64Audio, localId }));
      };

      reader.readAsDataURL(audioBlob);
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* =========================
     RENDER MESSAGES (STYLE WHATSAPP)
  ========================== */
  const renderMessages = () =>
    messages.map((msg, i) => {
      const isMe = Number(msg.expediteur?.id) === Number(myUserId);

      return (
        <div
          key={msg.localId || i}
          className={`flex mb-1 ${isMe ? "justify-end" : "justify-start"}`}
        >
          {!isMe && (
            <img
              src={avatarDefault}
              className="w-7 h-7 rounded-full mr-2 self-end"
            />
          )}

          <div
            className={`px-4 py-2 max-w-[75%] text-sm rounded-2xl shadow
              ${isMe
                ? "bg-emerald-600 text-white rounded-br-sm"
                : "bg-[#202c33] text-white rounded-bl-sm"
              }`}
          >
            {!isMe && (
              <div className="text-xs font-semibold text-emerald-400 mb-1">
                {msg.expediteur?.username}
              </div>
            )}

            {msg.contenu}

             {msg.vocal && <VoiceMessage src={msg.vocal.startsWith("data:") ? msg.vocal : `http://127.0.0.1:8000${msg.vocal}`} />}

            {isMe && (
              <div className="text-[10px] text-right opacity-60 mt-1">
                {msg.est_lu ? "✔✔" : "✔"}
              </div>
            )}
          </div>
        </div>
      );
    });

  /* =========================
     JSX
  ========================== */
  return (
    <div className="h-screen flex bg-[#0b141a] text-white">


{/* SIDEBAR MOBILE */}
{mobileSidebarOpen && (
  <div className="fixed inset-0 z-40 md:hidden flex">
    
    {/* OVERLAY */}
    <div
      className="absolute inset-0 bg-black/60"
      onClick={() => setMobileSidebarOpen(false)}
    />

    {/* SIDEBAR */}
    <div className="relative w-72 bg-[#111b21] h-full z-50">
      <div className="p-4 flex items-center justify-between border-b border-slate-800">
         <ArrowLeft onClick={() => navigate("/add")} className="cursor-pointer" />
        <span className="font-bold">Discussions</span>
        <X
          className="cursor-pointer"
          onClick={() => setMobileSidebarOpen(false)}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {users.map(user => (
          <div
            key={user.id}
            onClick={() => selectUser(user)}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer
              hover:bg-[#202c33]
              ${selectedUser?.id === user.id ? "bg-[#202c33]" : ""}`}
          >
            <img src={avatarDefault} className="w-10 h-10 rounded-full" />

            <div className="flex-1">
              <div className="font-semibold">{user.username}</div>

              {/* DERNIER MESSAGE */}
              <div className="text-xs text-gray-400 truncate">
                {user.last_message?.contenu || "Aucun message"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)}

      {/* SIDEBAR DESKTOP */}
      <div className="hidden md:flex w-72 flex-col bg-[#111b21]">
        <div className="p-4 flex items-center gap-2 border-b border-slate-800">
          <ArrowLeft onClick={() => navigate("/add")} className="cursor-pointer" />
          <span className="font-bold">Discussions</span>
        </div>

         <div className="flex-1 overflow-y-auto">
        {users.map(user => (
          <div
            key={user.id}
            onClick={() => selectUser(user)}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer
              hover:bg-[#202c33]
              ${selectedUser?.id === user.id ? "bg-[#202c33]" : ""}`}
          >
            <img src={avatarDefault} className="w-10 h-10 rounded-full" />

            <div className="flex-1">
              <div className="font-semibold">{user.username}</div>

              {/* DERNIER MESSAGE */}
              <div className="text-xs text-gray-400 truncate">
                {user.last_message?.contenu || "Aucun message"}
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
      

      {/* CHAT */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <div className="flex items-center gap-3 p-3 bg-[#202c33]">
          <Menu className="md:hidden" onClick={() => setMobileSidebarOpen(true)} />
          {selectedUser && (
            <>
              <img src={avatarDefault} className="w-9 h-9 rounded-full" />
              <span className="font-semibold">{selectedUser.username}</span>
            </>
          )}
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-4">
          {renderMessages()}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        {selectedUser && (
          <div className="flex items-center gap-2 p-3 bg-[#202c33]">
            <button onClick={() => setShowPicker(p => !p)}>😊</button>

            <input
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Message"
              className="flex-1 px-4 py-2 rounded-full bg-[#2a3942] outline-none"
            />

            {!recording ? (
              <Mic onClick={startRecording} className="cursor-pointer" />
            ) : (
              <button onClick={stopRecording} className="text-red-500">⏹</button>
            )}

            <button
              onClick={sendMessage}
              className="bg-emerald-600 p-2 rounded-full"
            >
              <Send size={18} />
            </button>
          </div>
        )}

        {showPicker && (
          <div className="absolute bottom-20 left-4 z-50">
            <Picker onEmojiClick={(e) => setMessage(m => m + e.emoji)} />
          </div>
        )}
      </div>
    </div>
  );
}
