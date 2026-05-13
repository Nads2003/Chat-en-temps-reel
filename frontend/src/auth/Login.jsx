import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { User, Lock } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

import { Eye, EyeOff } from "lucide-react";


export default function Login() {
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();

  const [username, setUsername] = useState("");
  
  const [error, setError] = useState("");

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);


 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    await login(username, password);
    navigate("/add");
  } catch (err) {
    if (err.response?.status === 401) {
      setError("Nom d'utilisateur ou mot de passe incorrect");
    } else {
      setError("Erreur serveur. Réessayez plus tard.");
    }
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="
  min-h-screen flex items-center justify-center px-4
  bg-gradient-to-br
  from-slate-100 via-slate-200 to-white
  dark:from-slate-900 dark:via-slate-800 dark:to-black
">

      {/* Card gradient */}
      <div className="w-full sm:w-[90%] md:w-[400px] p-[2px] rounded-2xl bg-gradient-to-r from-indigo-500 to-emerald-500 shadow-2xl">
        
          <form className="
  rounded-2xl p-6 sm:p-8
  bg-white text-slate-900
  dark:bg-slate-900 dark:text-white

" onSubmit={handleSubmit}>

          {/* Titre */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold">Connexion</h2>
            <p className="text-sm mt-1 sm:mt-2 text-slate-500 dark:text-slate-400">
  Accédez à votre espace personnel
</p>

          </div>

          {/* Username */}
          <div className="relative mb-4 sm:mb-5">
            <User className="absolute left-3 top-3.5 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Nom d'utilisateur"
                className="
    w-full pl-11 p-3 rounded-xl outline-none transition
    bg-slate-100 text-slate-900
    focus:ring-2 focus:ring-indigo-500
    dark:bg-slate-800 dark:text-white
    dark:focus:bg-slate-700
  "
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="relative mb-5 sm:mb-6">
  <Lock className="absolute left-3 top-3.5 text-slate-400" size={20} />

  <input
    type={showPassword ? "text" : "password"}
    placeholder="Mot de passe"
     className="
    w-full pl-11 p-3 rounded-xl outline-none transition
    bg-slate-100 text-slate-900
    focus:ring-2 focus:ring-indigo-500
    dark:bg-slate-800 dark:text-white
    dark:focus:bg-slate-700
  "
    onChange={(e) => setPassword(e.target.value)}
    required
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-3.5 text-slate-400 hover:text-white"
  >
    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
  </button>
</div>


          {/* Bouton */}
          <button
  type="submit"
  disabled={loading}
  className={`w-full py-3 rounded-xl font-semibold text-white
    bg-gradient-to-r from-indigo-600 to-emerald-600
    shadow-lg transition-all flex items-center justify-center gap-2
    ${loading ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02]"}
  `}
>
  {loading ? (
    <>
      <svg
        className="animate-spin h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      Connexion...
    </>
  ) : (
    "Se connecter"
  )}
</button>

          {error && (
  <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
    {error}
  </div>
)}


          {/* Lien inscription */}
          <p className="text-center text-sm text-slate-400 mt-4">
            Pas encore de compte ?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-emerald-400 hover:underline cursor-pointer font-medium"
            >
              Créer un compte
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
