import React, { useEffect, useState } from "react";
import { adminAPI } from "../../services/api";

export default function ManageUsers() {
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
    
    // Poll for updates every 3 seconds
    const interval = setInterval(loadStudents, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadStudents = async () => {
    try {
      const [pendingResponse, allResponse] = await Promise.all([
        adminAPI.getPendingStudents(),
        adminAPI.getAllStudents({ status: "approved" }),
      ]);

      if (pendingResponse.data.success) {
        setPending(pendingResponse.data.data);
      }
      if (allResponse.data.success) {
        setApproved(allResponse.data.data);
      }
    } catch (error) {
      console.error("Error loading students:", error);
    } finally {
      setLoading(false);
    }
  };

  const approveStudent = async (studentId) => {
    try {
      const response = await adminAPI.approveStudent(studentId);
      if (response.data.success) {
        loadStudents();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to approve");
    }
  };

  const declineStudent = async (studentId) => {
    if (!window.confirm("Are you sure you want to reject this student?")) return;
    try {
      const response = await adminAPI.rejectStudent(studentId);
      if (response.data.success) {
        loadStudents();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to reject");
    }
  };

  const removeStudent = async (studentId) => {
    if (!window.confirm("Are you sure you want to remove this student?")) return;
    try {
      const response = await adminAPI.rejectStudent(studentId);
      if (response.data.success) {
        loadStudents();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to remove");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">👩‍💻 Manage Student Users</h1>

      
      <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 mb-10 shadow-xl">
        <h2 className="text-2xl font-semibold mb-4 text-yellow-200">⏳ Pending Requests</h2>
        {pending.length === 0 ? (
          <p className="text-gray-200 text-center">No pending requests.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/30 text-yellow-100">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pending.map((s) => (
                <tr key={s._id} className="border-b border-white/30 hover:bg-white/10">
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">{s.email}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => approveStudent(s._id)}
                      className="bg-green-500 px-3 py-1 rounded text-white mr-2 hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => declineStudent(s._id)}
                      className="bg-red-500 px-3 py-1 rounded text-white hover:bg-red-600"
                    >
                      Decline
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

     
      <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-semibold mb-4 text-green-200">✅ Approved Students</h2>
        {approved.length === 0 ? (
          <p className="text-gray-200 text-center">No approved students yet.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/30 text-green-100">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {approved.map((s) => (
                <tr key={s._id} className="border-b border-white/30 hover:bg-white/10">
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">{s.email}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => removeStudent(s._id)}
                      className="bg-gray-500 px-3 py-1 rounded text-white hover:bg-gray-600"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
