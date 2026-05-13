import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Sun, Moon, Bell, Menu, X, LogOut } from "lucide-react";
import avatar from "../assets/profile.png";
import { useTheme } from "../context/ThemeContext";
import api from "../api/axios";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleTheme } = useTheme();

  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  const token = localStorage.getItem("access");

  // ================= PROFIL =================
  useEffect(() => {
    if (!token) return;
    api.get("/accounts/profile/", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUser(res.data))
      .catch(err => console.error("Erreur profil", err));
  }, [token]);

  // ================= NOTIFS API =================
  useEffect(() => {
    if (!token) return;
    const fetchUnread = async () => {
      try {
        const res = await api.get("/notifications/unread/", { headers: { Authorization: `Bearer ${token}` } });
        setNotifications(res.data.length);
      } catch (err) {
        console.error("Erreur notifications", err);
      }
    };
    fetchUnread();
  }, [token]);

  // ================= WEBSOCKET =================
  useEffect(() => {
    if (!token) return;

    const socket = new WebSocket(`ws://localhost:8000/ws/notifications/?token=${token}`);
    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log("🔔 Notification reçue :", data);
      setNotifications(prev => prev + 1);
    };
    socket.onerror = (e) => console.error("WS error", e);
    socket.onclose = () => console.log("WS fermé");

    return () => socket.close();
  }, [token]);

  // ================= LOGOUT =================
  const handleLogout = () => {
    if (window.confirm("Voulez-vous vous déconnecter ?")) {
      localStorage.clear();
      navigate("/");
    }
  };

  // ================= NAV LINKS =================
  const navLinks = [
    { name: "Chat", path: "/chat" },
    { name: "Amis", path: "/add" },
  ];
  const navClass = (path) =>
    `px-3 py-1 rounded transition font-medium ${
      location.pathname === path
        ? darkMode
          ? "text-indigo-400 bg-slate-700"
          : "text-indigo-600 bg-gray-200"
        : darkMode
        ? "text-white hover:text-indigo-400"
        : "text-black hover:text-indigo-600"
    }`;

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center shadow-lg
      ${darkMode ? "bg-slate-800 text-white" : "bg-white text-black"}`}>
      
      {/* LOGO */}
      <div className="text-2xl font-bold cursor-pointer" onClick={() => navigate("/chat")}>
        🔔 MyChatApp
      </div>

      {/* DESKTOP */}
      <div className="hidden md:flex items-center gap-4">
        {navLinks.map(link => (
          <button key={link.path} className={navClass(link.path)} onClick={() => navigate(link.path)}>
            {link.name}
          </button>
        ))}

        {/* NOTIFICATIONS */}
        <div className="relative">
          <button
            onClick={async () => {
              setNotifications(0);
              try {
                await api.post("/notifications/mark-all-read/", {}, { headers: { Authorization: `Bearer ${token}` } });
              } catch {}
              navigate("/notifications");
            }}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"
          >
            <Bell size={20} />
          </button>
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {notifications}
            </span>
          )}
        </div>

        {/* THEME */}
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700">
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* AVATAR */}
        <img src={user?.avatar || avatar} alt="profil" className="w-8 h-8 rounded-full cursor-pointer" onClick={() => navigate("/profil")} />

        {/* LOGOUT */}
        <button onClick={handleLogout} className="text-red-500">
          <LogOut size={20} />
        </button>
      </div>

      {/* MOBILE */}
      <div className="md:hidden flex items-center gap-2">
        <div className="relative">
          <button onClick={() => navigate("/notifications")}>
            <Bell size={20} />
          </button>
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {notifications}
            </span>
          )}
        </div>
        <button onClick={toggleTheme}>{darkMode ? <Sun /> : <Moon />}</button>
        <button onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X /> : <Menu />}</button>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="absolute top-16 left-0 w-full bg-white dark:bg-slate-800 p-4 md:hidden flex flex-col gap-2">
          {navLinks.map(link => (
            <button key={link.path} className="block py-2" onClick={() => { navigate(link.path); setMobileOpen(false); }}>
              {link.name}
            </button>
          ))}
          <button onClick={() => { navigate("/profil"); setMobileOpen(false); }} className="block py-2">Profil</button>
          <button onClick={handleLogout} className="block py-2 text-red-500">Déconnexion</button>
        </div>
      )}
    </nav>
  );
}
