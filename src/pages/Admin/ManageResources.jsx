import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { resourceAPI } from "../../services/api";

import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

import {
  FaArrowLeft,
  FaBook,
  FaSearch,
  FaFilter,
} from "react-icons/fa";

export default function ManageResources() {
  const navigate = useNavigate();

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await resourceAPI.getAllResourcesAdmin();
      setResources(response.data.data || []);
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to fetch resources.",
        confirmButtonColor: "#7c3aed",
      });
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    return {
      total: resources.length,
      approved: resources.filter(
        (r) => r.status === "approved"
      ).length,
      pending: resources.filter(
        (r) => r.status === "pending"
      ).length,
      rejected: resources.filter(
        (r) => r.status === "rejected"
      ).length,
    };
  }, [resources]);

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesSearch =
        resource.title
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        resource.uploadedBy
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesType =
        typeFilter === "All" ||
        resource.type === typeFilter;

      const matchesDepartment =
        departmentFilter === "All" ||
        resource.department === departmentFilter;

      const matchesYear =
        yearFilter === "All" ||
        resource.year === yearFilter;

      const matchesStatus =
        statusFilter === "All" ||
        resource.status === statusFilter;

      return (
        matchesSearch &&
        matchesType &&
        matchesDepartment &&
        matchesYear &&
        matchesStatus
      );
    });
  }, [
    resources,
    search,
    typeFilter,
    departmentFilter,
    yearFilter,
    statusFilter,
  ]);

  const showSuccess = (title) => {
    Swal.fire({
      icon: "success",
      title,
      timer: 1600,
      showConfirmButton: false,
      background: "#ffffff",
    });
  };

  const showError = () => {
    Swal.fire({
      icon: "error",
      title: "Something went wrong",
      text: "Please try again.",
      confirmButtonColor: "#7c3aed",
    });
  };

  const handleApprove = async (id) => {
    try {
      await resourceAPI.approveResource(id);

      showSuccess("Resource Approved");

      fetchResources();
    } catch (error) {
      console.error(error);
      showError();
    }
  };

  const handleReject = async (id) => {
    const result = await Swal.fire({
      title: "Reject Resource?",
      text: "You can approve it later if needed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Reject",
      confirmButtonColor: "#f59e0b",
      cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) return;

    try {
      await resourceAPI.rejectResource(id);

      showSuccess("Resource Rejected");

      fetchResources();
    } catch (error) {
      console.error(error);
      showError();
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Resource?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {
      await resourceAPI.deleteResource(id);

      showSuccess("Resource Deleted");

      fetchResources();
    } catch (error) {
      console.error(error);
      showError();
    }
  };
  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-10 px-5">

    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto"
    >

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

        <button
          onClick={() => navigate("/admin-dashboard")}
          className="flex items-center gap-2 text-white hover:text-indigo-400 transition mb-6"
        >
          <FaArrowLeft />
          Back to Dashboard
        </button>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">

          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-3xl text-white">
            <FaBook />
          </div>

          <div>

            <h1 className="text-3xl sm:text-4xl font-bold text-white text-center sm:text-left">
              Manage Resources
            </h1>

            <p className="text-slate-300 mt-2 text-center sm:text-left max-w-lg">
              Approve, Reject, Delete and Manage uploaded study resources.
            </p>

          </div>

        </div>

      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 gap-5 mt-8">

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5 sm:p-6">
          <p className="text-slate-400 text-sm">
            Total Resources
          </p>

          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
            {stats.total}
          </h2>
        </div>

        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-5 sm:p-6">

          <p className="text-green-300 text-sm">
            Approved
          </p>

          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
            {stats.approved}
          </h2>

        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-5 sm:p-6">

          <p className="text-yellow-300 text-sm">
            Pending
          </p>

          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
            {stats.pending}
          </h2>

        </div>

        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 sm:p-6">

          <p className="text-red-300 text-sm">
            Rejected
          </p>

          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
            {stats.rejected}
          </h2>

        </div>

      </div>

      <div className="mt-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

          <div className="relative lg:col-span-2">

            <FaSearch className="absolute left-4 top-4 text-slate-400" />

            <input
              type="text"
              placeholder="Search by title or uploader..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900/70 border border-slate-700 rounded-xl pl-12 pr-4 py-2.5 sm:py-3 text-white outline-none focus:border-indigo-500"
            />

          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 sm:py-3 text-white"
          >
            <option>All</option>
            <option>Book</option>
            <option>Notes</option>
            <option>PYQ</option>
          </select>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 sm:py-3 text-white"
          >
            <option>All</option>
            <option>BCA</option>
            <option>BSC</option>
            <option>BA</option>
            <option>B.Com</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 sm:py-3 text-white"
          >
            <option>All</option>
            <option>approved</option>
            <option>pending</option>
            <option>rejected</option>
          </select>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">

          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 sm:py-3 text-white lg:w-[220px]"
          >
            <option>All</option>
            <option>1st Year</option>
            <option>2nd Year</option>
            <option>3rd Year</option>
          </select>

        </div>

      </div>

      <div className="mt-8">

        {loading ? (

          <h2 className="text-center text-white text-xl sm:text-2xl">
            Loading Resources...
          </h2>

        ) : (
                      <>
            {filteredResources.length === 0 ? (

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl py-20 text-center">

                <FaFilter className="text-6xl text-slate-500 mx-auto mb-5" />

                <h2 className="text-3xl font-bold text-white">
                  No Resources Found
                </h2>

                <p className="text-slate-400 mt-3">
                  Try changing your search or filters.
                </p>

              </div>

            ) : (

              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">

                {filteredResources.map((resource) => (

                  <motion.div
                    key={resource._id}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl"
                  >

                    <div className="flex items-start justify-between">

                      <h2 className="text-xl sm:text-2xl font-bold text-white">
                        {resource.title}
                      </h2>

                      {resource.status === "approved" && (
                        <span className="bg-green-600 text-white text-sm px-3 py-1 rounded-full">
                          Approved
                        </span>
                      )}

                      {resource.status === "pending" && (
                        <span className="bg-yellow-500 text-black text-sm px-3 py-1 rounded-full">
                          Pending
                        </span>
                      )}

                      {resource.status === "rejected" && (
                        <span className="bg-red-600 text-white text-sm px-3 py-1 rounded-full">
                          Rejected
                        </span>
                      )}

                    </div>

                    <div className="mt-6 space-y-3 text-slate-300">

                      <div className="flex justify-between">
                        <span className="font-semibold">
                          Type
                        </span>

                        <span>
                          {resource.type}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="font-semibold">
                          Department
                        </span>

                        <span>
                          {resource.department}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="font-semibold">
                          Year
                        </span>

                        <span>
                          {resource.year}
                        </span>
                      </div>

                      <div className="flex justify-between gap-5">

                        <span className="font-semibold whitespace-nowrap">
                          Uploaded By
                        </span>

                        <span className="text-right break-all">
                          {resource.uploadedBy}
                        </span>

                      </div>

                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-8">

                      <button
                        onClick={() =>
                          navigate(`/admin/resource/${resource._id}`, {
                            state: { from: "admin" },
                          })
                        }
                        className="bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 sm:py-3 rounded-xl font-semibold transition"
                      >
                        👁 View
                      </button>

                      <button
                        onClick={() => handleApprove(resource._id)}
                        className="bg-green-600 hover:bg-green-700 text-white py-2.5 sm:py-3 rounded-xl font-semibold transition"
                      >
                        ✅ Approve
                      </button>

                      <button
                        onClick={() => handleReject(resource._id)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-black py-2.5 sm:py-3 rounded-xl font-semibold transition"
                      >
                        ❌ Reject
                      </button>

                      <button
                        onClick={() => handleDelete(resource._id)}
                        className="bg-red-600 hover:bg-red-700 text-white py-2.5 sm:py-3 rounded-xl font-semibold transition"
                      >
                        🗑 Delete
                      </button>

                    </div>

                  </motion.div>

                ))}

              </div>

            )}

          </>

        )}

      </div>

    </motion.div>

  </div>
);
}