import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirm) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      await api.post("/auth/inscription/", {
        username: form.username,
        email: form.email,
        password: form.password,
      });

      alert("Compte créé avec succès !");
      navigate("/");
    } catch (err) {
      alert("Erreur lors de l'inscription");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center
  bg-gray-100 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-black px-4">

      <form
        onSubmit={handleSubmit}
       className="w-full sm:w-[90%] md:w-[400px]
  bg-white dark:bg-slate-800
  p-6 sm:p-8 rounded-2xl shadow-2xl"

      >
       <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6
  text-slate-900 dark:text-white">

          Créer un compte
        </h2>

        <input
          name="username"
          placeholder="Nom d'utilisateur"
          className="w-full p-3 mb-4 rounded-xl
  bg-gray-100 dark:bg-slate-700
  text-slate-900 dark:text-white
  placeholder:text-slate-500 dark:placeholder:text-slate-400
  outline-none focus:ring-2 focus:ring-indigo-500 transition"

          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded-xl
  bg-gray-100 dark:bg-slate-700
  text-slate-900 dark:text-white
  placeholder:text-slate-500 dark:placeholder:text-slate-400
  outline-none focus:ring-2 focus:ring-indigo-500 transition"

          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Mot de passe"
         className="w-full p-3 mb-4 rounded-xl
  bg-gray-100 dark:bg-slate-700
  text-slate-900 dark:text-white
  placeholder:text-slate-500 dark:placeholder:text-slate-400
  outline-none focus:ring-2 focus:ring-indigo-500 transition"

          onChange={handleChange}
          required
        />

        <input
          name="confirm"
          type="password"
          placeholder="Confirmer le mot de passe"
          className="w-full p-3 mb-4 rounded-xl
  bg-gray-100 dark:bg-slate-700
  text-slate-900 dark:text-white
  placeholder:text-slate-500 dark:placeholder:text-slate-400
  outline-none focus:ring-2 focus:ring-indigo-500 transition"

          onChange={handleChange}
          required
        />

       <button className="w-full bg-emerald-600 hover:bg-emerald-700
  text-white p-3 rounded-xl font-semibold transition">

          S'inscrire
        </button>

        <p className="text-center text-sm mt-4 text-slate-500 dark:text-slate-400">

          Déjà un compte ?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline"

          >
            Se connecter
          </span>
        </p>
      </form>
    </div>
  );
}
