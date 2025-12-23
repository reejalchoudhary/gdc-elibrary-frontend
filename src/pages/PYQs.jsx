import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { contentAPI } from "../services/api";

export default function PYQs() {
  const [pyqs, setPyqs] = useState([]);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPYQs();
    
    const interval = setInterval(loadPYQs, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadPYQs = async () => {
    try {
      const params = {};
      if (departmentFilter) params.department = departmentFilter;
      if (yearFilter) params.year = yearFilter;
      if (search) params.search = search;

      const response = await contentAPI.getAllPYQs(params);
      if (response.data.success) {
        setPyqs(response.data.data);
      }
    } catch (error) {
      console.error("Error loading PYQs:", error);
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
    loadPYQs();
  }, [departmentFilter, yearFilter, search]);

  const filtered = pyqs.filter((p) => {
    return (
      (!search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())) &&
      (!departmentFilter || p.department === departmentFilter) &&
      (!yearFilter || p.year === yearFilter)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading PYQs...</div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen flex flex-col items-center p-10 
      bg-gradient-to-br from-indigo-300 via-purple-300 to-cyan-200 overflow-hidden"
    >
      
      <div className="absolute w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>

      <motion.h1
        className="text-4xl md:text-5xl font-extrabold text-purple-800 mb-8 drop-shadow-lg text-center z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        📄 Previous Year Question Papers
      </motion.h1>

    
      <motion.div
        className="flex flex-wrap justify-center gap-4 mb-8 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <input
          type="text"
          placeholder="Search by name or category..."
          className="border border-purple-300 px-4 py-2 rounded-lg w-60 backdrop-blur-md bg-white/70 focus:ring-2 focus:ring-purple-500 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border border-purple-300 px-4 py-2 rounded-lg w-48 backdrop-blur-md bg-white/70 focus:ring-2 focus:ring-purple-500 outline-none"
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          <option value="">All Departments</option>
          <option value="BA">BA</option>
          <option value="BSC">BSC</option>
          <option value="BCOM">BCOM</option>
          <option value="BCA">BCA</option>
        </select>
        <select
          className="border border-purple-300 px-4 py-2 rounded-lg w-36 backdrop-blur-md bg-white/70 focus:ring-2 focus:ring-purple-500 outline-none"
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
        >
          <option value="">All Years</option>
          <option value="1st Year">1st Year</option>
          <option value="2nd Year">2nd Year</option>
          <option value="3rd Year">3rd Year</option>
        </select>
      </motion.div>

     
      {filtered.length === 0 ? (
        <p className="text-center text-gray-700 bg-white/50 px-6 py-3 rounded-xl backdrop-blur-md z-10">
          No PYQs found 😔
        </p>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 z-10 w-full max-w-6xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {filtered.map((file) => (
            <motion.div
              key={file._id}
              whileHover={{ scale: 1.05 }}
              className="bg-white/70 backdrop-blur-md shadow-2xl rounded-2xl p-6 flex flex-col items-center text-center transition-all border border-purple-200"
            >
              <p className="text-lg font-semibold text-purple-700 mb-2">
                {file.name}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Category:</strong> {file.category}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Dept:</strong> {file.department} |{" "}
                <strong>Year:</strong> {file.year}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Uploaded by <span className="font-medium">{file.uploaderName}</span>
              </p>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handlePreview(file.fileData, file.mimeType)}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg shadow-md transition-transform hover:scale-105"
                >
                  Preview
                </button>
                <a
                  href={file.fileData}
                  download={file.fileName}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md transition-transform hover:scale-105"
                >
                  Download
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
