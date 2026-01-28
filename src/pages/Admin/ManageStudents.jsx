import { useEffect, useState } from "react";
import { adminAPI } from "../../services/api";
import { motion } from "framer-motion";

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    loadStudents();
    
    const interval = setInterval(loadStudents, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadStudents = async () => {
    try {
      const [allResponse, pendingResponse] = await Promise.all([
        adminAPI.getAllStudents(),
        adminAPI.getPendingStudents(),
      ]);

      if (allResponse.data.success) {
        setStudents(allResponse.data.data);
      }
      if (pendingResponse.data.success) {
        setPending(pendingResponse.data.data);
      }
    } catch (error) {
      console.error("Error loading students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (studentId) => {
    try {
      const response = await adminAPI.approveStudent(studentId);
      if (response.data.success) {
        showToast("✅ Student approved successfully!", "success");
        loadStudents();
      } else {
        showToast(response.data.message || "Failed to approve", "error");
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to approve", "error");
    }
  };

  const handleReject = async (studentId) => {
    if (!window.confirm("Are you sure you want to reject this student?")) return;

    try {
      const response = await adminAPI.rejectStudent(studentId);
      if (response.data.success) {
        showToast("🗑️ Student rejected and removed", "success");
        loadStudents();
      } else {
        showToast(response.data.message || "Failed to reject", "error");
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to reject", "error");
    }
  };

  const handleBlock = async (studentId) => {
    try {
      const response = await adminAPI.blockStudent(studentId);
      if (response.data.success) {
        showToast("🚫 Student blocked successfully", "success");
        loadStudents();
      } else {
        showToast(response.data.message || "Failed to block", "error");
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to block", "error");
    }
  };

  const handleUnblock = async (studentId) => {
    try {
      const response = await adminAPI.unblockStudent(studentId);
      if (response.data.success) {
        showToast("✅ Student unblocked successfully", "success");
        loadStudents();
      } else {
        showToast(response.data.message || "Failed to unblock", "error");
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to unblock", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading students...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 text-white">
      {toast && (
        <div
          className={`fixed top-5 right-5 flex items-center gap-2 px-5 py-3 rounded-lg shadow-lg text-white backdrop-blur-md transition-all z-50 ${
            toast.type === "error" ? "bg-red-500/90" : "bg-green-500/90"
          }`}
        >
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6 text-center">👩‍💻 Manage Student Users</h1>

      
      <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 mb-10 shadow-xl">
        <h2 className="text-2xl font-semibold mb-4 text-yellow-200">⏳ Pending Requests</h2>
        {pending.length === 0 ? (
          <p className="text-gray-200 text-center">No pending requests.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/30 text-yellow-100">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Year</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((s) => (
                  <tr key={s._id} className="border-b border-white/30 hover:bg-white/10">
                    <td className="p-3">{s.name}</td>
                    <td className="p-3">{s.email}</td>
                    <td className="p-3">{s.department}</td>
                    <td className="p-3">{s.year}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleApprove(s._id)}
                        className="bg-green-500 px-3 py-1 rounded text-white mr-2 hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(s._id)}
                        className="bg-red-500 px-3 py-1 rounded text-white hover:bg-red-600"
                      >
                        Decline
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

     
      <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-semibold mb-4 text-green-200">✅ All Students</h2>
        {students.length === 0 ? (
          <p className="text-gray-200 text-center">No students yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/30 text-green-100">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Year</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s._id} className="border-b border-white/30 hover:bg-white/10">
                    <td className="p-3">{s.name}</td>
                    <td className="p-3">{s.email}</td>
                    <td className="p-3">{s.department}</td>
                    <td className="p-3">{s.year}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          s.status === "approved"
                            ? "bg-green-500"
                            : s.status === "blocked"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {s.status === "blocked" ? (
                        <button
                          onClick={() => handleUnblock(s._id)}
                          className="bg-green-500 px-3 py-1 rounded text-white hover:bg-green-600"
                        >
                          Unblock
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBlock(s._id)}
                          className="bg-red-500 px-3 py-1 rounded text-white hover:bg-red-600"
                        >
                          Block
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
