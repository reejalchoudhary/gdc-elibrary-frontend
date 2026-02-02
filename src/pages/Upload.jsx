import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { contentAPI } from "../services/api";

import up1 from "../assets/upload1.jpg";
import up2 from "../assets/upload2.jpg";
import up3 from "../assets/upload3.jpg";

const UPLOAD_DISABLED = true; 
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfFUxqNyh6OzHI4sBkTqjaWTq5wiOK4VeFO0_Vrt9qM79oE5g/viewform?usp=dialog"; // 🔗 ADD YOUR FORM LINK

function Toast({ message, type = "success", onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.22 }}
      className={`px-4 py-2 rounded-md shadow-lg text-sm ${
        type === "success"
          ? "bg-green-500 text-white"
          : type === "error"
          ? "bg-red-500 text-white"
          : "bg-sky-700 text-white"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>{message}</div>
        <button
          onClick={onClose}
          className="ml-2 text-xs opacity-90 hover:opacity-100"
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
}

export default function Upload() {
  const [type, setType] = useState("note");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [uploader, setUploader] = useState("");
  const [file, setFile] = useState(null);
  const [toasts, setToasts] = useState([]);

  const images = [up1, up2, up3];
  const [bgIndex, setBgIndex] = useState(0);
  const CAROUSEL_MS = 3000;

  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((p) => (p + 1) % images.length);
    }, CAROUSEL_MS);
    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    const loggedIn = JSON.parse(
      sessionStorage.getItem("loggedInStudent") || "null"
    );
    if (loggedIn?.name) setUploader(loggedIn.name);

    const token =
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken");
    if (!token) navigate("/login-selector");
  }, [navigate]);

  const pushToast = (message, variant = "success", ttl = 3000) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, variant }]);
    setTimeout(
      () => setToasts((t) => t.filter((x) => x.id !== id)),
      ttl
    );
  };

  const handleFileSelect = (e) => {
    const f = e.target.files?.[0];
    if (!f) return setFile(null);
    if (f.size > 30 * 1024 * 1024)
      return pushToast("File too large (max 30MB).", "error");
    setFile(f);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (UPLOAD_DISABLED) {
      pushToast(
        "Upload is temporarily disabled. Please use Google Submission Form.",
        "error"
      );
      return;
    }

    if (!name.trim()) return pushToast("Enter file title.", "error");
    if (!category.trim()) return pushToast("Enter category.", "error");
    if (!department) return pushToast("Select department.", "error");
    if (!year) return pushToast("Select year.", "error");
    if (!file) return pushToast("Choose a file.", "error");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", name.trim());
      formData.append("category", category.trim());
      formData.append("department", department.toUpperCase());
      formData.append("year", year);

      let response;
      if (type === "book") response = await contentAPI.uploadBook(formData);
      else if (type === "note") response = await contentAPI.uploadNote(formData);
      else response = await contentAPI.uploadPYQ(formData);

      if (response.data.success) {
        pushToast("Upload successful 🎉", "success");
        setName("");
        setCategory("");
        setDepartment("");
        setYear("");
        setFile(null);
      } else {
        pushToast(response.data.message || "Upload failed!", "error");
      }
    } catch (error) {
      pushToast("Upload failed! Please try again.", "error");
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        {images.map((img, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: bgIndex === idx ? 1 : 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="fixed top-6 right-6 z-50 space-y-3">
        <AnimatePresence>
          {toasts.map((t) => (
            <Toast
              key={t.id}
              message={t.message}
              type={t.variant}
              onClose={() =>
                setToasts((s) => s.filter((x) => x.id !== t.id))
              }
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="relative z-10 p-6 flex justify-center">
        <div className="relative w-full max-w-3xl">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white/50 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20
              ${UPLOAD_DISABLED ? "blur-sm pointer-events-none select-none" : ""}
            `}
          >
            <h1 className="text-3xl font-bold text-center text-purple-800 mb-4">
              ⬆️ Upload Material
            </h1>

            <p className="text-center text-gray-700 mb-6">
              Select type and upload files to the server.
            </p>

            <div className="flex justify-center gap-4 mb-6">
              {["note", "book", "pyq"].map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setType(t)}
                  className={`px-5 py-2 rounded-full font-semibold transition ${
                    type === t
                      ? "bg-purple-600 text-white"
                      : "bg-white/70 text-purple-700"
                  }`}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Title" className="input" />
              <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category / Subject" className="input" />

              <select value={department} onChange={(e) => setDepartment(e.target.value)} className="input">
                <option value="">Select Department</option>
                <option value="BA">BA</option>
                <option value="BSC">BSC</option>
                <option value="BCOM">BCOM</option>
                <option value="BCA">BCA</option>
              </select>

              <select value={year} onChange={(e) => setYear(e.target.value)} className="input">
                <option value="">Select Year</option>
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
              </select>

              <input value={uploader} readOnly className="input md:col-span-2" />

              <label className="md:col-span-2">
                <div className="flex items-center gap-3 bg-white/60 p-3 rounded-lg border">
                  <span className="font-medium">Choose File</span>
                  <span className="text-xs text-gray-600">
                    PDF, DOCX, PPTX, Images (max 30MB)
                  </span>
                </div>
              </label>
            </div>
          </motion.form>

          {UPLOAD_DISABLED && (
            <div className="absolute inset-0 z-20 flex items-center justify-center px-4">
              <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-2xl max-w-lg w-full text-center space-y-4">
                <h2 className="text-xl font-bold text-red-600">
                  🚫 Upload Temporarily Restricted
                </h2>

                <p className="text-gray-700 text-sm">
                  The Upload feature is temporarily disabled.
                  Please submit materials using the Google Form below.
                </p>

                <div className="text-xs text-left bg-gray-100 p-3 rounded-lg space-y-1">
                  <p>📘 Fill in the correct subject, department, and year.</p>
                  <p>⏰ Materials are uploaded daily between 7–8 PM and 4–5 AM.</p>
                  <p>📝 Submissions are reviewed before publishing.</p>
                  <p>📚 Approved content appears under Study Resources page.</p>
                </div>

                <a
                  href={GOOGLE_FORM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="block bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold py-1.5 rounded-md"
                >
                  📤 Open Google Submission Form
                </a>

                <button
                  onClick={() => navigate("/contact")}
                  className="block w-full border border-purple-600 text-purple-700 text-sm py-1.5 rounded-md"
                >
                  📩 Contact Us
                </button>

                <p className="text-xs text-gray-500">
                  Thanks for helping us keep the library updated 🙌
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
