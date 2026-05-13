import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext";
import avatar from "../assets/profile.png";
import { UserPlus, Users } from "lucide-react";
export default function Profile() {
  const [user, setUser] = useState(null);
   const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);
  const token = localStorage.getItem("access");
  const { darkMode } = useTheme();
  console.log(token)
const handleUploadAvatar = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("avatar", file);
  const res = await api.post("/accounts/profile/avatar/", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  setUser(prev => ({ ...prev, avatar: res.data.avatar }));
  setShowMenu(false);
};

  // Sync theme
  useEffect(() => {
    const fetchProfile = async () => {
      const res = await api.get("/accounts/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    };

    const fetchFriends = async () => {
      const res = await api.get("/friends/amis/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFriends(res.data);
    };

    fetchProfile();
    fetchFriends();
  }, [token]);

  if (!user) return <div className="p-6">Chargement...</div>;

  return (
    <div className={`${darkMode ? "bg-slate-900 text-white" : "bg-gray-100 text-black"} min-h-screen`}>
      <Navbar />
<div className="pt-20">

      {/* Cover */}
      <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600" />

      {/* Profile Card */}
      <div className="max-w-5xl mx-auto -mt-20 px-6">
        <div className={`${darkMode ? "bg-slate-800" : "bg-white"} rounded-2xl shadow-lg p-6`}>
          <div className="flex flex-col md:flex-row md:items-center gap-6">
           <div className="relative">
  <img
     src={user.avatar ? user.avatar : avatar}
    className="w-32 h-32 rounded-full ring-4 ring-white cursor-pointer"
    onClick={() => setShowMenu(!showMenu)}
    alt="profile"
  />


  {showMenu && (
    <div className={`absolute top-36 left-0 w-48 rounded-lg shadow-lg z-50
      ${darkMode ? "bg-slate-800" : "bg-white"}`}
    >
      <label className="block px-4 py-2 hover:bg-indigo-500 hover:text-white cursor-pointer">
        Ajouter / Modifier photo
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleUploadAvatar}
        />
      </label>

      {user.avatar && (
        <button
          onClick={() => {
            setShowPhoto(true);
            setShowMenu(false);
          }}
          className="w-full text-left px-4 py-2 hover:bg-indigo-500 hover:text-white"
        >
          Voir photo
        </button>
      )}
    </div>
  )}
</div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{user.username}</h1>
              <p className="text-sm text-gray-400">{user.email}</p>
              <p className="mt-3">{user.bio || "Aucune description disponible."}</p>
            </div>

            <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
             onClick={() => navigate("/add")}>
              <UserPlus size={18}
               />
              Ajouter ami
              
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-6 text-center">
            <div>
              <p className="text-xl font-bold">{friends.length}</p>
              <p className="text-sm text-gray-400">Amis</p>
            </div>
            <div>
              <p className="text-xl font-bold">0</p>
              <p className="text-sm text-gray-400">Posts</p>
            </div>
          </div>
        </div>

        {/* Friends List */}
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Users /> Amis
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <div
                key={friend.id}
                className={`${darkMode ? "bg-slate-800" : "bg-white"} p-4 rounded-xl shadow hover:scale-105 transition`}
              >
                <img
                  src={friend.avatar || avatar}
                  className="w-16 h-16 rounded-full mx-auto"
                  alt="friend"
                />
                <p className="text-center mt-2 font-medium">
                  {friend.username}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
{showPhoto && (
  <div
    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
    onClick={() => setShowPhoto(false)}
  >
    <img
      src={user.avatar}
      className="max-h-[90vh] max-w-[90vw] rounded-xl"
      alt="avatar"
    />
  </div>
)}

    </div>
       </div>
    
  );
}
