import { useEffect, useState } from "react";
import { Eye, Download, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { contentAPI, adminAPI } from "../services/api";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const role = sessionStorage.getItem("role");
    setIsAdmin(role === "admin");
    loadBooks();
    
    const interval = setInterval(loadBooks, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadBooks = async () => {
    try {
      const params = {};
      if (departmentFilter) params.department = departmentFilter;
      if (yearFilter) params.year = yearFilter;
      if (categoryFilter) params.category = categoryFilter;
      if (query) params.search = query;

      const response = await contentAPI.getAllBooks(params);
      if (response.data.success) {
        setBooks(response.data.data);
      }
    } catch (error) {
      console.error("Error loading books:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, [departmentFilter, yearFilter, categoryFilter, query]);

  const handlePreview = (fileData, mimeType) => {
    const newWindow = window.open();
    if (!newWindow) {
      showToast("Please allow popups to preview files", "error");
      return;
    }
    
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Preview</title>
          <style>
            body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f0f0f0; }
            img { max-width: 100%; max-height: 100vh; }
            embed, iframe { width: 100%; height: 100vh; border: none; }
            object { width: 100%; height: 100vh; }
          </style>
        </head>
        <body>
          ${mimeType?.startsWith('image/') 
            ? `<img src="${fileData}" alt="Preview" />`
            : mimeType === 'application/pdf'
            ? `<embed src="${fileData}" type="application/pdf" />`
            : `<iframe src="${fileData}"></iframe>`
          }
        </body>
      </html>
    `);
    newWindow.document.close();
  };

  const handleDelete = async (bookId) => {
    if (!isAdmin) {
      showToast("Only admin can delete uploads.", "error");
      return;
    }
    if (!window.confirm("Delete this item?")) return;

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

  const filtered = books.filter((b) => {
    const q = query.trim().toLowerCase();
    if (q && !b.name.toLowerCase().includes(q) && !b.category.toLowerCase().includes(q)) return false;
    if (departmentFilter && b.department?.toLowerCase() !== departmentFilter.toLowerCase()) return false;
    if (yearFilter && b.year?.toLowerCase() !== yearFilter.toLowerCase()) return false;
    if (categoryFilter && b.category?.toLowerCase() !== categoryFilter.toLowerCase()) return false;
    return true;
  });

  const departments = Array.from(new Set(books.map((b) => b.department).filter(Boolean)));
  const years = Array.from(new Set(books.map((b) => b.year).filter(Boolean)));
  const categories = Array.from(new Set(books.map((b) => b.category).filter(Boolean)));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading books...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#E3F2FD] via-[#BBDEFB] to-[#90CAF9] text-gray-800">
      
      <motion.div
        className="absolute top-0 left-0 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-0 right-0 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        animate={{ y: [0, -25, 0], x: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
      />

      {toast && (
        <div
          className={`fixed top-5 right-5 flex items-center gap-2 px-5 py-3 rounded-lg shadow-lg text-white backdrop-blur-md transition-all z-50 ${
            toast.type === "error" ? "bg-red-500/90" : "bg-green-500/90"
          }`}
        >
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      
      <div className="relative z-10 p-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-6xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20"
        >
          <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">📚 Uploaded Books</h1>

          
          <div className="flex flex-col md:flex-row gap-3 md:items-center mb-6">
            <input
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Search by name or category..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select
              className="border border-gray-300 rounded-lg px-4 py-2"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map((d, i) => (
                <option key={i} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
            >
              <option value="">All Years</option>
              {years.map((y, i) => (
                <option key={i} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          
          {filtered.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center text-gray-600"
            >
              No books found.
            </motion.p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((book) => (
                <motion.div
                  key={book._id}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.4,
                    type: "spring",
                    stiffness: 120,
                  }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-blue-100 to-cyan-100 p-5 rounded-xl shadow-lg transition-transform transform hover:shadow-xl"
                >
                  <h2 className="font-semibold text-lg truncate text-blue-700">{book.name}</h2>
                  <p className="text-sm text-gray-700">📖 {book.category}</p>
                  <p className="text-sm text-gray-600">🏛 {book.department || "—"}</p>
                  <p className="text-sm text-gray-600 mb-3">🎓 {book.year || "—"}</p>
                  <p className="text-xs text-gray-500 mb-3">By: {book.uploaderName}</p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePreview(book.fileData, book.mimeType)}
                      className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg text-center transition-colors flex items-center justify-center"
                    >
                      <Eye className="inline-block mr-1 w-4 h-4" /> Preview
                    </button>
                    <a
                      href={book.fileData}
                      download={book.fileName}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-center transition-colors flex items-center justify-center"
                    >
                      <Download className="inline-block mr-1 w-4 h-4" /> Download
                    </a>
                  </div>

                  {isAdmin && (
                    <div className="mt-3 text-right">
                      <button
                        onClick={() => handleDelete(book._id)}
                        className="text-red-600 hover:underline flex items-center gap-1 text-sm"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
