import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";

export default function MainLayout() {
  const { darkMode } = useTheme();

  return (
    <>
      <Navbar />
      <div className={`pt-20 px-6 min-h-screen ${darkMode ? "bg-slate-900 text-white" : "bg-gray-50 text-black"}`}>
        <Outlet />
      </div>
    </>
  );
}
