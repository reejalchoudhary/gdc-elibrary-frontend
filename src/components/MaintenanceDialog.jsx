import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const funnyMessages = [
  "Our servers went for chai ☕ and samosa 🥟. They’ll be back soon.",
  "This page is revising syllabus… very slowly 📚😴",
  "Technical issue detected. Engineer currently saying: ‘kal dekhte hain’ 😌",
  "Server said: ‘Bas 2 minute aur’… it lied 😐",
  "System under maintenance. Even computers need motivation sometimes 🧠⚡",
];

export default function MaintenanceDialog({ open, onClose }) {
  const [countdown, setCountdown] = useState(5);
  const [message] = useState(
    funnyMessages[Math.floor(Math.random() * funnyMessages.length)]
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;

    if (countdown === 0) {
      navigate("/manual-resources");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 10000);

    return () => clearTimeout(timer);
  }, [countdown, open, navigate]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center"
      >
        <h2 className="text-2xl font-bold text-purple-700 mb-3">
          ⚠️ Heads up, Scholar!
        </h2>

        <p className="text-gray-700 mb-4 leading-relaxed">
          {message}
        </p>

        <p className="text-gray-700 mb-4 leading-relaxed">
          All <b>Books, Notes & PYQs</b> are safely available inside{" "}
          <span className="font-semibold text-purple-700">
            Study Material Page
          </span>.
        </p>

        <p className="text-sm text-gray-500 mb-5">
          Redirecting automatically in{" "}
          <span className="font-bold text-purple-700">
            {countdown}
          </span>{" "}
          seconds…
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/manual-resources"
            className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            🚀 Go Now
          </Link>

          <button
            onClick={onClose}
            className="px-5 py-2 border rounded-lg hover:bg-gray-100 transition"
          >
            Stay Here 🙂
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-600 leading-relaxed">
          <p className="mb-2">
            The upload system is temporarily unavailable due to maintenance.
          </p>

          <p className="mb-3">
            Please contact the <b>Tech Team</b> for:
          </p>

          <ul className="list-disc list-inside text-left mb-3">
            <li>Uploading new academic materials</li>
            <li>Requesting urgent study content</li>
          </ul>

          <a
            href="./contact"
            className="inline-flex items-center gap-1 text-purple-600 font-medium hover:underline"
          >
            📩 Contact Management Team
          </a>
        </div>
      </motion.div>
    </div>
  );
}
