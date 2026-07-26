import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { adminAPI } from "../../services/api";

import {
  FaArrowLeft,
  FaUsers,
  FaUserCheck,
  FaUserSlash,
  FaClock,
  FaFolderOpen,
  FaCheckCircle,
  FaTimesCircle,
  FaBook,
  FaStickyNote,
  FaFileAlt,
  FaComments,
} from "react-icons/fa";

const sectionColors = {
  students: {
    badge: "from-orange-500 to-pink-500",
    icon: "from-violet-500 to-fuchsia-600",
  },

  resources: {
    badge: "from-[#ff7b54] to-[#ff2e63]",
    icon: "from-pink-500 to-orange-500",
  },

  content: {
    badge: "from-[#ff914d] to-[#ff4d6d]",
    icon: "from-[#ff914d] to-[#ff4d6d]",
  },
};

function Section({
  title,
  subtitle,
  color,
  children,
}) {
  return (
    <section className="mb-16">

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">

        <div>

          <div
            className={`
              inline-flex
              items-center
              rounded-full
              px-5
              py-2
              text-white
              text-sm
              font-semibold
              bg-gradient-to-r
              ${color.badge}
              shadow-2xl
            `}
          >
            {title}
          </div>

          <p className="text-slate-600 mt-4 max-w-2xl leading-7">
            {subtitle}
          </p>

        </div>

      </div>

      <div className="grid grid-cols-1 min-[430px]:grid-cols-2 xl:grid-cols-4 gap-6">

        {children}

      </div>

    </section>
  );
}


function StatCard({
  icon: Icon,
  title,
  value,
  color,
}) {
  return (
    <motion.div
      whileHover={{
        y: -4,
      }}
      transition={{
        duration: 0.2,
      }}
      className="
        group
        relative
        overflow-hidden
        rounded-[30px]
        bg-white/35
        backdrop-blur-xl
        border
        border-white/30
        shadow-2xl
        hover:shadow-xl
        transition-all
      "
    >

      <div
        className={`
          h-1.5
          w-full
          bg-gradient-to-r
          ${color}
        `}
      />

      <div className="p-6">

        <div
          className={`
            w-16
            h-16
            rounded-3xl
            bg-gradient-to-br
            ${color}
            flex
            items-center
            justify-center
            text-white
            text-2xl
            shadow-2xl
            transition-transform
            duration-300
            group-hover:scale-105
          `}
        >
          <Icon />
        </div>

        <p className="text-slate-500 text-sm mt-7">

          {title}

        </p>

        <h2 className="text-5xl font-black text-slate-900 mt-2 tracking-tight">

          {String(value).padStart(2, "0")}

        </h2>

        <div className="mt-7">

          <span className="text-xs text-slate-400">

            Live Statistics

          </span>

        </div>

      </div>

    </motion.div>
  );
}


