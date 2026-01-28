import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { contentAPI, adminAPI } from "../services/api";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [year, setYear] = useState("All");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role = sessionStorage.getItem("role");
    setIsAdmin(role === "admin");
    loadNotes();
    
    const interval = setInterval(loadNotes, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadNotes = async () => {
    try {
      const params = {};
      if (department !== "All") params.department = department;
      if (year !== "All") params.year = year;
      if (search) params.search = search;

      const response = await contentAPI.getAllNotes(params);
      if (response.data.success) {
        setNotes(response.data.data);
      }
    } catch (error) {
      console.error("Error loading notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (fileData, mimeType) => {
    const newWindow = window.open();
    if (!newWindow) {
      alert("Please allow popups to preview files");
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

  useEffect(() => {
    loadNotes();
  }, [department, year, search]);

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      !search ||
      note.name.toLowerCase().includes(search.toLowerCase()) ||
      note.category.toLowerCase().includes(search.toLowerCase()) ||
      note.uploaderName.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading notes...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E0F7FA] via-[#B2EBF2] to-[#80DEEA] p-6 text-gray-800">
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-4xl font-extrabold text-center text-cyan-700 mb-10 drop-shadow-md"
      >
        📘 Notes Library
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-wrap justify-center gap-4 mb-10"
      >
        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-cyan-300 rounded-xl w-64 focus:ring-2 focus:ring-cyan-400 bg-white/70 backdrop-blur-md outline-none transition-all"
        />
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="px-4 py-2 border border-cyan-300 rounded-xl focus:ring-2 focus:ring-cyan-400 bg-white/70 backdrop-blur-md"
        >
          <option value="All">All Departments</option>
          <option value="BA">BA</option>
          <option value="BSC">BSC</option>
          <option value="BCOM">BCOM</option>
          <option value="BCA">BCA</option>
        </select>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="px-4 py-2 border border-cyan-300 rounded-xl focus:ring-2 focus:ring-cyan-400 bg-white/70 backdrop-blur-md"
        >
          <option value="All">All Years</option>
          <option value="1st Year">1st Year</option>
          <option value="2nd Year">2nd Year</option>
          <option value="3rd Year">3rd Year</option>
        </select>
      </motion.div>

      {filteredNotes.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500 text-lg mt-12"
        >
          No notes found. Try uploading one! ✏️
        </motion.p>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
          className="flex flex-wrap justify-center gap-8"
        >
          {filteredNotes.map((note) => (
            <motion.div
              key={note._id}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.9 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { type: "spring", stiffness: 100 },
                },
              }}
              whileHover={{ scale: 1.05, rotate: 0.5 }}
              className="bg-white/80 backdrop-blur-lg shadow-lg rounded-2xl p-6 w-72 text-center hover:shadow-2xl border border-cyan-100 transition-all duration-300"
            >
              <h2 className="text-lg font-semibold text-cyan-700 mb-2 break-words">
                {note.uploaderName || "Unknown"}
              </h2>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Dept:</strong> {note.department || "N/A"} |{" "}
                <strong>Year:</strong> {note.year || "N/A"}
              </p>
              <p className="italic text-xs text-gray-500 mb-3">
                {note.name} <br /> ({note.category})
              </p>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => handlePreview(note.fileData, note.mimeType)}
                  className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 text-sm font-medium transition-all"
                >
                  Preview
                </button>
                <a
                  href={note.fileData}
                  download={note.fileName}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-medium transition-all"
                >
                  Download
                </a>
              </div>
              <p className="text-xs text-gray-400 mt-3">
                Uploaded: {new Date(note.createdAt).toLocaleString()}
              </p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
