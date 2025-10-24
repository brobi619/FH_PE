// src/pages/ManageUsers.jsx
import { useEffect, useState } from "react";
import "./ManageUsers.css";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "last_name", direction: "asc" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const API_URL = import.meta.env.DEV
        ? "http://localhost:3001/api/manage-users"
        : "/api/manage-users";

      const res = await fetch(API_URL);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setMessage("⚠️ Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const toggleAdmin = async (id, makeAdmin) => {
    setMessage("");

    const adminCount = users.filter((u) => u.role_id === 1).length;
    const isThisUserAdmin = users.find((u) => u.id === id)?.role_id === 1;

    if (!makeAdmin && isThisUserAdmin && adminCount === 1) {
      setMessage("⚠️ You cannot remove the last remaining admin.");
      return;
    }

    try {
      const API_URL = import.meta.env.DEV
        ? `http://localhost:3001/api/manage-users/${id}/role`
        : `/api/manage-users/${id}/role`;

      const res = await fetch(API_URL, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ makeAdmin }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessage(data.message);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role_id: makeAdmin ? 1 : 2 } : u))
      );
    } catch (err) {
      console.error("Error updating role:", err);
      setMessage("⚠️ Failed to update user role.");
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setMessage("");

    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser?.id === id) {
      setMessage("⚠️ You cannot delete your own account.");
      return;
    }

    const adminCount = users.filter((u) => u.role_id === 1).length;
    const isTargetAdmin = users.find((u) => u.id === id)?.role_id === 1;
    if (isTargetAdmin && adminCount === 1) {
      setMessage("⚠️ You cannot delete the last remaining admin.");
      return;
    }

    try {
      const API_URL = import.meta.env.DEV
        ? `http://localhost:3001/api/manage-users/${id}`
        : `/api/manage-users/${id}`;

      const res = await fetch(API_URL, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setMessage("✅ User deleted.");
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
      setMessage("⚠️ Failed to delete user.");
    }
  };

  // ✅ Sorting logic
  const sortedUsers = [...users]
    .filter((u) =>
      `${u.first_name} ${u.last_name} ${u.email}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const { key, direction } = sortConfig;
      const order = direction === "asc" ? 1 : -1;

      if (key === "admin") {
        return (a.role_id === 1 ? -1 : 1) * order;
      }

      if (a[key] < b[key]) return -1 * order;
      if (a[key] > b[key]) return 1 * order;
      return 0;
    });

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3 text-secondary">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Manage Users</h2>

      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {message && <p className="text-center text-muted">{message}</p>}

      <table className="table table-striped align-middle">
        <thead>
          <tr>
            <th onClick={() => handleSort("first_name")} style={{ cursor: "pointer" }}>
              Name {sortConfig.key === "first_name" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
            </th>
            <th onClick={() => handleSort("email")} style={{ cursor: "pointer" }}>
              Email {sortConfig.key === "email" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
            </th>
            <th onClick={() => handleSort("admin")} style={{ cursor: "pointer" }}>
              Admin {sortConfig.key === "admin" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((u) => (
            <tr key={u.id}>
              <td>{u.first_name} {u.last_name}</td>
              <td>{u.email}</td>
              <td>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={u.role_id === 1}
                    onChange={(e) => toggleAdmin(u.id, e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </td>
              <td>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteUser(u.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageUsers;
