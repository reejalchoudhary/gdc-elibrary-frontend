import { useState } from "react";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";

const MATERIALS = [

  {
    title: "Operating System Book",
    type: "Book",
    department: "BCA",
    year: "3rd Year",
    uploadedBy: "Admin",
    link: "",
  },
  {
    title: "C Programming Notes",
    type: "Notes",
    department: "BCA",
    year: "1st Year",
    uploadedBy: "Admin",
    link: "",
  },
];

const TYPE_STYLES = {
  Notes: {
    card: "from-purple-500 to-indigo-500",
    badge: "bg-purple-100 text-purple-700",
    button: "bg-purple-600 hover:bg-purple-700",
  },
  PYQ: {
    card: "from-orange-400 to-amber-500",
    badge: "bg-orange-100 text-orange-700",
    button: "bg-orange-500 hover:bg-orange-600",
  },
  Book: {
    card: "from-sky-500 to-cyan-500",
    badge: "bg-sky-100 text-sky-700",
    button: "bg-sky-600 hover:bg-sky-700",
  },
};

export default function ManualResources() {
  const [department, setDepartment] = useState("All");
  const [type, setType] = useState("All");
  const [year, setYear] = useState("All");
  const [visibleCount, setVisibleCount] = useState(6); 

  const filteredMaterials = MATERIALS.filter((item) => {
    const matchesDepartment =
      department === "All" || item.department === department;
    const matchesType = type === "All" || item.type === type;
    const matchesYear = year === "All" || item.year === year;
    return matchesDepartment && matchesType && matchesYear;
  });

  const visibleMaterials = filteredMaterials.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100 px-3 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >

        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-800 flex items-center justify-center gap-2">
            📚 Study Resources
            <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full">
              TEMP
            </span>
          </h1>
          <p className="text-gray-600 mt-2 text-xs sm:text-sm md:text-base max-w-3xl mx-auto">
            Books, Notes, and Previous Year Question Papers are temporarily
            available here while regular services are under maintenance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-w-4xl mx-auto mb-6">
          <select value={department} onChange={(e) => { setDepartment(e.target.value); setVisibleCount(6); }} className="px-3 py-2 text-sm rounded-lg border bg-white shadow-sm">
            <option value="All">All Departments</option>
            <option value="BCA">BCA</option>
            <option value="BSC">BSC</option>
            <option value="BA">BA</option>
            <option value="BCOM">BCOM</option>
          </select>

          <select value={type} onChange={(e) => { setType(e.target.value); setVisibleCount(6); }} className="px-3 py-2 text-sm rounded-lg border bg-white shadow-sm">
            <option value="All">All Types</option>
            <option value="Book">Book</option>
            <option value="Notes">Notes</option>
            <option value="PYQ">PYQ</option>
          </select>

          <select value={year} onChange={(e) => { setYear(e.target.value); setVisibleCount(6); }} className="px-3 py-2 text-sm rounded-lg border bg-white shadow-sm">
            <option value="All">All Years</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
          </select>
        </div>

        {visibleMaterials.length === 0 ? (
          <p className="text-center text-gray-500 text-sm">
            No materials found.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleMaterials.map((item, index) => {
                const styles = TYPE_STYLES[item.type];

                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.03 }}
                    className={`rounded-xl shadow-lg p-3 sm:p-4 text-white bg-gradient-to-br ${styles.card}`}
                  >
                    <span className={`inline-block mb-2 px-2 py-0.5 text-[10px] font-semibold rounded-full ${styles.badge}`}>
                      {item.type}
                    </span>

                    <h3 className="font-semibold text-sm sm:text-base mb-2 leading-snug">
                      {item.title}
                    </h3>

                    <div className="text-[11px] sm:text-xs space-y-1">
                      <p>🎓 <strong>Dept:</strong> {item.department}</p>
                      <p>📅 <strong>Year:</strong> {item.year}</p>
                      <p className="flex items-center gap-1">
                        <Upload size={12} />
                        <span><strong>By:</strong> {item.uploadedBy}</span>
                      </p>
                    </div>

                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className={`mt-3 block w-full text-center px-3 py-1.5 text-xs rounded-md font-semibold transition ${styles.button}`}
                    >
                      Get Access 🔗
                    </a>
                  </motion.div>
                );
              })}
            </div>

            {visibleCount < filteredMaterials.length && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="px-6 py-2 text-sm font-semibold rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}

        <div className="mt-8 text-center text-xs text-gray-600">
          Upload facility is temporarily disabled.  
          Please contact the platform team for updates.
        </div>
      </motion.div>
    </div>
  );
}
