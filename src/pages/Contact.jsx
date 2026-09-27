import { issueAPI } from "../services/api";
import reejal from "../assets/reejal.jpg";
import shiansh from "../assets/shivansh.jpeg";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Info,
  Sparkles,
  Github,
  Linkedin,
} from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

export default function Contact() {
  const [issueType, setIssueType] = useState("");
  const [issueMessage, setIssueMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleReportIssue = async (e) => {
  e.preventDefault();

  if (!issueType) {
    Swal.fire({
      icon: "warning",
      title: "Select an issue",
      text: "Please select the issue you're facing.",
      confirmButtonColor: "#9333ea",
    });

    return;
  }

  setSubmitting(true);

  try {
    await issueAPI.createIssue({
      issueType,
      message: issueMessage,
    });

    await Swal.fire({
      icon: "success",
      title: "Issue Reported!",
      text: "Your issue has been sent to the E-Library team.",
      confirmButtonColor: "#9333ea",
    });

    setIssueType("");
    setIssueMessage("");
  } catch (error) {
    console.error("Issue submission error:", error);

    Swal.fire({
      icon: "error",
      title: "Submission Failed",
      text:
        error.response?.data?.message ||
        "Unable to submit your issue. Please try again.",
      confirmButtonColor: "#9333ea",
    });
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-4 sm:px-5 py-10 sm:py-14">
      <div className="max-w-6xl mx-auto">

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center gap-2">
            <Sparkles className="w-7 h-7" />
            We’re Here to Help
          </h1>

          <p className="mt-4 text-gray-700 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed">
            The maintenance and management of this E-Library platform are
            presently undertaken by <b>BCA Department</b>.
          </p>
        </motion.div>

        <div className="space-y-10 mb-16 sm:mb-20">

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.45 }}
            className="relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl"
          >
            <div className="absolute -top-3 left-5 sm:left-6 bg-white text-purple-700 px-4 py-1 rounded-full text-xs sm:text-sm font-semibold">
              Backend & Systems Lead
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <img
                src={reejal}
                alt="Reejal Choudhary"
                className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
              />

              <div className="flex-1">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <User /> Reejal Choudhary
                </h2>

                <p className="text-sm opacity-90 mb-3">
                  Student – BCA 5th Semester
                </p>

                <p className="text-sm leading-relaxed opacity-95 max-w-3xl">
                  Builds the backend, optimizes the database, and fights
                  production bugs at midnight so the site never crashes when
                  students suddenly decide to study.
                </p>

                <div className="mt-4 flex gap-4">
                  <a
                    href="https://github.com/reejalchoudhary"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:scale-110 transition"
                  >
                    <Github className="w-6 h-6" />
                  </a>

                  <a
                    href="https://linkedin.com/in/reejalchoudhary"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:scale-110 transition"
                  >
                    <Linkedin className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="relative bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-3xl p-6 sm:p-8 shadow-xl"
          >
            <div className="absolute -top-3 left-5 sm:left-6 bg-white text-pink-600 px-4 py-1 rounded-full text-xs sm:text-sm font-semibold">
              Frontend & UI Engineer
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <img
                src={shiansh}
                alt="Shivansh"
                className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
              />

              <div className="flex-1">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <User /> Shivansh
                </h2>

                <p className="text-sm opacity-90 mb-3">
                  Student – BCA 5th Semester
                </p>

                <p className="text-sm leading-relaxed opacity-95 max-w-3xl">
                  Leads frontend development, responsive design, and user
                  experience, making sure everything loads smoothly for
                  students who click everything twice.
                </p>

                <div className="mt-4 flex gap-4">
                  <a
                    href="https://github.com/your-github"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:scale-110 transition"
                  >
                    <Github className="w-6 h-6" />
                  </a>

                  <a
                    href="https://linkedin.com/in/your-linkedin"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:scale-110 transition"
                  >
                    <Linkedin className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="relative bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-3xl p-6 sm:p-8 shadow-xl"
          >
            <div className="absolute -top-3 left-5 sm:left-6 bg-white text-emerald-700 px-4 py-1 rounded-full text-xs sm:text-sm font-semibold">
              Content Operations Lead
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className="w-24 h-24 rounded-full border-4 border-white flex items-center justify-center text-center text-sm font-semibold bg-white/20">
                Loading...
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <User /> Position Open
                </h2>

                <p className="text-sm opacity-90 mb-3">
                  Looking for interested students
                </p>

                <p className="text-sm leading-relaxed opacity-95 max-w-3xl">
                  This role focuses on content management and student access
                  across the platform, with no direct involvement in coding or
                  development work.
                </p>

                <p className="mt-3 text-sm italic opacity-90">
                  Interested students can contact the team via email to join.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.45 }}
          className="bg-white rounded-3xl shadow-lg p-6 md:p-8 mb-12 sm:mb-16 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >
          <div>
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Mail className="w-5 h-5 text-purple-600" />
              Need help or resources?
            </h3>

            <p className="text-gray-600 mt-2 max-w-xl">
              Facing issues with notes or resource links? We’re here to help.
            </p>

            <div className="mt-3 space-y-1 text-sm text-gray-700">
              <p>
                📧 Email:{" "}
                <a
                  href="mailto:gdc.elibrary@gmail.com"
                  className="text-purple-700 font-medium hover:underline"
                >
                  gdc.elibrary@gmail.com
                </a>
              </p>

              <p className="flex flex-wrap items-center gap-1">
                🚨 Urgent (WhatsApp):{" "}
                <a
                  href="https://wa.me/919459422804"
                  target="_blank"
                  rel="noreferrer"
                  className="text-green-600 font-semibold hover:underline"
                >
                  +91 94594-22804
                </a>

                <span className="ml-2 text-xs text-gray-500 whitespace-nowrap">
                  (Academic emergencies only)
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="mailto:gdc.elibrary@gmail.com"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-center"
            >
              📧 Email Us
            </a>

            <a
              href="https://wa.me/919459422804"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold text-center"
            >
              💬 WhatsApp (Urgent)
            </a>
          </div>
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden rounded-3xl p-[1px] mb-12 sm:mb-16 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 shadow-2xl"
        >
          <div className="relative overflow-hidden rounded-[23px] bg-gradient-to-br from-white via-purple-50/80 to-pink-50/80 p-5 sm:p-7 md:p-9">

            <div className="absolute -top-20 -right-20 w-52 h-52 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-16 w-56 h-56 bg-pink-400/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative">

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-7">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-300/40">
                  <span className="text-2xl">🛠️</span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                    Facing an issue?
                  </h3>

                  <p className="text-sm sm:text-base text-gray-600 mt-1">
                    Something not working properly? Tell us and we’ll look into
                    it.
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleReportIssue}
                className="grid grid-cols-1 gap-5"
              >
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    What are you facing?
                  </label>

                  <div className="relative">
                    <select
                      value={issueType}
                      onChange={(e) => setIssueType(e.target.value)}
                      className="w-full appearance-none rounded-2xl border border-purple-200 bg-white/80 backdrop-blur-sm px-4 py-3.5 pr-12 text-sm sm:text-base text-gray-700 font-medium outline-none transition-all duration-200 hover:border-purple-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 shadow-sm"
                    >
                      <option value="">Select an issue</option>
                      <option value="upload_problem">
                        📚 Can't upload books
                      </option>
                      <option value="notes_problem">
                        📝 Can't upload notes
                      </option>
                      <option value="pyq_problem">
                        📄 Can't upload PYQs
                      </option>
                      <option value="resource_missing">
                        🔍 Resource not appearing
                      </option>
                      <option value="link_problem">
                        🔗 Resource link not working
                      </option>
                      <option value="download_problem">
                        ⬇️ Download problem
                      </option>
                      <option value="preview_problem">
                        👁️ Preview problem
                      </option>
                      <option value="login_problem">
                        🔐 Login problem
                      </option>
                      <option value="technical_issue">
                        🐞 Other technical issue
                      </option>
                      <option value="suggestion">
                        💡 Suggestion
                      </option>
                    </select>

                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-purple-600">
                      ▾
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2 gap-3">
                    <label className="block text-sm font-bold text-gray-800">
                      Tell us more
                    </label>

                    <span className="text-xs font-medium text-purple-500 bg-purple-100 px-2.5 py-1 rounded-full">
                      Optional
                    </span>
                  </div>

                  <textarea
                    value={issueMessage}
                    onChange={(e) => setIssueMessage(e.target.value)}
                    rows="5"
                    placeholder="Describe what happened, what you expected, or where you got stuck..."
                    className="w-full rounded-2xl border border-purple-200 bg-white/80 backdrop-blur-sm px-4 py-3.5 text-sm sm:text-base text-gray-700 placeholder:text-gray-400 outline-none resize-none transition-all duration-200 hover:border-purple-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 shadow-sm"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">

                  <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-500">
                    <span className="text-purple-600 text-base">🔒</span>

                    <span>
                      Your report will be reviewed by the E-Library team.
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-7 py-3.5 rounded-2xl text-white font-bold text-sm sm:text-base bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-700 hover:via-fuchsia-700 hover:to-pink-700 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shadow-lg shadow-purple-300/40 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Submitting..." : "🚀 Report Issue"}
                  </button>

                </div>
              </form>
            </div>
          </div>
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.45 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Info className="w-6 h-6 text-purple-600" />
            When should you contact us?
          </h3>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <li>📚 Requesting Books, Notes, or PYQs</li>
            <li>🔗 Reporting missing or broken resources</li>
            <li>🐞 Technical issues (yes, bugs exist)</li>
            <li>💡 Suggestions to improve the platform</li>
          </ul>
        </motion.div>

      </div>
    </div>
  );
}