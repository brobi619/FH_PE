import { useEffect, useState } from "react";
import api from "../config/api";

function ApproveUsersPage({ user }) {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Load pending users
  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const res = await fetch(api.getPendingUsers());
        if (!res.ok) throw new Error("Failed to fetch pending users");
        const data = await res.json();
        setPendingUsers(data);
      } catch (err) {
        console.error("Error fetching pending users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingUsers();
  }, []);

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this user?")) return;

    try {
      const res = await fetch(api.approveUser(id), { method: "PATCH" });
      if (res.ok) {
        alert("✅ User approved and notified via email.");
        setPendingUsers((prev) => prev.filter((u) => u.id !== id));
      } else {
        alert("⚠️ Error approving user.");
      }
    } catch (err) {
      console.error("Approve error:", err);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject and delete this user?")) return;

    try {
      const res = await fetch(api.rejectUser(id), { method: "DELETE" });
      if (res.ok) {
        alert("🗑️ User rejected and notified via email.");
        setPendingUsers((prev) => prev.filter((u) => u.id !== id));
      } else {
        alert("⚠️ Error rejecting user.");
      }
    } catch (err) {
      console.error("Reject error:", err);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3 text-secondary">Loading pending users...</p>
      </div>
    );

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Pending User Approvals</h2>

      {pendingUsers.length === 0 ? (
        <p className="text-center text-muted">No pending users.</p>
      ) : (
        <table className="table table-striped align-middle shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Grade</th>
              <th>Room</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingUsers.map((u) => (
              <tr key={u.id}>
                <td>{u.first_name} {u.last_name}</td>
                <td>{u.email}</td>
                <td>{u.grade || "-"}</td>
                <td>{u.room || "-"}</td>
                <td className="text-center">
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => handleApprove(u.id)}
                    title="Approve User"
                  >
                    <i className="fas fa-check"></i>
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleReject(u.id)}
                    title="Reject User"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ApproveUsersPage;
