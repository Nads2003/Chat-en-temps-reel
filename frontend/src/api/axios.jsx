import axios from "axios";

// Détecter si on est en prod ou local
const isProd = window.location.hostname !== "localhost";

const BASE_URL = isProd
  ? "https://web-production-6a3e3.up.railway.app/api" // Production
  : "http://127.0.0.1:8000/api"; // Local

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access"); // ton JWT
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
