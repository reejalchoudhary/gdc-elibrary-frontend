import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { discussionAPI, adminAPI } from "../services/api";

export default function Discussion() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const boxRef = useRef();

  useEffect(() => {
    const role = sessionStorage.getItem("role");
    setIsAdmin(role === "admin");
    loadDiscussions();
    
    const interval = setInterval(loadDiscussions, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadDiscussions = async () => {
    try {
      const response = await discussionAPI.getAllDiscussions();
      if (response.data.success) {
        setMessages(response.data.data);
        setTimeout(() => {
          if (boxRef.current) {
            boxRef.current.scrollTop = boxRef.current.scrollHeight;
          }
        }, 100);
      }
    } catch (error) {
      console.error("Error loading discussions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) {
      alert("⚠️ Please enter a message!");
      return;
    }

    try {
      const response = await discussionAPI.createDiscussion(input.trim());
      if (response.data.success) {
        setInput("");
        loadDiscussions();
      } else {
        alert(response.data.message || "Failed to send message");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send message");
    }
  };

  const handleDelete = async (messageId) => {
    if (!isAdmin) return;
    if (!window.confirm("Delete this message?")) return;

    try {
      const response = await adminAPI.deleteDiscussion(messageId);
      if (response.data.success) {
        loadDiscussions();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete message");
    }
  };

  const adminMessages = messages.filter((m) => m.from === "Admin");
  const otherMessages = messages.filter((m) => m.from !== "Admin");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading discussions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-700 text-white py-10 px-4 flex flex-col items-center">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6"
      >
        💬 College Discussion Group
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 backdrop-blur-lg border border-white/30 shadow-2xl rounded-2xl w-full max-w-2xl p-6 flex flex-col"
      >
       
        {adminMessages.length > 0 && (
          <div className="bg-yellow-300/20 border border-yellow-400 p-4 rounded-lg mb-4 shadow-md">
            <h3 className="text-lg font-semibold text-yellow-300 mb-2">
              📢 Official Announcements
            </h3>
            {adminMessages.map((msg) => (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-yellow-100/10 p-2 rounded-lg mb-2 flex justify-between items-start"
              >
                <div>
                  <p className="text-yellow-200 font-medium">{msg.text}</p>
                  <p className="text-xs text-gray-300">
                    {msg.name} ({msg.from}) • {new Date(msg.createdAt).toLocaleString()}
                  </p>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(msg._id)}
                    className="text-red-400 hover:text-red-300 ml-2"
                  >
                    ✕
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}

       
        <div
          className="flex-grow h-64 overflow-y-auto border border-white/20 p-3 rounded-lg space-y-2 scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-transparent"
          ref={boxRef}
        >
          {otherMessages.length === 0 ? (
            <p className="text-gray-300 text-center">
              No messages yet — start the conversation!
            </p>
          ) : (
            otherMessages.map((msg) => (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-2 rounded-lg flex justify-between items-start ${
                  msg.highlight
                    ? "bg-yellow-200/30 border border-yellow-400"
                    : "bg-purple-200/20"
                }`}
              >
                <div>
                  <p className="text-white">{msg.text}</p>
                  <p className="text-xs text-gray-300 mt-1">
                    {msg.name} ({msg.from}) • {new Date(msg.createdAt).toLocaleString()}
                  </p>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(msg._id)}
                    className="text-red-400 hover:text-red-300 ml-2"
                  >
                    ✕
                  </button>
                )}
              </motion.div>
            ))
          )}
        </div>


        <form onSubmit={handleSend} className="flex flex-col sm:flex-row gap-2 mt-4">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-grow border border-white/40 bg-white/30 text-white placeholder-white/70 p-2 rounded focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            className="bg-yellow-400 text-purple-900 font-semibold px-4 rounded-lg hover:bg-yellow-500 transition"
            type="submit"
          >
            Send
          </button>
        </form>
      </motion.div>
    </div>
  );
}
