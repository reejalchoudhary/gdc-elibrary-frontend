import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Books from "./pages/Books";
import Upload from "./pages/Upload";
import PYQs from "./pages/PYQs";
import Discussion from "./pages/Discussion";
import Footer from "./components/Footer";

import Register from "./pages/Register";
import ManageStudents from "./pages/Admin/ManageStudents";

import StudentLogin from "./pages/Login/StudentLogin";
import AdminLogin from "./pages/Login/AdminLogin";

import Profile from "./pages/Profile";
import StudentDashboard from "./pages/Dashboard/StudentDashboard";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import LoginSelector from "./pages/Login/LoginSelector";
import Notes from "./pages/Notes";

import ManageNotes from "./pages/Admin/ManageNotes";
import ManageBooks from "./pages/Admin/ManageBooks";
import ManagePYQs from "./pages/Admin/ManagePYQs";
import ManageDiscussions from "./pages/Admin/ManageDiscussions";
import ManageUsers from "./pages/Admin/ManageUsers";
import { authAPI, clearTokens } from "./services/api";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const sessionLoggedIn = sessionStorage.getItem("loggedIn") === "true";
      const sessionRole = sessionStorage.getItem("role");
      
      if (sessionLoggedIn && sessionRole) {
        setIsLoggedIn(true);
        setRole(sessionRole);
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
      if (token) {
        try {
          const response = await authAPI.getCurrentUser();
          if (response.data.success) {
            const user = response.data.data;
            setIsLoggedIn(true);
            setRole(user.role);
            sessionStorage.setItem("loggedIn", "true");
            sessionStorage.setItem("role", user.role);
            if (user.role === "student") {
              sessionStorage.setItem("loggedInStudent", JSON.stringify(user));
            }
          } else {
            clearTokens();
            setIsLoggedIn(false);
            setRole("");
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          if (error.response?.status === 401 || error.response?.status === 403) {
            clearTokens();
            setIsLoggedIn(false);
            setRole("");
          } else {
            console.warn("Network error during auth check, keeping current state");
          }
        }
      } else {
        setIsLoggedIn(false);
        setRole("");
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogin = (userRole, userData) => {
    setIsLoggedIn(true);
    setRole(userRole);
    sessionStorage.setItem("loggedIn", "true");
    sessionStorage.setItem("role", userRole);
    if (userData && userRole === "student") {
      sessionStorage.setItem("loggedInStudent", JSON.stringify(userData));
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearTokens();
      setIsLoggedIn(false);
      setRole("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop /> 
      <div className="min-h-screen flex flex-col text-gray-800">
        {role !== "admin" && (
          <Navbar onLogout={handleLogout} isLoggedIn={isLoggedIn} role={role} />
        )}

        <main className="flex-grow">
          <Routes>
            
            <Route
              path="/"
              element={<RedirectLogic isLoggedIn={isLoggedIn} role={role} />}
            />
            <Route path="/login-selector" element={<LoginSelector />} />
            <Route
              path="/student-login"
              element={<StudentLogin onLogin={(role, userData) => handleLogin(role, userData)} />}
            />
            <Route
              path="/admin-login"
              element={<AdminLogin onLogin={(role, userData) => handleLogin(role, userData)} />}
            />
            <Route path="/profile" element={<Profile />} />

            <Route path="/register" element={<Register />} />

            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />

            <Route path="/home" element={<Home />} />
            <Route path="/books" element={<Books />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/pyqs" element={<PYQs />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/discussion" element={<Discussion />} />

            
            <Route path="/admin/manage-notes" element={<ManageNotes />} />
            <Route path="/admin/manage-books" element={<ManageBooks />} />
            <Route path="/admin/manage-pyqs" element={<ManagePYQs />} />
            <Route path="/admin/manage-discussions" element={<ManageDiscussions />} />
            <Route path="/admin/manage-users" element={<ManageUsers />} />
            <Route path="/admin/manage-students" element={<ManageStudents />} />
          </Routes>
        </main>

        {role !== "admin" && <Footer />}
      </div>
    </Router>
  );
}

function RedirectLogic({ isLoggedIn, role }) {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoggedIn) {
        if (role === "admin") {
          navigate("/admin-dashboard", { replace: true });
        } else {
          navigate("/home", { replace: true });
        }
      } else {
        navigate("/login-selector", { replace: true });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isLoggedIn, role, navigate]);

  return null;
}
