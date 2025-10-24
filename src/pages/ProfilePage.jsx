// src/pages/ProfilePage.jsx
import { useEffect, useState } from "react";
import api from "../config/api";

function ProfilePage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    grade_id: "",
    room: "",
    password: "",
  });
  const [grades, setGrades] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const profileURL = import.meta.env.DEV
      ? `http://localhost:3001/api/profile/${user.id}`
      : `/api/profile/${user.id}`;

    const fetchData = async () => {
      try {
        // Fetch profile data
        const profileRes = await fetch(profileURL);
        const profileData = await profileRes.json();

        // Fetch grade list
        const gradesRes = await fetch(api.getGrades());
        const gradesData = await gradesRes.json();
        setGrades(gradesData);

        // Load user data into form
        console.log("Setting form data:", profileData);

        setFormData({
          first_name: profileData.first_name ?? "",
          last_name: profileData.last_name ?? "",
          phone: profileData.phone ?? "",
          grade_id: profileData.grade_id ?? "",
          room: profileData.room ?? "",
          password: "",
        });
      } catch (err) {
        console.error("Error fetching profile or grades:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const API_URL = import.meta.env.DEV
      ? `http://localhost:3001/api/profile/${user.id}`
      : `/api/profile/${user.id}`;

    try {
      const res = await fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Profile updated successfully!");
        localStorage.setItem("user", JSON.stringify({ ...user, ...data }));
      } else {
        setMessage(data.error || "⚠️ Failed to update profile.");
      }
    } catch (err) {
      console.error("Update error:", err);
      setMessage("⚠️ Server error updating profile.");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3 text-secondary">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <p className="text-center mt-5 text-secondary">
        Please log in to view your profile.
      </p>
    );
  }

  return (
    <div className="container mt-4" style={{ maxWidth: "500px" }}>
      <h2 className="text-center mb-4">My Profile</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">First Name</label>
          <input
            type="text"
            name="first_name"
            className="form-control"
            value={formData.first_name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <input
            type="text"
            name="last_name"
            className="form-control"
            value={formData.last_name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            type="text"
            name="phone"
            className="form-control"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        {/* ✅ Dropdown for Grade */}
        <div className="mb-3">
          <label className="form-label">Grade</label>
          <select
            name="grade_id"
            className="form-control"
            value={formData.grade_id}
            onChange={handleChange}
          >
            <option value=""></option>
            {grades.map((g) => (
              <option key={g.id} value={g.id}>
                {g.grade_name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Room</label>
          <input
            type="text"
            name="room"
            className="form-control"
            value={formData.room}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">New Password (optional)</label>
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Enter new password"
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Save Changes
        </button>

        {message && <p className="text-center mt-3 text-muted">{message}</p>}
      </form>
    </div>
  );
}

export default ProfilePage;
