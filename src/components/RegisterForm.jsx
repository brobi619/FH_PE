import { useState, useEffect } from "react";
import api from "../config/api";
import "./RegisterForm.css";

function RegisterForm() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    grade_id: "",
    room: "",
  });

  const [grades, setGrades] = useState([]);
  const [message, setMessage] = useState("");

  // ✅ Fetch grade list from your backend
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const res = await fetch(api.getGrades());
        if (!res.ok) throw new Error("Failed to fetch grades");
        const data = await res.json();
        setGrades(data);
      } catch (err) {
        console.error("Error fetching grades:", err);
      }
    };
    fetchGrades();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        grade_id: formData.grade_id ? Number(formData.grade_id) : null,
      };

      const res = await fetch(api.register(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setMessage(data.message || "Registration successful! Await admin approval.");
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form mx-auto">
      <div className="mb-3">
        <label className="form-label">First Name</label>
        <input
          type="text"
          name="first_name"
          className="form-control"
          value={formData.first_name}
          onChange={handleChange}
          required
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
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          type="email"
          name="email"
          className="form-control"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Password</label>
        <input
          type="password"
          name="password"
          className="form-control"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      {/* ✅ Live dropdown from database */}
      <div className="mb-3">
        <label className="form-label">Grade</label>
        <select
          name="grade_id"
          className="form-control"
          value={formData.grade_id}
          onChange={handleChange}
          required
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
        <label className="form-label">Room (optional)</label>
        <input
          type="text"
          name="room"
          className="form-control"
          value={formData.room}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="btn btn-primary w-100 mt-3">
        Register
      </button>

      {message && <p className="text-center mt-3 text-muted">{message}</p>}
    </form>
  );
}

export default RegisterForm;