export default function AdminAnalytics() {

  const navigate = useNavigate();

  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(true);

    const fetchStats = async (showLoader = false) => {
      try {
        if (showLoader) {
          setLoading(true);
        }

        const res = await adminAPI.getDashboardStats();

        setStats((prev) => {
            const next = res.data.data;

            if (JSON.stringify(prev) === JSON.stringify(next)) {
              return prev;
            }

            return next;
          });

      } catch (err) {
        console.error("Analytics Error:", err);
      } finally {
        if (showLoader) {
          setLoading(false);
        }
      }
    };
useEffect(() => {
  fetchStats(true);

  const interval = setInterval(() => {
    fetchStats(false);
  }, 5000);

  return () => clearInterval(interval);
}, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcfbff] flex items-center justify-center">

        <div className="bg-white rounded-[32px] shadow-xl border border-slate-100 px-12 py-10">

          <div className="flex flex-col items-center gap-6">

            <div className="w-16 h-16 rounded-full border-[6px] border-violet-200 border-t-violet-600 animate-spin" />

            <div className="text-center">

              <h2 className="text-2xl font-bold text-slate-900">
                Loading Analytics
              </h2>

              <p className="text-slate-500 mt-2">
                Please wait while we fetch dashboard statistics...
              </p>

            </div>

          </div>

        </div>

      </div>
    );
  }

  const studentStats = stats?.students || {};

  const resourceStats = stats?.resources || {};

  const contentStats = stats?.content || {};

  return (

    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#fff1e6] via-[#ffe4ec] to-[#ffd6c9]">

      <div className="absolute inset-0 -z-10 overflow-hidden">

        <div className="absolute -top-40 -left-40 w-[420px] h-[420px] rounded-full bg-orange-400/30 blur-[170px]" />

        <div className="absolute top-0 right-[-120px] w-[420px] h-[420px] rounded-full bg-pink-400/30 blur-[170px]" />

        <div className="absolute bottom-[-150px] left-1/3 w-[420px] h-[420px] rounded-full bg-rose-300/30 blur-[170px]" />

      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10">

        <button
          onClick={() => navigate("/admin-dashboard")}
          className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-xl border border-white/30 shadow-md hover:shadow-2xl transition px-5 py-3"
        >
          <FaArrowLeft />

          <span className="font-medium">
            Back to Dashboard
          </span>

        </button>

        <div className="mt-8 rounded-[36px] bg-white/35 backdrop-blur-xl border border-white/30 shadow-xl overflow-hidden">

          <div className="p-8 sm:p-10 lg:p-14">

            <div className="flex flex-col lg:flex-row items-center justify-between gap-10">

              <div className="max-w-3xl">

                <div className="inline-flex px-4 py-2 rounded-full bg-violet-100 text-violet-700 font-semibold">

                  📊 Admin Analytics

                </div>

                <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-slate-900">

                  Platform
                  <br />
                  Statistics

                </h1>

                <p className="mt-6 text-slate-600 text-lg leading-8">

                  Monitor students, uploaded resources,
                  discussions and platform growth from
                  one beautiful analytics dashboard.

                </p>

              </div>

              <div className="grid grid-cols-2 gap-5 w-full lg:w-auto">

                <div className="rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white p-6 shadow-2xl">

                  <p className="text-sm opacity-90">

                    Sections

                  </p>

                  <h2 className="text-4xl font-black mt-2">

                    03

                  </h2>

                </div>

                <div className="rounded-3xl bg-gradient-to-br from-pink-500 to-orange-400 text-white p-6 shadow-2xl">

                  <p className="text-sm opacity-90">

                    Live

                  </p>

                  <h2 className="text-4xl font-black mt-2">

                    ✓

                  </h2>

                </div>

              </div>

            </div>

          </div>

        </div>

        <Section
          title="Student Analytics"
          subtitle="Track registered, approved, pending and blocked students."
          color={sectionColors.students}
        >
          <StatCard
            icon={FaUsers}
            title="Total Students"
            value={studentStats.total || 0}
            color="from-orange-500 to-pink-500"
          />

          <StatCard
            icon={FaUserCheck}
            title="Approved Students"
            value={studentStats.approved || 0}
            color="from-emerald-500 to-teal-500"
          />

          <StatCard
            icon={FaClock}
            title="Pending Approval"
            value={studentStats.pending || 0}
            color="from-amber-400 to-orange-500"
          />

          <StatCard
            icon={FaUserSlash}
            title="Blocked Students"
            value={studentStats.blocked || 0}
            color="from-rose-500 to-red-500"
          />
        </Section>

        <Section
          title="Resource Analytics"
          subtitle="Monitor uploaded study resources and their approval status."
          color={sectionColors.resources}
        >
          <StatCard
            icon={FaFolderOpen}
            title="Total Resources"
            value={resourceStats.total || 0}
            color="from-[#ff7b54] to-[#ff2e63]"
          />

          <StatCard
            icon={FaCheckCircle}
            title="Approved Resources"
            value={resourceStats.approved || 0}
            color="from-emerald-500 to-green-500"
          />

          <StatCard
            icon={FaClock}
            title="Pending Resources"
            value={resourceStats.pending || 0}
            color="from-yellow-400 to-orange-500"
          />

          <StatCard
            icon={FaTimesCircle}
            title="Rejected Resources"
            value={resourceStats.rejected || 0}
            color="from-red-500 to-rose-500"
          />
        </Section>

        <Section
          title="Content Analytics"
          subtitle="Keep track of the learning content available on the platform."
          color={sectionColors.content}
        >
          <StatCard
            icon={FaBook}
            title="Books"
            value={contentStats.books || 0}
            color="from-cyan-500 to-sky-500"
          />

          <StatCard
            icon={FaStickyNote}
            title="Notes"
            value={contentStats.notes || 0}
            color="from-emerald-500 to-lime-500"
          />

          <StatCard
            icon={FaFileAlt}
            title="Previous Year Papers"
            value={contentStats.pyqs || 0}
            color="from-indigo-500 to-violet-500"
          />

          <StatCard
            icon={FaComments}
            title="Discussions"
            value={contentStats.discussions || 0}
            color="from-[#ff7b54] to-[#ff2e63]"
          />
        </Section>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-[34px] overflow-hidden border border-white/30 bg-white/35 backdrop-blur-xl shadow-xl"
        >
          <div className="bg-gradient-to-r from-[#ff7b54] via-[#ff5e7e] to-[#ff2e63] px-8 py-6">

            <h2 className="text-2xl font-bold text-white">
              Platform Overview
            </h2>

            <p className="text-violet-100 mt-2">
              Quick summary of your complete E-Library platform.
            </p>

          </div>

          <div className="p-8">

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

              <div className="rounded-3xl bg-gradient-to-br from-violet-50 to-violet-100 border border-violet-200 p-6">

                <p className="text-violet-600 text-sm font-semibold">
                  Students
                </p>

                <h3 className="text-4xl font-black text-slate-900 mt-3">
                  {studentStats.total || 0}
                </h3>

              </div>

              <div className="rounded-3xl bg-gradient-to-br from-pink-50 to-rose-100 border border-pink-200 p-6">

                <p className="text-pink-600 text-sm font-semibold">
                  Resources
                </p>

                <h3 className="text-4xl font-black text-slate-900 mt-3">
                  {resourceStats.total || 0}
                </h3>

              </div>

              <div className="rounded-3xl bg-gradient-to-br from-cyan-50 to-sky-100 border border-cyan-200 p-6">

                <p className="text-cyan-600 text-sm font-semibold">
                  Books
                </p>

                <h3 className="text-4xl font-black text-slate-900 mt-3">
                  {contentStats.books || 0}
                </h3>

              </div>

              <div className="rounded-3xl bg-gradient-to-br from-emerald-50 to-lime-100 border border-emerald-200 p-6">

                <p className="text-emerald-600 text-sm font-semibold">
                  Discussions
                </p>

                <h3 className="text-4xl font-black text-slate-900 mt-3">
                  {contentStats.discussions || 0}
                </h3>

              </div>

            </div>

            <div className="mt-10 rounded-[30px] border border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50 p-8">

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

                <div>

                  <h3 className="text-2xl font-bold text-slate-900">
                    GDC Nagrota Surian E-Library
                  </h3>

                  <p className="mt-3 text-slate-600 leading-7 max-w-2xl">
                    Your analytics dashboard gives a complete overview of
                    students, uploaded resources, books, notes, PYQs and
                    discussion activity. All statistics are fetched directly
                    from your database and updated whenever this page loads.
                  </p>

                </div>

                <button
                  onClick={() => fetchStats(true)}
                  className="
                    px-7
                    py-4
                    rounded-2xl
                    bg-gradient-to-r
                    from-violet-600
                    via-fuchsia-500
                    to-pink-500
                    text-white
                    font-semibold
                    shadow-2xl
                    hover:shadow-xl
                    transition-all
                    duration-300
                  "
                >
                  Refresh Statistics
                </button>

              </div>

            </div>

          </div>

        </motion.div>

              </div>

    </div>

  );
}