import { useEffect, useState } from "react";

function ApproveUsersPage({ user }) {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_URL = import.meta.env.DEV
      ? "http://localhost:3001/api/admin/pending-users"
      : "/api/admin/pending-users";

    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setPendingUsers(data))
      .catch((err) => console.error("Error fetching pending users:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this user?")) return;

    const API_URL = import.meta.env.DEV
      ? `http://localhost:3001/api/admin/approve/${id}`
      : `/api/admin/approve/${id}`;

    const res = await fetch(API_URL, { method: "PATCH" });
    if (res.ok) {
      alert("✅ User approved and notified via email.");
      setPendingUsers((prev) => prev.filter((u) => u.id !== id));
    } else {
      alert("⚠️ Error approving user.");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject and delete this user?")) return;

    const API_URL = import.meta.env.DEV
      ? `http://localhost:3001/api/admin/reject/${id}`
      : `/api/admin/reject/${id}`;

    const res = await fetch(API_URL, { method: "DELETE" });
    if (res.ok) {
      alert("🗑️ User rejected and notified via email.");
      setPendingUsers((prev) => prev.filter((u) => u.id !== id));
    } else {
      alert("⚠️ Error rejecting user.");
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
                <td>{u.grade_id || "-"}</td>
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
