// src/components/LoginForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginForm({ setUser }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Save user in state + localStorage
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        setMessage("Login successful!");

        // ✅ Redirect to equipment page
        navigate("/equipment");
      } else {
        setMessage(data.message || "Login failed.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error, please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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

      <button type="submit" className="btn btn-primary w-100">
        Login
      </button>

      {message && <p className="text-center mt-3 text-muted">{message}</p>}
    </form>
  );
}

export default LoginForm;
