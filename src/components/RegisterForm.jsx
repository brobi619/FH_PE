import { useState } from "react";
import api from "../config/api"; // ✅ added
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
      const res = await fetch(api.register(), { // ✅ centralized
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
      {/* same form fields */}
      ...
    </form>
  );
}

export default RegisterForm;
