import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Bell, CheckCircle } from "lucide-react";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access");

    const { darkMode } = useTheme();

 

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notifications/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [token]);

  const markAsRead = async (id) => {
    try {
      await api.post(
        `/notifications/${id}/read/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, est_lu: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`${darkMode ? "bg-slate-900 text-white" : "bg-gray-100 text-black"} min-h-screen`}>
      {/* Navbar */}
      <Navbar />

      <div className="max-w-3xl mx-auto pt-24 px-4">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Bell /> Notifications
        </h1>

        {loading && <p className="text-center">Chargement...</p>}

        {!loading && notifications.length === 0 && (
          <p className="text-gray-500 text-center">
            Aucune notification pour le moment
          </p>
        )}

        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-xl shadow flex justify-between items-center
                transition-colors
                ${
                  notif.est_lu
                    ? darkMode
                      ? "bg-slate-700"
                      : "bg-gray-100"
                    : darkMode
                      ? "bg-slate-800 border-l-4 border-indigo-500"
                      : "bg-indigo-50 border-l-4 border-indigo-500"
                }`}
            >
              <div>
                <p className="font-medium">{notif.message}</p>
                <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {new Date(notif.date).toLocaleString()}
                </span>
              </div>

              {!notif.est_lu && (
                <button
                  onClick={() => markAsRead(notif.id)}
                  className={`text-indigo-600 hover:scale-110 transition ${
                    darkMode ? "text-indigo-400" : ""
                  }`}
                  title="Marquer comme lue"
                >
                  <CheckCircle size={20} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
