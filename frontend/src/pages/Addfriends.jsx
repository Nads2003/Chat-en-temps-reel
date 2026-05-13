import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import avatarDefault from "../assets/profile.png";
import { useTheme } from "../context/ThemeContext";


export default function Addfriends() {
  const [nonAmis, setNonAmis] = useState([]);
  const [demandesRecues, setDemandesRecues] = useState([]);
  const [demandesEnvoyees, setDemandesEnvoyees] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.length;

  const friendCount = notifications.filter(n => n.type === "friend_request").length;
  const messageCount = notifications.filter(n => n.type === "message").length;

  const { darkMode } = useTheme();
  const token = localStorage.getItem("access");

  // 🔹 Lire le mode actuel depuis localStorage





  useEffect(() => {
    const fetchNonAmis = async () => {
      try {
        const res = await api.get("/friends/amis/non/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNonAmis(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchDemandesRecues = async () => {
      try {
        const res = await api.get("/friends/demandes/recues/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDemandesRecues(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchDemandesEnvoyees = async () => {
      try {
        const res = await api.get("/friends/demandes/envoyees/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDemandesEnvoyees(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchNonAmis();
    fetchDemandesRecues();
    fetchDemandesEnvoyees();
  }, [token]);

  const ajouterAmi = async (destinataireId) => {
    try {
      await api.post(
        "/friends/send/",
        { destinataire_id: destinataireId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDemandesEnvoyees((prev) => [...prev, { destinataire: { id: destinataireId } }]);
      setNonAmis((prev) => prev.filter((user) => user.id !== destinataireId));
      alert("Demande envoyée !");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Erreur lors de l'envoi de la demande");
    }
  };

  const annulerDemande = async (destinataireId) => {
    try {
      await api.post(
        "/friends/demandes/annuler/",
        { destinataire_id: destinataireId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDemandesEnvoyees((prev) => prev.filter((d) => d.destinataire.id !== destinataireId));
      alert("Demande annulée !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'annulation de la demande");
    }
  };

  const repondreDemande = async (demandeId, accepter = true) => {
    try {
      await api.post(
        "/friends/demandes/repondre/",
        { demande_id: demandeId, accepter },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDemandesRecues((prev) => prev.filter((d) => d.id !== demandeId));
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la réponse à la demande");
    }
  };

  return (
    <div
      className={`h-screen flex flex-col
        ${darkMode ? "bg-slate-900 text-white" : "bg-white text-black"}`}
    >
      {/* Navbar */}
      <Navbar />

      {/* Contenu principal */}
      <div className="flex-1 p-6 space-y-6 pt-20">

        {/* Demandes d'amis reçues */}
        {demandesRecues.length > 0 && (
          <div className={`${darkMode ? "bg-slate-800" : "bg-gray-100"} p-4 rounded-lg`}>
            <h2 className={`${darkMode ? "text-white" : "text-black"} text-xl font-bold mb-4`}>
              Demandes d'amis
            </h2>
            {demandesRecues.map((demande) => (
              <div
                key={demande.id}
                className={`flex justify-between items-center mb-2 p-2 rounded
                  ${darkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-gray-200 hover:bg-gray-300"} transition`}
              >
                <div className="flex items-center gap-3">
  <img
    src={avatarDefault}
    alt="avatar"
    className="w-10 h-10 rounded-full object-cover"
  />
  <span>{demande.expediteur.username}</span>

</div>

                <div className="flex gap-2">
                  <button
                    className="bg-green-600 px-3 py-1 rounded hover:bg-green-700 text-white"
                    onClick={() => repondreDemande(demande.id, true)}
                  >
                    Accepter
                  </button>
                  <button
                    className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 text-white"
                    onClick={() => repondreDemande(demande.id, false)}
                  >
                    Refuser
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Ajouter des amis */}
        <div>
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-black"}`}>
            Ajouter des amis
          </h2>

          {nonAmis
            .filter((user) => !demandesRecues.some(d => d.expediteur.id === user.id))
            .map((user) => {
              const demandeEnvoyee = demandesEnvoyees.find(
                (d) => d.destinataire.id === user.id
              );
              return (
                <div
                  key={user.id}
                  className={`p-3 mb-3 rounded flex justify-between items-center transition
                    ${darkMode ? "bg-slate-800 hover:bg-slate-700" : "bg-gray-100 hover:bg-gray-200"}`}
                >
                                <div className="flex items-center gap-3">
  <img
    src={avatarDefault}
    alt="avatar"
    className="w-10 h-10 rounded-full object-cover"
  />
  <span>{user.username}</span>
</div>
                  {demandeEnvoyee ? (
                    <button
                      className="bg-red-600 px-4 py-1 rounded text-white hover:bg-red-700"
                      onClick={() => annulerDemande(user.id)}
                    >
                      Annuler
                    </button>
                  ) : (
                    <button
                      className="bg-indigo-600 px-4 py-1 rounded text-white hover:bg-indigo-700"
                      onClick={() => ajouterAmi(user.id)}
                    >
                      Ajouter
                    </button>
                  )}
                </div>
              );
            })}

          {nonAmis.length === 0 && demandesRecues.length === 0 && (
            <p className={`${darkMode ? "text-slate-400" : "text-gray-500"}`}>
              Aucun utilisateur disponible pour ajouter.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
