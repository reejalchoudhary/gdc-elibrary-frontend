import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { issueAPI } from "../../services/api";

import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

import {
  FaArrowLeft,
  FaSearch,
  FaFilter,
  FaExclamationCircle,
  FaTrash,
  FaEye,
  FaClock,
  FaClipboardList,
  FaSpinner,
  FaCheckCircle,
} from "react-icons/fa";

const ISSUE_LABELS = {
  upload_problem: "Upload Problem",
  notes_problem: "Notes Problem",
  pyq_problem: "PYQ Problem",
  resource_missing: "Resource Missing",
  link_problem: "Link Problem",
  download_problem: "Download Problem",
  preview_problem: "Preview Problem",
  login_problem: "Login Problem",
  technical_issue: "Technical Issue",
  suggestion: "Suggestion",
};

const STATUS_LABELS = {
  open: "Open",
  "in-progress": "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

const STATUS_STYLES = {
  open: {
    badge:
      "bg-rose-500/15 text-rose-300 border border-rose-400/30",
    dot: "bg-rose-400",
  },

  "in-progress": {
    badge:
      "bg-amber-500/15 text-amber-300 border border-amber-400/30",
    dot: "bg-amber-400",
  },

  resolved: {
    badge:
      "bg-emerald-500/15 text-emerald-300 border border-emerald-400/30",
    dot: "bg-emerald-400",
  },

  closed: {
    badge:
      "bg-slate-500/15 text-slate-300 border border-slate-400/30",
    dot: "bg-slate-400",
  },
};

const ISSUE_THEMES = {
  upload_problem: {
    icon: "📤",
    gradient: "from-violet-500 to-fuchsia-500",
    soft: "bg-violet-500/10",
    border: "border-violet-400/20",
  },

  notes_problem: {
    icon: "📝",
    gradient: "from-blue-500 to-cyan-400",
    soft: "bg-blue-500/10",
    border: "border-blue-400/20",
  },

  pyq_problem: {
    icon: "📚",
    gradient: "from-orange-500 to-pink-500",
    soft: "bg-orange-500/10",
    border: "border-orange-400/20",
  },

  resource_missing: {
    icon: "🔍",
    gradient: "from-red-500 to-orange-500",
    soft: "bg-red-500/10",
    border: "border-red-400/20",
  },

  link_problem: {
    icon: "🔗",
    gradient: "from-cyan-500 to-blue-500",
    soft: "bg-cyan-500/10",
    border: "border-cyan-400/20",
  },

  download_problem: {
    icon: "⬇️",
    gradient: "from-indigo-500 to-purple-500",
    soft: "bg-indigo-500/10",
    border: "border-indigo-400/20",
  },

  preview_problem: {
    icon: "👁️",
    gradient: "from-pink-500 to-rose-500",
    soft: "bg-pink-500/10",
    border: "border-pink-400/20",
  },

  login_problem: {
    icon: "🔐",
    gradient: "from-yellow-500 to-orange-500",
    soft: "bg-yellow-500/10",
    border: "border-yellow-400/20",
  },

  technical_issue: {
    icon: "⚙️",
    gradient: "from-slate-400 to-indigo-500",
    soft: "bg-slate-500/10",
    border: "border-slate-400/20",
  },

  suggestion: {
    icon: "💡",
    gradient: "from-emerald-400 to-teal-500",
    soft: "bg-emerald-500/10",
    border: "border-emerald-400/20",
  },
};

const DEFAULT_THEME = {
  icon: "⚠️",
  gradient: "from-purple-500 to-indigo-500",
  soft: "bg-purple-500/10",
  border: "border-purple-400/20",
};

const STATUS_BUTTONS = [
  ["open", "🔴", "Open"],
  ["in-progress", "🟡", "In Progress"],
  ["resolved", "🟢", "Resolved"],
  ["closed", "⚫", "Closed"],
];

const formatIssueType = (type) => {
  return ISSUE_LABELS[type] || type || "Unknown Issue";
};

const formatStatus = (status) => {
  return STATUS_LABELS[status] || "Unknown";
};

const formatDate = (date) => {
  if (!date) return "N/A";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "N/A";
  }

  return parsed.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusStyle = (status) => {
  return STATUS_STYLES[status] || STATUS_STYLES.closed;
};

const getIssueTheme = (type) => {
  return ISSUE_THEMES[type] || DEFAULT_THEME;
};

const escapeHtml = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia("(max-width: 639px)").matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 639px)");

    const handleChange = (event) => {
      setIsMobile(event.matches);
    };

    handleChange(mediaQuery);

    mediaQuery.addEventListener?.("change", handleChange);

    return () => {
      mediaQuery.removeEventListener?.("change", handleChange);
    };
  }, []);

  return isMobile;
}

