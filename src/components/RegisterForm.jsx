import { useState } from "react";
import "./RegisterForm.css";

function RegisterForm() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    grade_id: "",
    room: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setMessage(data.message || "Registration successful! Await admin approval.");
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
      console.error(err);
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
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Grade</label>
        <select
          name="grade_id"
          className="form-select"
          onChange={handleChange}
          required
        >
          <option value="">Select Grade</option>
          <option value="1">TK</option>
          <option value="2">K</option>
          <option value="3">1st</option>
          <option value="4">2nd</option>
          <option value="5">3rd</option>
          <option value="6">4th</option>
          <option value="7">5th</option>
          <option value="8">6th</option>
          <option value="9">Other</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Room Number / Name</label>
        <input
          type="text"
          name="room"
          className="form-control"
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="btn btn-primary w-100">
        Register
      </button>

      {message && <p className="text-center mt-3 text-success">{message}</p>}
    </form>
  );
}

export default RegisterForm;
