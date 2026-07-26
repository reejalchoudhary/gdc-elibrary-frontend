import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import logo from "../../assets/logo.png";
import MaintenanceModal from "../../components/MaintenanceModal";


export default function LoginSelector() {
  const navigate = useNavigate();
  const MAINTENANCE_MODE = false;
  const [showMaintenance, setShowMaintenance] = useState(false);

      useEffect(() => {
      if (!MAINTENANCE_MODE) return;
      const timer = setTimeout(() => {
      setShowMaintenance(true);
      }, 1500); 

      return () => clearTimeout(timer);

  }, []);

  return (
   <>


    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-500 px-4">
      
      <div
        className="
          w-full max-w-md rounded-3xl p-8 md:p-10 text-center
          bg-white/25 backdrop-blur-md
          border border-white/30
          shadow-[0_20px_50px_rgba(0,0,0,0.25)]
        "
      >

        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="GDC Nagrota Surian Logo"
            className="w-32 h-32 rounded-full object-cover bg-white p-2 shadow-md"
          />
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold mb-2 leading-tight text-gray-900">
          Welcome to
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-600">
            GDC Nagrota Surian
            <br />
             E-Library
          </span>
        </h1>

        <p className="text-gray-800/80 mb-7 text-sm">
          Please select your login type to continue
        </p>

        <div className="flex flex-col space-y-4">
          <button
            onClick={() => navigate("/student-login")}
            className="
              w-full py-3 rounded-xl font-semibold text-white
              bg-gradient-to-r from-purple-600 to-pink-600
              shadow-lg active:scale-95 transition
            "
          >
            👨‍🎓 Student Login
          </button>

          <button
            onClick={() => navigate("/admin-login")}
            className="
              w-full py-3 rounded-xl font-semibold text-white
              bg-gradient-to-r from-indigo-600 to-blue-600
              shadow-lg active:scale-95 transition
            "
          >
            🧑‍💼 Admin Login
          </button>
        </div>

        <p className="text-gray-900/70 text-xs mt-7">
          © 2025 GDC Nagrota Surian E-Library  
          <br />
          Built by students, for students 💙
        </p>
      </div>
    </div>
      <MaintenanceModal
        isOpen={showMaintenance}
        onClose={() => setShowMaintenance(false)}
      />
    </>
  );
}
