import React, { useEffect, useState } from "react";
import { adminAPI } from "../../services/api";

export default function ManageUsers() {
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [pendingSearch, setPendingSearch] = useState("");
  const [pendingDept, setPendingDept] = useState("All");
  const [pendingYear, setPendingYear] = useState("All");
  
  const [approvedSearch, setApprovedSearch] = useState("");
  const [approvedDept, setApprovedDept] = useState("All");
  const [approvedYear, setApprovedYear] = useState("All");

  useEffect(() => {
    loadStudents();
    
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

  const filterPending = (students) => {
    return students.filter((s) => {
      const matchesSearch = 
        (s.name?.toLowerCase().includes(pendingSearch.toLowerCase()) ||
         s.email?.toLowerCase().includes(pendingSearch.toLowerCase()));
      const matchesDept = pendingDept === "All" || s.department === pendingDept;
      const matchesYear = pendingYear === "All" || s.year === pendingYear;
      return matchesSearch && matchesDept && matchesYear;
    });
  };

  const filterApproved = (students) => {
    return students.filter((s) => {
      const matchesSearch = 
        (s.name?.toLowerCase().includes(approvedSearch.toLowerCase()) ||
         s.email?.toLowerCase().includes(approvedSearch.toLowerCase()));
      const matchesDept = approvedDept === "All" || s.department === approvedDept;
      const matchesYear = approvedYear === "All" || s.year === approvedYear;
      return matchesSearch && matchesDept && matchesYear;
    });
  };

  const filteredPending = filterPending(pending);
  const filteredApproved = filterApproved(approved);

  const allDepartments = ["All", "BA", "BSC", "BCOM", "BCA"];
  const allYears = ["All", "1st Year", "2nd Year", "3rd Year", "1st Semester", "2nd Semester", "3rd Semester", "4th Semester", "5th Semester", "6th Semester"];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 p-8 text-white">
      <h1 className="text-4xl font-bold mb-8 text-center">👥 Manage Users</h1>

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 shadow-xl border border-white/20">
        <h2 className="text-2xl font-bold mb-4 text-pink-300">Pending Student Requests</h2>
        
        <div className="mb-4 space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={pendingSearch}
              onChange={(e) => setPendingSearch(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <span className="absolute left-3 top-2.5">🔍</span>
          </div>
          
          <div className="flex gap-3">
            <select
              value={pendingDept}
              onChange={(e) => setPendingDept(e.target.value)}
              className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              {allDepartments.map((dept) => (
                <option key={dept} value={dept} className="bg-purple-600">
                  {dept === "All" ? "All Departments" : dept}
                </option>
              ))}
            </select>
            
            <select
              value={pendingYear}
              onChange={(e) => setPendingYear(e.target.value)}
              className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              {allYears.map((year) => (
                <option key={year} value={year} className="bg-purple-600">
                  {year === "All" ? "All Years" : year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredPending.length === 0 ? (
          <p className="text-white/70 text-center py-4">No pending requests found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/20 text-pink-200">
                  <th className="p-3 font-semibold">Full Name</th>
                  <th className="p-3 font-semibold">Email</th>
                  <th className="p-3 font-semibold">Roll No</th>
                  <th className="p-3 font-semibold">Department</th>
                  <th className="p-3 font-semibold">Year/Sem</th>
                  <th className="p-3 font-semibold">Mobile</th>
                  <th className="p-3 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPending.map((s) => (
                  <tr key={s._id} className="border-b border-white/20 hover:bg-white/10">
                    <td className="p-3">{s.name}</td>
                    <td className="p-3">{s.email}</td>
                    <td className="p-3">{s.rollno || "-"}</td>
                    <td className="p-3">{s.department}</td>
                    <td className="p-3">{s.year}</td>
                    <td className="p-3">{s.mobile || "-"}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => approveStudent(s._id)}
                        className="bg-green-500 px-4 py-1 rounded text-white mr-2 hover:bg-green-600 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => declineStudent(s._id)}
                        className="bg-red-500 px-4 py-1 rounded text-white hover:bg-red-600 transition"
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

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
        <h2 className="text-2xl font-bold mb-4 text-yellow-300">Approved Students</h2>
        
        <div className="mb-4 space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={approvedSearch}
              onChange={(e) => setApprovedSearch(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <span className="absolute left-3 top-2.5">🔍</span>
          </div>
          
          <div className="flex gap-3">
            <select
              value={approvedDept}
              onChange={(e) => setApprovedDept(e.target.value)}
              className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              {allDepartments.map((dept) => (
                <option key={dept} value={dept} className="bg-purple-600">
                  {dept === "All" ? "All Departments" : dept}
                </option>
              ))}
            </select>
            
            <select
              value={approvedYear}
              onChange={(e) => setApprovedYear(e.target.value)}
              className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              {allYears.map((year) => (
                <option key={year} value={year} className="bg-purple-600">
                  {year === "All" ? "All Years" : year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredApproved.length === 0 ? (
          <p className="text-white/70 text-center py-4">No approved students found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/20 text-yellow-200">
                  <th className="p-3 font-semibold">Full Name</th>
                  <th className="p-3 font-semibold">Email</th>
                  <th className="p-3 font-semibold">Roll No</th>
                  <th className="p-3 font-semibold">Department</th>
                  <th className="p-3 font-semibold">Year/Sem</th>
                  <th className="p-3 font-semibold">Mobile</th>
                  <th className="p-3 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredApproved.map((s) => (
                  <tr key={s._id} className="border-b border-white/20 hover:bg-white/10">
                    <td className="p-3">{s.name}</td>
                    <td className="p-3">{s.email}</td>
                    <td className="p-3">{s.rollno || "-"}</td>
                    <td className="p-3">{s.department}</td>
                    <td className="p-3">{s.year}</td>
                    <td className="p-3">{s.mobile || "-"}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => removeStudent(s._id)}
                        className="bg-red-500 px-4 py-1 rounded text-white hover:bg-red-600 transition"
                      >
                        Remove
                      </button>
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
