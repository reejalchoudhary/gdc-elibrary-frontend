import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { discussionAPI, adminAPI } from "../../services/api";

export default function ManageDiscussions() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    loadDiscussions();
    
    const interval = setInterval(loadDiscussions, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadDiscussions = async () => {
    try {
      const response = await discussionAPI.getAllDiscussions();
      if (response.data.success) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error("Error loading discussions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (messageId) => {
    if (!window.confirm("🗑️ Delete this message permanently?")) return;

    try {
      const response = await adminAPI.deleteDiscussion(messageId);
      if (response.data.success) {
        showToast("🗑️ Message deleted successfully!", "success");
        loadDiscussions();
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
        <div className="text-xl">Loading discussions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-700 text-white p-8">
      {toast && (
        <div
          className={`fixed top-5 right-5 flex items-center gap-2 px-5 py-3 rounded-lg shadow-lg text-white backdrop-blur-md transition-all z-50 ${
            toast.type === "error" ? "bg-red-500/90" : "bg-green-500/90"
          }`}
        >
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      <h1 className="text-3xl font-bold text-center mb-8">💬 Manage Discussions</h1>

      {messages.length === 0 ? (
        <p className="text-center text-gray-300">No discussion messages yet.</p>
      ) : (
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((msg) => (
            <motion.div
              key={msg._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-lg flex justify-between items-start"
            >
              <div className="flex-1">
                <p className="text-white mb-2">{msg.text}</p>
                <p className="text-xs text-gray-300">
                  {msg.name} ({msg.from}) • {new Date(msg.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(msg._id)}
                className="text-red-400 hover:text-red-500 ml-4"
              >
                <Trash2 size={20} />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
