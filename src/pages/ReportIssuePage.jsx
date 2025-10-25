// src/pages/ReportIssuePage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

function ReportIssuePage() {
  const { id } = useParams(); // equipment_id
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    condition: "Usable",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please log in to report an issue.");
      return;
    }

    if (!formData.description.trim()) {
      alert("Please describe the issue.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const API_URL = import.meta.env.DEV
        ? "http://localhost:3001/api/condition-reports"
        : "/api/condition-reports";

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          equipment_id: id,
          reported_by: user.id,
          condition: formData.condition,
          description: formData.description.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Issue reported successfully!");
        setTimeout(() => navigate(`/equipment/${id}`), 1500);
      } else {
        setMessage(`⚠️ ${data.message || "Failed to submit issue."}`);
      }
    } catch (err) {
      console.error("Submit error:", err);
      setMessage("⚠️ Server error while submitting report.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-5 mb-5" style={{ maxWidth: "700px" }}>
      <h2 className="text-center mb-4">Report Equipment Condition</h2>

      {message && (
        <div
          className={`alert ${
            message.startsWith("✅") ? "alert-success" : "alert-warning"
          } text-center`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* ✅ Condition dropdown */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Condition</label>
          <select
            name="condition"
            className="form-select"
            value={formData.condition}
            onChange={handleChange}
          >
            <option value="Usable">Usable</option>
            <option value="Needs Repair">Needs Repair</option>
            <option value="Broken / Unusable">Broken / Unusable</option>
          </select>
        </div>

        {/* ✅ Description text area */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Description</label>
          <textarea
            className="form-control"
            rows="4"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe what’s wrong or any details about the condition..."
            required
          />
        </div>

        <div className="d-flex justify-content-between mt-4">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
          <button
            type="submit"
            className="btn btn-warning"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReportIssuePage;
