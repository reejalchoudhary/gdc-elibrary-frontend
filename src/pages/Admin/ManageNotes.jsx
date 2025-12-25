import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { contentAPI, adminAPI } from "../../services/api";

export default function ManageNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    loadNotes();
    
    const interval = setInterval(loadNotes, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadNotes = async () => {
    try {
      const response = await contentAPI.getAllNotes();
      if (response.data.success) {
        setNotes(response.data.data);
      }
    } catch (error) {
      console.error("Error loading notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (noteId) => {
    if (!window.confirm("🗑️ Delete this note permanently?")) return;

    try {
      const response = await adminAPI.deleteNote(noteId);
      if (response.data.success) {
        showToast("🗑️ Note deleted successfully!", "success");
        loadNotes();
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
        <div className="text-xl">Loading notes...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-700 via-blue-700 to-indigo-700 text-white p-8">
      {toast && (
        <div
          className={`fixed top-5 right-5 flex items-center gap-2 px-5 py-3 rounded-lg shadow-lg text-white backdrop-blur-md transition-all z-50 ${
            toast.type === "error" ? "bg-red-500/90" : "bg-green-500/90"
          }`}
        >
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      <h1 className="text-3xl font-bold text-center mb-8">📝 Manage Notes</h1>

      {notes.length === 0 ? (
        <p className="text-center text-gray-300">No notes uploaded yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div
              key={note._id}
              className="bg-white/10 backdrop-blur-md p-5 rounded-xl shadow-lg"
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-lg font-semibold">{note.name}</h2>
                <button
                  onClick={() => handleDelete(note._id)}
                  className="text-red-400 hover:text-red-500"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              <p className="text-sm text-gray-300">{note.category}</p>
              <p className="text-xs text-gray-400 mt-2">
                {note.department} - {note.year}
              </p>
              <p className="text-xs text-gray-400">By: {note.uploaderName}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(note.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