export default function ManageIssues() {
  const navigate = useNavigate();

  const isMobile = useIsMobile();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const requestInProgress = useRef(false);

  const mountedRef = useRef(true);

  const fetchIssues = useCallback(async (showLoader = false) => {
    if (requestInProgress.current) {
      return;
    }

    requestInProgress.current = true;

    try {
      if (showLoader && mountedRef.current) {
        setLoading(true);
      }

      const response = await issueAPI.getAllIssues();

      const newData = response?.data?.data || [];

      if (!mountedRef.current) {
        return;
      }

      setIssues((prev) => {
        if (prev.length !== newData.length) {
          return newData;
        }

        let changed = false;

        for (let i = 0; i < newData.length; i += 1) {
          const oldIssue = prev[i];
          const newIssue = newData[i];

          if (
            oldIssue?._id !== newIssue?._id ||
            oldIssue?.status !== newIssue?.status ||
            oldIssue?.adminResponse !== newIssue?.adminResponse ||
            oldIssue?.updatedAt !== newIssue?.updatedAt
          ) {
            changed = true;
            break;
          }
        }

        return changed ? newData : prev;
      });
    } catch (error) {
      console.error("Failed to fetch issues:", error);

      if (showLoader && mountedRef.current) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text:
            error?.response?.data?.message ||
            "Failed to fetch reported issues.",
          confirmButtonColor: "#7c3aed",
        });
      }
    } finally {
      requestInProgress.current = false;

      if (showLoader && mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    fetchIssues(true);

    const interval = setInterval(() => {
      fetchIssues(false);
    }, 5000);

    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, [fetchIssues]);

  const stats = useMemo(() => {
    let open = 0;
    let inProgress = 0;
    let resolved = 0;

    for (const issue of issues) {
      if (issue.status === "open") {
        open += 1;
      } else if (issue.status === "in-progress") {
        inProgress += 1;
      } else if (
        issue.status === "resolved" ||
        issue.status === "closed"
      ) {
        resolved += 1;
      }
    }

    return {
      total: issues.length,
      open,
      inProgress,
      resolved,
    };
  }, [issues]);

  const filteredIssues = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return issues.filter((issue) => {
      if (typeFilter !== "All" && issue.issueType !== typeFilter) {
        return false;
      }

      if (statusFilter !== "All" && issue.status !== statusFilter) {
        return false;
      }

      if (!searchValue) {
        return true;
      }

      return (
        issue.studentName
          ?.toLowerCase()
          .includes(searchValue) ||
        issue.studentEmail
          ?.toLowerCase()
          .includes(searchValue) ||
        issue.rollno
          ?.toLowerCase()
          .includes(searchValue) ||
        issue.message
          ?.toLowerCase()
          .includes(searchValue)
      );
    });
  }, [issues, search, typeFilter, statusFilter]);

  const showSuccess = useCallback((title) => {
    Swal.fire({
      icon: "success",
      title,
      timer: 1600,
      showConfirmButton: false,
      background: "#ffffff",
    });
  }, []);

  const showError = useCallback((message = "Please try again.") => {
    Swal.fire({
      icon: "error",
      title: "Something went wrong",
      text: message,
      confirmButtonColor: "#7c3aed",
    });
  }, []);

  const handleUpdateIssue = useCallback(
    async (issue) => {
      const safeResponse = escapeHtml(issue.adminResponse || "");

      const result = await Swal.fire({
        title: "Update Issue",

        width: "min(640px, calc(100vw - 20px))",

        background: "#0b1020",
        color: "#f8fafc",

        showCancelButton: true,
        confirmButtonText: "✓ Update Issue",
        cancelButtonText: "Cancel",

        buttonsStyling: false,

        customClass: {
          popup: "issue-update-popup",
          title: "issue-update-title",
          confirmButton: "issue-confirm-btn",
          cancelButton: "issue-cancel-btn",
        },

        html: `
          <div
            style="
              text-align:left;
              margin-top:4px;
            "
          >

            <div
              style="
                display:flex;
                align-items:center;
                justify-content:space-between;
                gap:10px;
                margin-bottom:12px;
              "
            >
              <label
                style="
                  font-size:14px;
                  font-weight:700;
                  color:#e2e8f0;
                "
              >
                Issue Status
              </label>

              <span
                style="
                  font-size:10px;
                  font-weight:700;
                  letter-spacing:.08em;
                  color:#c4b5fd;
                  background:rgba(139,92,246,.10);
                  border:1px solid rgba(139,92,246,.20);
                  padding:5px 9px;
                  border-radius:999px;
                "
              >
                UPDATE
              </span>
            </div>

            <div
              id="issue-status-options"
              style="
                display:grid;
                grid-template-columns:repeat(2,minmax(0,1fr));
                gap:10px;
                margin-bottom:24px;
              "
            >
              ${STATUS_BUTTONS.map(
                ([value, icon, label]) => `
                  <button
                    type="button"
                    data-status="${value}"
                    class="issue-status-option"
                    style="
                      padding:13px 10px;
                      border-radius:14px;
                      border:1px solid rgba(255,255,255,.08);
                      background:rgba(255,255,255,.035);
                      color:#94a3b8;
                      cursor:pointer;
                      font-size:13px;
                      font-weight:700;
                      transition:background .15s ease,
                                  border-color .15s ease,
                                  color .15s ease;
                    "
                  >
                    ${icon} ${label}
                  </button>
                `
              ).join("")}
            </div>

            <input
              type="hidden"
              id="issue-status"
              value="${escapeHtml(issue.status || "open")}"
            />

            <div
              style="
                display:flex;
                align-items:center;
                justify-content:space-between;
                gap:10px;
                margin-bottom:10px;
              "
            >
              <label
                style="
                  font-size:14px;
                  font-weight:700;
                  color:#e2e8f0;
                "
              >
                Admin Response
              </label>

              <span
                style="
                  font-size:10px;
                  color:#64748b;
                "
              >
                Optional
              </span>
            </div>

            <textarea
              id="admin-response"
              maxlength="2000"
              placeholder="Write a response for the student..."
              style="
                width:100%;
                min-height:135px;
                box-sizing:border-box;
                resize:vertical;
                background:#070b18;
                border:1px solid rgba(139,92,246,.20);
                border-radius:15px;
                padding:14px;
                color:#f8fafc;
                font-size:14px;
                line-height:1.6;
                outline:none;
                font-family:inherit;
              "
            >${safeResponse}</textarea>

            <div
              style="
                display:flex;
                align-items:center;
                gap:7px;
                margin-top:9px;
                color:#64748b;
                font-size:11px;
              "
            >
              <span>💬</span>
              <span>
                The response will be saved with this issue.
              </span>
            </div>

          </div>
        `,

        didOpen: () => {
          const popup = Swal.getPopup();

          if (!popup) return;

          popup.style.border =
            "1px solid rgba(139,92,246,.18)";

          popup.style.boxShadow =
            "0 30px 90px rgba(0,0,0,.55)";

          const title = popup.querySelector(
            ".issue-update-title"
          );

          if (title) {
            title.style.color = "#f8fafc";
            title.style.fontWeight = "800";
            title.style.fontSize = "28px";
          }

          const confirmButton = popup.querySelector(
            ".issue-confirm-btn"
          );

          const cancelButton = popup.querySelector(
            ".issue-cancel-btn"
          );

          if (confirmButton) {
            confirmButton.style.border = "0";
            confirmButton.style.borderRadius = "12px";
            confirmButton.style.padding = "12px 20px";
            confirmButton.style.fontWeight = "700";
            confirmButton.style.background =
              "linear-gradient(135deg,#7c3aed,#a855f7)";
            confirmButton.style.color = "#fff";
            confirmButton.style.boxShadow =
              "0 8px 24px rgba(124,58,237,.20)";
          }

          if (cancelButton) {
            cancelButton.style.border = "0";
            cancelButton.style.borderRadius = "12px";
            cancelButton.style.padding = "12px 20px";
            cancelButton.style.fontWeight = "600";
            cancelButton.style.background = "#1e293b";
            cancelButton.style.color = "#cbd5e1";
          }

          const statusInput =
            popup.querySelector("#issue-status");

          const buttons =
            popup.querySelectorAll(
              ".issue-status-option"
            );

          const textarea =
            popup.querySelector("#admin-response");

          const statusColors = {
            open: {
              background: "rgba(244,63,94,.14)",
              border: "rgba(244,63,94,.50)",
              color: "#fb7185",
            },

            "in-progress": {
              background: "rgba(245,158,11,.14)",
              border: "rgba(245,158,11,.50)",
              color: "#fbbf24",
            },

            resolved: {
              background: "rgba(16,185,129,.14)",
              border: "rgba(16,185,129,.50)",
              color: "#34d399",
            },

            closed: {
              background: "rgba(100,116,139,.14)",
              border: "rgba(100,116,139,.50)",
              color: "#cbd5e1",
            },
          };

          const updateButtonStyle = (
            button,
            selectedStatus
          ) => {
            const selected =
              button.dataset.status === selectedStatus;

            const colors =
              statusColors[button.dataset.status];

            button.style.background = selected
              ? colors.background
              : "rgba(255,255,255,.035)";

            button.style.borderColor = selected
              ? colors.border
              : "rgba(255,255,255,.08)";

            button.style.color = selected
              ? colors.color
              : "#94a3b8";
          };

          buttons.forEach((button) => {
            button.addEventListener("mouseenter", () => {
              if (
                button.dataset.status !==
                statusInput.value
              ) {
                button.style.background =
                  "rgba(255,255,255,.07)";

                button.style.borderColor =
                  "rgba(139,92,246,.30)";
              }
            });

            button.addEventListener("mouseleave", () => {
              updateButtonStyle(
                button,
                statusInput.value
              );
            });

            button.addEventListener("click", () => {
              statusInput.value =
                button.dataset.status;

              buttons.forEach((btn) => {
                updateButtonStyle(
                  btn,
                  statusInput.value
                );
              });
            });

            updateButtonStyle(
              button,
              statusInput.value
            );
          });

          if (textarea) {
            textarea.addEventListener("focus", () => {
              textarea.style.border =
                "1px solid rgba(139,92,246,.70)";

              textarea.style.boxShadow =
                "0 0 0 3px rgba(139,92,246,.12)";
            });

            textarea.addEventListener("blur", () => {
              textarea.style.border =
                "1px solid rgba(139,92,246,.20)";

              textarea.style.boxShadow = "none";
            });
          }
        },

        preConfirm: () => {
          const status =
            document.getElementById(
              "issue-status"
            )?.value;

          const adminResponse =
            document.getElementById(
              "admin-response"
            )?.value || "";

          return {
            status,
            adminResponse,
          };
        },
      });

      if (!result.isConfirmed) {
        return;
      }

      try {
        await issueAPI.updateIssueStatus(
          issue._id,
          result.value
        );

        showSuccess("Issue Updated");

        await fetchIssues(false);
      } catch (error) {
        console.error(error);

        showError(
          error?.response?.data?.message ||
            "Unable to update issue."
        );
      }
    },
    [fetchIssues, showError, showSuccess]
  );

  const handleDelete = useCallback(
    async (id) => {
      const result = await Swal.fire({
        title: "Delete Issue?",
        text: "This action cannot be undone.",
        icon: "warning",

        showCancelButton: true,

        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",

        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
      });

      if (!result.isConfirmed) {
        return;
      }

      try {
        await issueAPI.deleteIssue(id);

        showSuccess("Issue Deleted");

        await fetchIssues(false);
      } catch (error) {
        console.error(error);

        showError(
          error?.response?.data?.message ||
            "Unable to delete issue."
        );
      }
    },
    [fetchIssues, showError, showSuccess]
  );

  const handleView = useCallback((issue) => {
    const theme = getIssueTheme(issue.issueType);

    const statusColor =
      issue.status === "open"
        ? "#fb7185"
        : issue.status === "in-progress"
        ? "#fbbf24"
        : issue.status === "resolved"
        ? "#34d399"
        : "#cbd5e1";

    const statusBackground =
      issue.status === "open"
        ? "rgba(244,63,94,.12)"
        : issue.status === "in-progress"
        ? "rgba(245,158,11,.12)"
        : issue.status === "resolved"
        ? "rgba(16,185,129,.12)"
        : "rgba(100,116,139,.12)";

    const safeIssueType = escapeHtml(
      formatIssueType(issue.issueType)
    );

    const safeDate = escapeHtml(
      formatDate(issue.createdAt)
    );

    const safeStudentName = escapeHtml(
      issue.studentName || "N/A"
    );

    const safeEmail = escapeHtml(
      issue.studentEmail || "N/A"
    );

    const safeRollNo = escapeHtml(
      issue.rollno || "N/A"
    );

    const safeDepartment = escapeHtml(
      issue.department || "N/A"
    );

    const safeMessage = escapeHtml(
      issue.message || "No message provided."
    );

    const safeAdminResponse = escapeHtml(
      issue.adminResponse ||
        "No response has been added yet."
    );

    const safeIssueId = escapeHtml(
      issue._id || "N/A"
    );

    Swal.fire({
      title: "Issue Details",

      width: "min(700px, calc(100vw - 20px))",

      background: "#0b1020",
      color: "#f8fafc",

      confirmButtonText: "Close",

      buttonsStyling: false,

      customClass: {
        popup: "issue-details-popup",
        title: "issue-details-title",
        confirmButton: "issue-close-btn",
      },

      html: `
        <div
          style="
            text-align:left;
            max-height:68vh;
            overflow-y:auto;
            padding:4px 5px 4px 2px;
          "
        >

          <!-- HEADER -->

          <div
            style="
              position:relative;
              overflow:hidden;
              background:
                linear-gradient(
                  135deg,
                  rgba(124,58,237,.18),
                  rgba(6,182,212,.06)
                );
              border:1px solid rgba(139,92,246,.18);
              border-radius:20px;
              padding:18px;
              margin-bottom:12px;
            "
          >

            <div
              style="
                position:absolute;
                width:150px;
                height:150px;
                border-radius:50%;
                background:#8b5cf6;
                opacity:.08;
                right:-50px;
                top:-60px;
              "
            ></div>

            <div
              style="
                position:relative;
                display:flex;
                align-items:center;
                justify-content:space-between;
                gap:12px;
              "
            >

              <div
                style="
                  display:flex;
                  align-items:center;
                  gap:13px;
                  min-width:0;
                "
              >

                <div
                  style="
                    width:52px;
                    height:52px;
                    flex-shrink:0;
                    border-radius:16px;
                    background:
                      linear-gradient(
                        135deg,
                        #7c3aed,
                        #c026d3
                      );
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-size:23px;
                    box-shadow:
                      0 10px 30px
                      rgba(124,58,237,.25);
                  "
                >
                  ${theme.icon}
                </div>

                <div style="min-width:0;">

                  <div
                    style="
                      font-size:17px;
                      font-weight:800;
                      color:#f8fafc;
                      white-space:nowrap;
                      overflow:hidden;
                      text-overflow:ellipsis;
                    "
                  >
                    ${safeIssueType}
                  </div>

                  <div
                    style="
                      margin-top:4px;
                      color:#94a3b8;
                      font-size:12px;
                    "
                  >
                    ${safeDate}
                  </div>

                </div>

              </div>

              <span
                style="
                  display:flex;
                  align-items:center;
                  gap:6px;
                  flex-shrink:0;
                  padding:7px 10px;
                  border-radius:999px;
                  font-size:11px;
                  font-weight:700;
                  background:${statusBackground};
                  color:${statusColor};
                  border:1px solid ${statusColor}40;
                "
              >

                <span
                  style="
                    width:6px;
                    height:6px;
                    border-radius:50%;
                    background:${statusColor};
                  "
                ></span>

                ${escapeHtml(
                  formatStatus(issue.status)
                )}

              </span>

            </div>

          </div>

          <!-- STUDENT INFO -->

          <div
            style="
              display:grid;
              grid-template-columns:
                repeat(auto-fit,minmax(220px,1fr));
              gap:10px;
              margin-bottom:10px;
            "
          >

            <div
              style="
                background:rgba(255,255,255,.035);
                border:1px solid rgba(255,255,255,.06);
                border-radius:15px;
                padding:15px;
              "
            >
              <div
                style="
                  color:#64748b;
                  font-size:10px;
                  text-transform:uppercase;
                  letter-spacing:.08em;
                  margin-bottom:6px;
                "
              >
                Student
              </div>

              <div
                style="
                  color:#e2e8f0;
                  font-size:14px;
                  font-weight:600;
                "
              >
                ${safeStudentName}
              </div>
            </div>

            <div
              style="
                background:rgba(255,255,255,.035);
                border:1px solid rgba(255,255,255,.06);
                border-radius:15px;
                padding:15px;
              "
            >
              <div
                style="
                  color:#64748b;
                  font-size:10px;
                  text-transform:uppercase;
                  letter-spacing:.08em;
                  margin-bottom:6px;
                "
              >
                Email
              </div>

              <div
                style="
                  color:#e2e8f0;
                  font-size:14px;
                  font-weight:600;
                  word-break:break-all;
                "
              >
                ${safeEmail}
              </div>
            </div>

          </div>

          <!-- ACADEMIC INFO -->

          <div
            style="
              display:grid;
              grid-template-columns:
                repeat(auto-fit,minmax(140px,1fr));
              gap:10px;
              margin-bottom:10px;
            "
          >

            <div
              style="
                background:rgba(255,255,255,.035);
                border:1px solid rgba(255,255,255,.06);
                border-radius:15px;
                padding:15px;
              "
            >
              <div
                style="
                  color:#64748b;
                  font-size:10px;
                  margin-bottom:6px;
                  letter-spacing:.06em;
                "
              >
                ROLL NUMBER
              </div>

              <div
                style="
                  color:#e2e8f0;
                  font-size:14px;
                  font-weight:600;
                "
              >
                ${safeRollNo}
              </div>
            </div>

            <div
              style="
                background:rgba(255,255,255,.035);
                border:1px solid rgba(255,255,255,.06);
                border-radius:15px;
                padding:15px;
              "
            >
              <div
                style="
                  color:#64748b;
                  font-size:10px;
                  margin-bottom:6px;
                  letter-spacing:.06em;
                "
              >
                DEPARTMENT
              </div>

              <div
                style="
                  color:#e2e8f0;
                  font-size:14px;
                  font-weight:600;
                "
              >
                ${safeDepartment}
              </div>
            </div>

          </div>

          <!-- STUDENT MESSAGE -->

          <div
            style="
              background:
                linear-gradient(
                  135deg,
                  rgba(255,255,255,.045),
                  rgba(255,255,255,.02)
                );
              border:1px solid rgba(255,255,255,.07);
              border-radius:16px;
              padding:16px;
              margin-bottom:10px;
            "
          >

            <div
              style="
                display:flex;
                align-items:center;
                gap:8px;
                color:#c4b5fd;
                font-size:13px;
                font-weight:700;
                margin-bottom:10px;
              "
            >
              💬 Student Message
            </div>

            <div
              style="
                color:#cbd5e1;
                font-size:14px;
                line-height:1.7;
                white-space:pre-wrap;
                word-break:break-word;
              "
            >
              ${safeMessage}
            </div>

          </div>

          <!-- ADMIN RESPONSE -->

          <div
            style="
              background:
                linear-gradient(
                  135deg,
                  rgba(16,185,129,.09),
                  rgba(6,182,212,.05)
                );
              border:1px solid rgba(16,185,129,.18);
              border-radius:16px;
              padding:16px;
              margin-bottom:10px;
            "
          >

            <div
              style="
                display:flex;
                align-items:center;
                justify-content:space-between;
                gap:10px;
                margin-bottom:10px;
              "
            >

              <div
                style="
                  display:flex;
                  align-items:center;
                  gap:8px;
                  color:#6ee7b7;
                  font-size:13px;
                  font-weight:700;
                "
              >
                🛡️ Admin Response
              </div>

              <span
                style="
                  font-size:10px;
                  color:#64748b;
                "
              >
                SUPPORT
              </span>

            </div>

            <div
              style="
                color:#cbd5e1;
                font-size:14px;
                line-height:1.7;
                white-space:pre-wrap;
                word-break:break-word;
              "
            >
              ${safeAdminResponse}
            </div>

          </div>

          <!-- ISSUE ID -->

          <div
            style="
              color:#475569;
              font-size:10px;
              text-align:right;
              padding-top:3px;
              word-break:break-all;
            "
          >
            Issue ID: ${safeIssueId}
          </div>

        </div>
      `,

      didOpen: () => {
        const popup = Swal.getPopup();

        if (!popup) return;

        popup.style.border =
          "1px solid rgba(139,92,246,.18)";

        popup.style.boxShadow =
          "0 30px 90px rgba(0,0,0,.55)";

        const title = popup.querySelector(
          ".issue-details-title"
        );

        if (title) {
          title.style.color = "#f8fafc";
          title.style.fontWeight = "800";
          title.style.fontSize = "28px";
        }

        const closeButton = popup.querySelector(
          ".issue-close-btn"
        );

        if (closeButton) {
          closeButton.style.border = "0";
          closeButton.style.borderRadius = "12px";
          closeButton.style.padding = "12px 22px";
          closeButton.style.fontWeight = "700";
          closeButton.style.background =
            "linear-gradient(135deg,#7c3aed,#a855f7)";
          closeButton.style.color = "#fff";
          closeButton.style.boxShadow =
            "0 8px 24px rgba(124,58,237,.20)";
        }
      },
    });
  }, []);

  const cardInitial = isMobile
    ? false
    : {
        opacity: 0,
        y: 14,
      };

  const cardAnimate = isMobile
    ? undefined
    : {
        opacity: 1,
        y: 0,
      };

  return (
    <div
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#070b1a]
        py-6
        sm:py-10
        px-3
        sm:px-5
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          -top-32
          -left-32
          hidden
          sm:block
          w-96
          h-96
          bg-violet-600/20
          rounded-full
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          top-40
          -right-40
          hidden
          sm:block
          w-[28rem]
          h-[28rem]
          bg-cyan-500/10
          rounded-full
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-1/3
          hidden
          sm:block
          w-96
          h-96
          bg-fuchsia-500/10
          rounded-full
          blur-3xl
        "
      />

      <motion.div
        initial={{
          opacity: 0,
          y: isMobile ? 0 : 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: isMobile ? 0.15 : 0.4,
        }}
        className="
          relative
          max-w-7xl
          mx-auto
        "
      >

        <div
          className="
            relative
            overflow-hidden
            rounded-[26px]
            sm:rounded-[32px]
            border
            border-white/10
            bg-gradient-to-br
            from-white/[0.09]
            to-white/[0.03]
            sm:backdrop-blur-2xl
            shadow-lg
            sm:shadow-[0_25px_80px_rgba(0,0,0,0.35)]
          "
        >
          <div
            className="
              absolute
              top-0
              left-0
              right-0
              h-1
              bg-gradient-to-r
              from-violet-500
              via-fuchsia-500
              to-cyan-400
            "
          />

          <div className="p-5 sm:p-8 md:p-10">
        

            <button
              onClick={() =>
                navigate("/admin-dashboard")
              }
              className="
                group
                flex
                items-center
                gap-2
                text-slate-300
                hover:text-white
                transition
                mb-7
                text-sm
                sm:text-base
              "
            >
              <span
                className="
                  flex
                  items-center
                  justify-center
                  w-8
                  h-8
                  rounded-lg
                  bg-white/5
                  border
                  border-white/10
                  group-hover:bg-violet-500/20
                  group-hover:border-violet-400/30
                  transition
                "
              >
                <FaArrowLeft className="text-xs" />
              </span>

              Back to Dashboard
            </button>

            <div
              className="
                flex
                flex-col
                md:flex-row
                md:items-center
                gap-5
              "
            >
              <div className="relative shrink-0">

                <div
                  className="
                    absolute
                    inset-0
                    hidden
                    sm:block
                    bg-violet-500
                    blur-xl
                    opacity-40
                    rounded-2xl
                  "
                />

                <div
                  className="
                    relative
                    w-16
                    h-16
                    sm:w-20
                    sm:h-20
                    rounded-2xl
                    bg-gradient-to-br
                    from-violet-500
                    via-purple-500
                    to-fuchsia-500
                    flex
                    items-center
                    justify-center
                    text-3xl
                    sm:text-4xl
                    text-white
                    shadow-lg
                    sm:shadow-violet-500/20
                  "
                >
                  <FaExclamationCircle />
                </div>
              </div>

              <div className="min-w-0">
                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-2
                    mb-2
                  "
                >
                  <span
                    className="
                      px-3
                      py-1
                      rounded-full
                      text-[11px]
                      sm:text-xs
                      font-semibold
                      bg-violet-500/10
                      border
                      border-violet-400/20
                      text-violet-300
                    "
                  >
                    ADMIN PANEL
                  </span>

                  <span
                    className="
                      px-3
                      py-1
                      rounded-full
                      text-[11px]
                      sm:text-xs
                      font-semibold
                      bg-cyan-500/10
                      border
                      border-cyan-400/20
                      text-cyan-300
                    "
                  >
                    LIVE MONITORING
                  </span>
                </div>

                <h1
                  className="
                    text-3xl
                    sm:text-4xl
                    md:text-5xl
                    font-black
                    tracking-tight
                    text-white
                  "
                >
                  Manage Issues
                </h1>

                <p
                  className="
                    text-slate-400
                    mt-2
                    text-sm
                    sm:text-base
                    md:text-lg
                    max-w-2xl
                  "
                >
                  Track student reports, respond to
                  problems and keep the E-Library
                  running smoothly.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          className="
            grid
            grid-cols-2
            lg:grid-cols-4
            gap-3
            sm:gap-5
            mt-5
            sm:mt-7
          "
        >
          <StatCard
            label="Total Issues"
            value={stats.total}
            icon={<FaClipboardList />}
            gradient="from-violet-500 to-purple-600"
            glow="shadow-violet-500/10"
          />

          <StatCard
            label="Open"
            value={stats.open}
            icon={<FaExclamationCircle />}
            gradient="from-rose-500 to-red-600"
            glow="shadow-rose-500/10"
          />

          <StatCard
            label="In Progress"
            value={stats.inProgress}
            icon={<FaClock />}
            gradient="from-amber-400 to-orange-500"
            glow="shadow-amber-500/10"
          />

          <StatCard
            label="Resolved"
            value={stats.resolved}
            icon={<FaCheckCircle />}
            gradient="from-emerald-400 to-teal-500"
            glow="shadow-emerald-500/10"
          />
        </div>

        <div
          className="
            mt-5
            sm:mt-7
            rounded-[22px]
            sm:rounded-[24px]
            border
            border-white/10
            bg-white/[0.045]
            sm:backdrop-blur-xl
            p-4
            sm:p-6
            shadow-lg
            sm:shadow-xl
          "
        >
          <div
            className="
              flex
              flex-col
              lg:flex-row
              gap-3
            "
          >

            <div className="relative flex-1">
              <FaSearch
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-500
                "
              />

              <input
                type="text"
                placeholder="Search student, email, roll no..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="
                  w-full
                  h-12
                  sm:h-13
                  bg-[#0b1020]/80
                  border
                  border-white/10
                  rounded-xl
                  pl-11
                  pr-4
                  text-sm
                  sm:text-base
                  text-white
                  placeholder:text-slate-500
                  outline-none
                  focus:border-violet-500/60
                  focus:ring-2
                  focus:ring-violet-500/10
                  transition
                "
              />
            </div>

            <div
              className="
                flex
                flex-col
                sm:flex-row
                gap-3
                lg:w-[470px]
              "
            >
              <div className="relative flex-1">
                <FaFilter
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-500
                    text-xs
                    pointer-events-none
                  "
                />

                <select
                  value={typeFilter}
                  onChange={(e) =>
                    setTypeFilter(e.target.value)
                  }
                  className="
                    w-full
                    h-12
                    bg-[#0b1020]/80
                    border
                    border-white/10
                    rounded-xl
                    pl-10
                    pr-4
                    text-sm
                    text-white
                    outline-none
                    focus:border-violet-500/60
                    appearance-none
                    cursor-pointer
                  "
                >
                  <option value="All">
                    All Issue Types
                  </option>

                  <option value="upload_problem">
                    Upload Problem
                  </option>

                  <option value="notes_problem">
                    Notes Problem
                  </option>

                  <option value="pyq_problem">
                    PYQ Problem
                  </option>

                  <option value="resource_missing">
                    Resource Missing
                  </option>

                  <option value="link_problem">
                    Link Problem
                  </option>

                  <option value="download_problem">
                    Download Problem
                  </option>

                  <option value="preview_problem">
                    Preview Problem
                  </option>

                  <option value="login_problem">
                    Login Problem
                  </option>

                  <option value="technical_issue">
                    Technical Issue
                  </option>

                  <option value="suggestion">
                    Suggestion
                  </option>
                </select>
              </div>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="
                  w-full
                  sm:flex-1
                  h-12
                  bg-[#0b1020]/80
                  border
                  border-white/10
                  rounded-xl
                  px-4
                  text-sm
                  text-white
                  outline-none
                  focus:border-violet-500/60
                  cursor-pointer
                "
              >
                <option value="All">
                  All Status
                </option>

                <option value="open">
                  Open
                </option>

                <option value="in-progress">
                  In Progress
                </option>

                <option value="resolved">
                  Resolved
                </option>

                <option value="closed">
                  Closed
                </option>
              </select>
            </div>
          </div>

          <div
            className="
              flex
              items-center
              justify-between
              mt-4
              pt-4
              border-t
              border-white/5
            "
          >
            <p
              className="
                text-xs
                sm:text-sm
                text-slate-500
              "
            >
              Showing{" "}
              <span className="text-slate-300 font-semibold">
                {filteredIssues.length}
              </span>{" "}
              of{" "}
              <span className="text-slate-300 font-semibold">
                {issues.length}
              </span>{" "}
              issues
            </p>

            <div
              className="
                flex
                items-center
                gap-2
                text-xs
                text-emerald-400
              "
            >
              <span className="relative flex h-2 w-2">
                <span
                  className="
                    absolute
                    inline-flex
                    h-full
                    w-full
                    rounded-full
                    bg-emerald-400
                    opacity-60
                    animate-ping
                  "
                />

                <span
                  className="
                    relative
                    inline-flex
                    rounded-full
                    h-2
                    w-2
                    bg-emerald-400
                  "
                />
              </span>

              Live
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8">
          {loading ? (

            <div
              className="
                flex
                flex-col
                items-center
                justify-center
                py-24
              "
            >
              <div
                className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-gradient-to-br
                  from-violet-500
                  to-fuchsia-500
                  flex
                  items-center
                  justify-center
                  text-white
                  text-xl
                  animate-pulse
                  shadow-lg
                  shadow-violet-500/20
                "
              >
                <FaSpinner className="animate-spin" />
              </div>

              <h2
                className="
                  text-white
                  text-lg
                  sm:text-xl
                  font-semibold
                  mt-5
                "
              >
                Loading Issues...
              </h2>

              <p className="text-slate-500 text-sm mt-1">
                Fetching latest reports
              </p>
            </div>
          ) : filteredIssues.length === 0 ? (

            <div
              className="
                relative
                overflow-hidden
                rounded-[24px]
                sm:rounded-[26px]
                border
                border-white/10
                bg-white/[0.045]
                sm:backdrop-blur-xl
                py-20
                px-5
                text-center
              "
            >
              <div
                className="
                  absolute
                  inset-x-0
                  top-0
                  h-1
                  bg-gradient-to-r
                  from-violet-500
                  via-fuchsia-500
                  to-cyan-400
                "
              />

              <div
                className="
                  w-20
                  h-20
                  mx-auto
                  rounded-3xl
                  bg-gradient-to-br
                  from-slate-800
                  to-slate-900
                  border
                  border-white/10
                  flex
                  items-center
                  justify-center
                "
              >
                <FaFilter
                  className="
                    text-3xl
                    text-slate-500
                  "
                />
              </div>

              <h2
                className="
                  text-2xl
                  sm:text-3xl
                  font-bold
                  text-white
                  mt-6
                "
              >
                No Issues Found
              </h2>

              <p
                className="
                  text-slate-500
                  mt-2
                  text-sm
                  sm:text-base
                "
              >
                Try changing your search or filters.
              </p>
            </div>
          ) : (

            <div
              className="
                grid
                sm:grid-cols-2
                xl:grid-cols-3
                gap-4
                sm:gap-6
              "
            >
              {filteredIssues.map((issue, index) => {
                const theme = getIssueTheme(
                  issue.issueType
                );

                const statusStyle =
                  getStatusStyle(issue.status);

                return (
                  <motion.div
                    key={issue._id}
                    initial={cardInitial}
                    animate={cardAnimate}
                    transition={
                      isMobile
                        ? undefined
                        : {
                            duration: 0.25,
                            delay:
                              index < 6
                                ? index * 0.035
                                : 0,
                          }
                    }
                    whileHover={
                      isMobile
                        ? undefined
                        : {
                            y: -4,
                          }
                    }
                    className={`
                      group
                      relative
                      overflow-hidden
                      rounded-[22px]
                      sm:rounded-[24px]
                      border
                      ${theme.border}
                      bg-gradient-to-br
                      from-white/[0.075]
                      to-white/[0.025]
                      sm:backdrop-blur-xl
                      shadow-lg
                      sm:shadow-xl
                      hover:sm:shadow-2xl
                      transition-shadow
                      duration-200
                    `}
                  >

                    <div
                      className={`
                        h-1.5
                        bg-gradient-to-r
                        ${theme.gradient}
                      `}
                    />

                    <div className="p-5 sm:p-6">

                      <div
                        className="
                          flex
                          items-start
                          justify-between
                          gap-3
                        "
                      >
                        <div
                          className="
                            flex
                            items-center
                            gap-3
                            min-w-0
                          "
                        >
                          <div
                            className={`
                              w-12
                              h-12
                              shrink-0
                              rounded-2xl
                              ${theme.soft}
                              border
                              ${theme.border}
                              flex
                              items-center
                              justify-center
                              text-xl
                            `}
                          >
                            {theme.icon}
                          </div>

                          <div className="min-w-0">
                            <h2
                              className="
                                text-base
                                sm:text-lg
                                font-bold
                                text-white
                                truncate
                              "
                            >
                              {formatIssueType(
                                issue.issueType
                              )}
                            </h2>

                            <p
                              className="
                                text-slate-500
                                text-xs
                                mt-1
                              "
                            >
                              {formatDate(
                                issue.createdAt
                              )}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`
                            shrink-0
                            flex
                            items-center
                            gap-1.5
                            text-[10px]
                            sm:text-xs
                            font-bold
                            px-2.5
                            sm:px-3
                            py-1.5
                            rounded-full
                            whitespace-nowrap
                            ${statusStyle.badge}
                          `}
                        >
                          <span
                            className={`
                              w-1.5
                              h-1.5
                              rounded-full
                              ${statusStyle.dot}
                            `}
                          />

                          {formatStatus(issue.status)}
                        </span>
                      </div>

                      <div className="mt-6 space-y-4">
                        <InfoRow
                          label="Student"
                          value={
                            issue.studentName || "N/A"
                          }
                        />

                        <InfoRow
                          label="Email"
                          value={
                            issue.studentEmail || "N/A"
                          }
                          breakAll
                        />

                        <div
                          className="
                            grid
                            grid-cols-2
                            gap-3
                          "
                        >
                          <InfoBox
                            label="Roll No."
                            value={
                              issue.rollno || "N/A"
                            }
                          />

                          <InfoBox
                            label="Department"
                            value={
                              issue.department || "N/A"
                            }
                          />
                        </div>
                      </div>

                      <div
                        className="
                          grid
                          grid-cols-2
                          gap-2.5
                          mt-7
                        "
                      >
                        <button
                          onClick={() =>
                            handleView(issue)
                          }
                          className="
                            h-11
                            rounded-xl
                            bg-indigo-500/15
                            border
                            border-indigo-400/20
                            text-indigo-300
                            hover:bg-indigo-500
                            hover:text-white
                            hover:border-indigo-400
                            transition
                            flex
                            items-center
                            justify-center
                            gap-2
                            font-semibold
                            text-sm
                            active:scale-[0.98]
                          "
                        >
                          <FaEye />
                          View
                        </button>

                        <button
                          onClick={() =>
                            handleUpdateIssue(issue)
                          }
                          className="
                            h-11
                            rounded-xl
                            bg-amber-500/15
                            border
                            border-amber-400/20
                            text-amber-300
                            hover:bg-amber-400
                            hover:text-black
                            hover:border-amber-300
                            transition
                            flex
                            items-center
                            justify-center
                            gap-2
                            font-semibold
                            text-sm
                            active:scale-[0.98]
                          "
                        >
                          <FaClock />
                          Update
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(
                              issue._id
                            )
                          }
                          className="
                            col-span-2
                            h-11
                            rounded-xl
                            bg-rose-500/10
                            border
                            border-rose-400/20
                            text-rose-300
                            hover:bg-rose-500
                            hover:text-white
                            hover:border-rose-400
                            transition
                            flex
                            items-center
                            justify-center
                            gap-2
                            font-semibold
                            text-sm
                            active:scale-[0.98]
                          "
                        >
                          <FaTrash />
                          Delete Issue
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

const StatCard = memo(function StatCard({
  label,
  value,
  icon,
  gradient,
  glow,
}) {
  return (
    <motion.div
      whileHover={{
        y: -3,
      }}
      transition={{
        duration: 0.18,
      }}
      className={`
        relative
        overflow-hidden
        rounded-2xl
        sm:rounded-[24px]
        border
        border-white/10
        bg-white/[0.045]
        sm:backdrop-blur-xl
        p-4
        sm:p-6
        shadow-md
        sm:shadow-xl
        ${glow}
      `}
    >

      <div
        className={`
          absolute
          -right-8
          -top-8
          hidden
          sm:block
          w-24
          h-24
          rounded-full
          bg-gradient-to-br
          ${gradient}
          opacity-10
          blur-2xl
        `}
      />

      <div
        className="
          flex
          items-center
          justify-between
          gap-2
        "
      >
        <div className="min-w-0">
          <p
            className="
              text-slate-500
              text-[11px]
              sm:text-sm
              font-medium
              truncate
            "
          >
            {label}
          </p>

          <h2
            className="
              text-2xl
              sm:text-4xl
              font-black
              text-white
              mt-1
            "
          >
            {value}
          </h2>
        </div>

        <div
          className={`
            w-10
            h-10
            sm:w-12
            sm:h-12
            shrink-0
            rounded-xl
            sm:rounded-2xl
            bg-gradient-to-br
            ${gradient}
            flex
            items-center
            justify-center
            text-white
            text-sm
            sm:text-lg
            shadow-md
            sm:shadow-lg
          `}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
});

const InfoRow = memo(function InfoRow({
  label,
  value,
  breakAll = false,
}) {
  return (
    <div
      className="
        flex
        items-start
        justify-between
        gap-4
      "
    >
      <span
        className="
          text-slate-500
          text-sm
          font-medium
          shrink-0
        "
      >
        {label}
      </span>

      <span
        className={`
          text-slate-200
          text-sm
          text-right
          ${
            breakAll
              ? "break-all"
              : "break-words"
          }
        `}
      >
        {value}
      </span>
    </div>
  );
});

const InfoBox = memo(function InfoBox({
  label,
  value,
}) {
  return (
    <div
      className="
        rounded-xl
        bg-black/15
        border
        border-white/5
        p-3
      "
    >
      <p
        className="
          text-[11px]
          text-slate-500
          mb-1
        "
      >
        {label}
      </p>

      <p
        className="
          text-sm
          text-slate-200
          font-medium
          truncate
        "
      >
        {value}
      </p>
    </div>
  );
});