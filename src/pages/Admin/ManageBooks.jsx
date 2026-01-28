import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Book, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { contentAPI, adminAPI } from "../../services/api";

export default function ManageBooks() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    loadBooks();
    
    const interval = setInterval(loadBooks, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadBooks = async () => {
    try {
      const response = await contentAPI.getAllBooks();
      if (response.data.success) {
        setBooks(response.data.data);
      }
    } catch (error) {
      console.error("Error loading books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm("🗑️ Delete this book permanently?")) return;

    try {
      const response = await adminAPI.deleteBook(bookId);
      if (response.data.success) {
        showToast("🗑️ Book deleted successfully!", "success");
        loadBooks();
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
        <div className="text-xl">Loading books...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-700 text-white p-8 flex flex-col items-center">
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
          📘 Manage Books
        </h1>

        {books.length === 0 ? (
          <p className="text-center text-gray-300">No books uploaded yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {books.map((book) => (
              <motion.div
                key={book._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white bg-opacity-10 p-5 rounded-xl shadow-lg"
              >
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Book size={20} /> {book.name}
                  </h2>
                  <button
                    onClick={() => handleDelete(book._id)}
                    className="text-red-400 hover:text-red-500"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                <p className="text-gray-300 mt-2">{book.department} - {book.year}</p>
                <p className="text-sm text-gray-400">By {book.uploaderName}</p>
                <p className="text-xs text-gray-500 mt-1">{book.category}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Uploaded: {new Date(book.createdAt).toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
