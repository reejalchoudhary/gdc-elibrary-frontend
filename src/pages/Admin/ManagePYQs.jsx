import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash2, FileText, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { contentAPI, adminAPI } from "../../services/api";

export default function ManagePYQs() {
  const navigate = useNavigate();
  const [pyqs, setPYQs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    loadPYQs();
    
    const interval = setInterval(loadPYQs, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadPYQs = async () => {
    try {
      const response = await contentAPI.getAllPYQs();
      if (response.data.success) {
        setPYQs(response.data.data);
      }
    } catch (error) {
      console.error("Error loading PYQs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (pyqId) => {
    if (!window.confirm("🗑️ Delete this PYQ permanently?")) return;

    try {
      const response = await adminAPI.deletePYQ(pyqId);
      if (response.data.success) {
        showToast("🗑️ PYQ deleted successfully!", "success");
        loadPYQs();
      } else {
        showToast(response.data.message || "Delete failed", "error");
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Delete failed", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading PYQs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-700 text-white p-8 flex flex-col items-center">
      {toast && (
        <div
          className={`fixed top-5 right-5 flex items-center gap-2 px-5 py-3 rounded-lg shadow-lg text-white backdrop-blur-md transition-all z-50 ${
            toast.type === "error" ? "bg-red-500/90" : "bg-green-500/90"
          }`}
        >
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg"
      >
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 mb-6"
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold text-center mb-8 text-yellow-300">
          📄 Manage PYQs
        </h1>

        {pyqs.length === 0 ? (
          <p className="text-center text-gray-300">No PYQs uploaded yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {pyqs.map((pyq) => (
              <motion.div
                key={pyq._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white bg-opacity-10 p-5 rounded-xl shadow-lg"
              >
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <FileText size={20} /> {pyq.name}
                  </h2>
                  <button
                    onClick={() => handleDelete(pyq._id)}
                    className="text-red-400 hover:text-red-500"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                <p className="text-gray-300 mt-2">{pyq.department} - {pyq.year}</p>
                <p className="text-sm text-gray-400">By {pyq.uploaderName}</p>
                <p className="text-xs text-gray-500 mt-1">{pyq.category}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Uploaded: {new Date(pyq.createdAt).toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
