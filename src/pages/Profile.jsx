import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCircle } from "lucide-react";
import { authAPI } from "../services/api";

export default function Profile() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      if (response.data.success) {
        setStudent(response.data.data);
      } else {
        const stored = sessionStorage.getItem("loggedInStudent");
        if (stored) {
          try {
            setStudent(JSON.parse(stored));
          } catch (e) {
            console.error("Error parsing stored data:", e);
          }
        }
      }
    } catch (error) {
      const stored = sessionStorage.getItem("loggedInStudent");
      if (stored) {
        try {
          setStudent(JSON.parse(stored));
        } catch (e) {
          console.error("Error parsing stored data:", e);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-white bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-500">
        <p className="text-lg">Loading profile...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-white bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-500">
        <p className="text-lg">No student logged in.</p>
        <button
          onClick={() => navigate("/login-selector")}
          className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-purple-900 px-5 py-2 rounded-full font-semibold"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-500 p-6 text-white">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
        <UserCircle className="w-20 h-20 text-yellow-300 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">{student.name || "Unnamed Student"}</h1>
        <p className="text-yellow-200 mb-6">Student Profile</p>

        <div className="text-left space-y-3 text-white/90">
          <p><span className="font-semibold text-yellow-300">Email:</span> {student.email || "Not Provided"}</p>
          <p><span className="font-semibold text-yellow-300">Department:</span> {student.department || "Not Provided"}</p>
          <p><span className="font-semibold text-yellow-300">Year:</span> {student.year || "Not Provided"}</p>
          <p><span className="font-semibold text-yellow-300">Roll No:</span> {student.rollno || student.rollNo || "Not Provided"}</p>
          <p><span className="font-semibold text-yellow-300">Status:</span> {student.status || "Not Provided"}</p>
        </div>

        <button
          onClick={() => navigate("/home")}
          className="mt-8 bg-yellow-400 hover:bg-yellow-500 text-purple-900 px-6 py-2 rounded-full font-semibold transition-transform hover:scale-105"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
