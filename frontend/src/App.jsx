import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import AuthProvider from "./context/AuthContext";
import Chat from "./pages/Chat";
import Notifications from "./pages/notification";
import Addfriends from "./pages/Addfriends";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import MainLayout from "./layouts/MainLayout";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* 🌍 PUBLIC */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 💬 CHAT → SANS NAVBAR / DARK OK */}
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            }
          />

          {/* ☀️ AUTRES PAGES → NAVBAR + MODE CLAIR */}
          <Route
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route path="/add" element={<Addfriends />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profil" element={<Profile />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
