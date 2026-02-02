import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import img1 from "../assets/home1.jpg";
import img2 from "../assets/home2.jpg";
import img3 from "../assets/home3.jpg";
import img4 from "../assets/home4.jpg";
import img5 from "../assets/home5.jpg";

export default function Home() {
  const [selectedDept, setSelectedDept] = useState("");
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  const departments = ["BA", "BSc", "BCom", "BCA"];
  const images = [img1, img2, img3, img4, img5];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000); 

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-10 overflow-hidden">

      <div className="absolute inset-0 -z-10">
        {images.map((img, i) => (
          <div
            key={i}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{
              backgroundImage: `url(${img})`,
              opacity: index === i ? 1 : 0,
            }}
          />
        ))}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white text-center mb-4 leading-tight">
         Welcome to <br className="sm:hidden" />
        GDC Nagrota Surian E-Library
      </h1>

      <p className="text-gray-200 text-sm sm:text-base md:text-lg text-center mb-8 max-w-xl px-2">
        Select your department below to explore notes, PYQs, and study materials
        designed for your course.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 w-full max-w-md">
        {departments.map((dept) => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
            className={`py-3 rounded-xl font-semibold transition ${
              selectedDept === dept
                ? "bg-purple-600 text-white"
                : "bg-white/80 text-purple-800 hover:bg-purple-100"
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {selectedDept && (
        <div className="bg-white/90 rounded-2xl p-6 sm:p-8 w-full max-w-xl text-center shadow-xl">
          <h2 className="text-xl sm:text-2xl font-bold text-purple-700 mb-6">
            📚 {selectedDept} Department Resources
          </h2>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/notes")}
              className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-3 rounded-lg font-semibold"
            >
              📒 Notes
            </button>

            <button
              onClick={() => navigate("/pyqs")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold"
            >
              📄 PYQs
            </button>

            <button
              onClick={() => navigate("/books")}
              className="bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-lg font-semibold"
            >
              📘 Books
            </button>

            <button
              onClick={() => navigate("/upload")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-lg font-semibold"
            >
              ⬆️ Upload Material
            </button>
          </div>

          <p className="text-xs sm:text-sm text-gray-600 mt-6">
            Selected Department:{" "}
            <span className="font-semibold text-purple-700">
              {selectedDept}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
