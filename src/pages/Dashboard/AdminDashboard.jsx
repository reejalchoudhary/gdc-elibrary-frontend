import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  FaBook,
  FaFileAlt,
  FaStickyNote,
  FaComments,
  FaUsers,
  FaFolderOpen,
  FaChartBar,
  FaSignOutAlt,
  FaUserShield,
} from "react-icons/fa";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black px-5 py-10">

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="max-w-7xl mx-auto"
      >

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-5 sm:p-6 lg:p-8 md:p-10">

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 w-full">

              <div className="w-20 h-20 rounded-3xl bg-indigo-600 flex items-center justify-center text-white text-4xl shadow-lg">

                <FaUserShield />

              </div>

              <div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl text-center sm:text-left font-bold text-white">
                  Admin Dashboard
                </h1>

                <p className="text-slate-300 mt-3 leading-6 sm:leading-7 text-sm sm:text-base max-w-2xl text-center sm:text-left">
                  Welcome to the
                  <span className="text-indigo-400 text-sm sm:text-base font-semibold">
                    {" "}GDC Nagrota Surian E-Library Management System
                  </span>.
                  Manage books, notes, previous year question papers,
                  discussions, users and uploaded resources from one place.
                </p>

              </div>

            </div>

            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl px-6 py-5 flex flex-col justify-center w-full sm:w-auto lg:min-w-[230px]">

              <p className="text-slate-400 text-sm">
                Logged in as
              </p>

              <h2 className="text-white text-xl sm:text-2xl font-bold mt-1">
                Administrator
              </h2>

              <p className="text-slate-400 mt-2 text-sm">
                E-Library Control Panel
              </p>

            </div>

          </div>

        </div>

        <div className="grid grid-cols-1 min-[430px]:grid-cols-2 gap-5 md:gap-6 gap-6 mt-10">

        <motion.div
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
          className="bg-white/5 backdrop-blur-xl border border-blue-500/20 hover:border-blue-400 rounded-3xl p-5 sm:p-6 lg:p-8 shadow-xl flex flex-col justify-between"
        >
          <div>
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-3xl text-white mb-6">
              <FaBook />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
              Manage Books
            </h2>

            <p className="text-slate-300 leading-6 sm:leading-7 text-sm sm:text-base">
              Upload, edit and remove books available in the digital library.
              Keep the collection updated for all students.
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/manage-books")}
            className="mt-8 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-semibold py-2.5 sm:py-3 rounded-xl transition-all duration-200"
          >
            Go to Books
          </button>
        </motion.div>


        <motion.div
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
          className="bg-white/5 backdrop-blur-xl border border-indigo-500/20 hover:border-indigo-400 rounded-3xl p-5 sm:p-6 lg:p-8 shadow-xl flex flex-col justify-between"
        >
          <div>
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-3xl text-white mb-6">
              <FaFileAlt />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
              Manage PYQs
            </h2>

            <p className="text-slate-300 leading-6 sm:leading-7 text-sm sm:text-base">
              Upload or remove previous year question papers and help students
              prepare better for examinations.
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/manage-pyqs")}
            className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white text-sm sm:text-base font-semibold py-2.5 sm:py-3 rounded-xl transition-all duration-200"
          >
            Go to PYQs
          </button>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
          className="bg-white/5 backdrop-blur-xl border border-emerald-500/20 hover:border-emerald-400 rounded-3xl p-5 sm:p-6 lg:p-8 shadow-xl flex flex-col justify-between"
        >
          <div>

            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-3xl text-white mb-6">
              <FaStickyNote />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
              Manage Notes
            </h2>

            <p className="text-slate-300 leading-6 sm:leading-7 text-sm sm:text-base">
              Upload, organize and manage notes for every subject and semester.
              Keep study material updated for students.
            </p>

          </div>

          <button
            onClick={() => navigate("/admin/manage-notes")}
            className="mt-8 bg-emerald-600 hover:bg-emerald-700 text-white text-sm sm:text-base font-semibold py-2.5 sm:py-3 rounded-xl transition-all duration-200"
          >
            Go to Notes
          </button>

        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
          className="bg-white/5 backdrop-blur-xl border border-orange-500/20 hover:border-orange-400 rounded-3xl p-5 sm:p-6 lg:p-8 shadow-xl flex flex-col justify-between"
        >
          <div>

            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-orange-600 flex items-center justify-center text-3xl text-white mb-6">
              <FaComments />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
              Manage Discussions
            </h2>

            <p className="text-slate-300 leading-6 sm:leading-7 text-sm sm:text-base">
              Review, moderate and manage discussion threads and student posts
              to maintain a healthy learning environment.
            </p>

          </div>

          <button
            onClick={() => navigate("/admin/manage-discussions")}
            className="mt-8 bg-orange-600 hover:bg-orange-700 text-white text-sm sm:text-base font-semibold py-2.5 sm:py-3 rounded-xl transition-all duration-200"
          >
            Go to Discussions
          </button>

        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
          className="bg-white/5 backdrop-blur-xl border border-purple-500/20 hover:border-purple-400 rounded-3xl p-5 sm:p-6 lg:p-8 shadow-xl flex flex-col justify-between"
        >
          <div>

            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-purple-600 flex items-center justify-center text-3xl text-white mb-6">
              <FaUsers />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
              Manage Users
            </h2>

            <p className="text-slate-300 leading-6 sm:leading-7 text-sm sm:text-base">
              View registered students, manage user access and maintain user
              accounts for the E-Library platform.
            </p>

          </div>

          <button
            onClick={() => navigate("/admin/manage-users")}
            className="mt-8 bg-purple-600 hover:bg-purple-700 text-white text-sm sm:text-base font-semibold py-2.5 sm:py-3 rounded-xl transition-all duration-200"
          >
            Go to Users
          </button>

        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
          className="bg-white/5 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-400 rounded-3xl p-5 sm:p-6 lg:p-8 shadow-xl flex flex-col justify-between"
        >
          <div>

            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-cyan-600 flex items-center justify-center text-3xl text-white mb-6">
              <FaFolderOpen />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
              Manage Resources
            </h2>

            <p className="text-slate-300 leading-6 sm:leading-7 text-sm sm:text-base">
              Review uploaded resources, approve or reject submissions,
              preview files and remove unwanted content from the library.
            </p>

          </div>

          <button
            onClick={() => navigate("/admin/manage-resources")}
            className="mt-8 bg-cyan-600 hover:bg-cyan-700 text-white text-sm sm:text-base font-semibold py-2.5 sm:py-3 rounded-xl transition-all duration-200"
          >
            Go to Resources
          </button>

        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
          className="bg-white/5 backdrop-blur-xl border border-pink-500/20 hover:border-pink-400 rounded-3xl p-5 sm:p-6 lg:p-8 shadow-xl flex flex-col justify-between"
        >
          <div>

            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-pink-600 flex items-center justify-center text-3xl text-white mb-6">
              <FaChartBar />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
              Analytics
            </h2>

            <p className="text-slate-300 leading-6 sm:leading-7 text-sm sm:text-base">
              View dashboard statistics, resource growth, uploads,
              user activity and overall E-Library performance.
            </p>

          </div>

          <button
            onClick={() => navigate("/admin/analytics")}
            className="mt-8 bg-pink-600 hover:bg-pink-700 text-white text-sm sm:text-base font-semibold py-2.5 sm:py-3 rounded-xl transition-all duration-200"
          >
            View Analytics
          </button>

        </motion.div>

        <motion.div
          whileHover={{ y: -5, scale: 1.01 }}
          transition={{ duration: 0.2 }}
          className="bg-gradient-to-br from-red-600/20 to-red-900/20 backdrop-blur-xl border border-red-500/30 hover:border-red-400 rounded-3xl p-5 sm:p-6 lg:p-8 shadow-xl flex flex-col justify-between"
        >
          <div>

            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-red-600 flex items-center justify-center text-3xl text-white mb-6">
              <FaSignOutAlt />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
              Logout
            </h2>

            <p className="text-slate-300 leading-6 sm:leading-7 text-sm sm:text-base">
              Securely sign out from the administrator dashboard and
              return to the login page.
            </p>

          </div>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login-selector");
            }}
            className="mt-8 bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base font-semibold py-2.5 sm:py-3 rounded-xl transition-all duration-200"
          >
            Logout
          </button>

        </motion.div>
                </div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl px-5 sm:px-8 py-5 sm:py-6">

            <div className="flex flex-col md:flex-row items-center justify-between gap-6">

              <div>

                <h3 className="text-xl font-bold text-white">
                  GDC Nagrota Surian E-Library
                </h3>

                <p className="text-slate-400 mt-2">
                  Admin Control Panel • Manage Books, Notes, PYQs, Discussions,
                  Users and Resources from one centralized dashboard.
                </p>

              </div>

              <div className="text-center md:text-right">

                <p className="text-slate-500 text-sm">
                  Built with ❤️ for GDC Nagrota Surian
                </p>

                <p className="text-slate-600 text-xs mt-1">
                  © {new Date().getFullYear()} All Rights Reserved.
                </p>

              </div>

            </div>

          </div>

        </motion.div>
              </motion.div>
    </div>
  );
}