import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, UserCircle } from "lucide-react";
import collegeLogo from "../assets/collegeLogo.png";

export default function Navbar({ onLogout, isLoggedIn }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogoutClick = () => {
    onLogout();
    navigate("/login-selector");
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg px-6 py-3 flex justify-between items-center relative">
      
      <div className="flex items-center gap-3 cursor-pointer">
        <Link
          to="/home"
          className="flex items-center gap-3"
          onClick={() => setMenuOpen(false)}
        >
          <img
            src={collegeLogo}
            alt="GDC Nagrota Surian Logo"
            className="w-10 h-10 sm:w-11 sm:h-11 object-contain rounded-md shadow-sm"
          />
          <span className="hidden sm:inline-block text-xl sm:text-2xl font-bold">
            GDC Nagrota Surian E-Library
          </span>
        </Link>
      </div>

      <div className="md:hidden cursor-pointer" onClick={toggleMenu}>
        {menuOpen ? <X size={26} /> : <Menu size={26} />}
      </div>

      <div
        className={`${
          menuOpen ? "flex" : "hidden"
        } md:flex flex-col md:flex-row items-center fixed md:static top-[64px] md:top-auto
          left-0 w-full md:w-auto max-h-[70vh] md:max-h-none overflow-y-auto md:overflow-visible
          bg-gradient-to-b md:bg-none from-purple-700 to-indigo-700 z-[9999] md:z-auto
          md:space-x-6 p-4 md:p-0 transition-all duration-300`}
      >
        {isLoggedIn ? (
          <>
            <Link
              to="/home"
              className="hover:text-yellow-300 transition py-2 md:py-0"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>

            <Link
              to="/books"
              className="font-semibold text-red-500 hover:text-yellow-300 transition py-2 md:py-0"
              onClick={() => setMenuOpen(false)}
            >
              Books
            </Link>

            <Link
              to="/pyqs"
              className="font-semibold text-red-500 hover:text-yellow-300 transition py-2 md:py-0"
              onClick={() => setMenuOpen(false)}
            >
              PYQs
            </Link>

            <Link
              to="/notes"
              className="font-semibold text-red-500 hover:text-yellow-300 transition py-2 md:py-0"
              onClick={() => setMenuOpen(false)}
            >
              Notes
            </Link>

            <Link
              to="/manual-resources"
              className="font-semibold text-green-400 hover:text-yellow-300 flex items-center gap-2 py-2 md:py-0"
              onClick={() => setMenuOpen(false)}
            >
              Study Resources
              <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                NEW
              </span>
            </Link>

            <Link
              to="/contact"
              className="hover:text-yellow-300 transition py-2 md:py-0"
              onClick={() => setMenuOpen(false)}
            >
              Contact Us
            </Link>

            <Link
              to="/upload"
              className="hover:text-yellow-300 transition py-2 md:py-0"
              onClick={() => setMenuOpen(false)}
            >
              Upload
            </Link>

            <Link
              to="/discussion"
              className="hover:text-yellow-300 transition py-2 md:py-0"
              onClick={() => setMenuOpen(false)}
            >
              Discussion
            </Link>

            <button
              onClick={() => {
                navigate("/profile");
                setMenuOpen(false);
              }}
              className="mt-3 md:mt-0 hover:text-yellow-300 transition-transform transform hover:scale-110"
            >
              <UserCircle size={30} className="text-yellow-300" />
            </button>

            <button
              onClick={() => {
                handleLogoutClick();
                setMenuOpen(false);
              }}
              className="mt-3 md:mt-0 bg-red-500 hover:bg-red-600 px-4 py-1 rounded-full font-semibold transition-transform transform hover:scale-105"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login-selector"
            className="hover:text-yellow-300 transition"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
