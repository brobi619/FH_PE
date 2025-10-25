// src/pages/AddEquipmentPage.jsx
import { useState } from "react";
import "./ManageUsers.css"; // ✅ Reuse toggle switch styles

function AddEquipmentPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    purchase_date: "",
    picture_url: "",
    is_active: true,
    is_quantity_based: false,
    total_quantity: "",
  });

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  // ✅ Handle text/number field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle toggle switches
  const handleToggle = (name) => {
    setFormData((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  // ✅ Handle file uploads to Cloudflare R2
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setFormData((prev) => ({ ...prev, picture_url: data.url }));
        setMessage("✅ Image uploaded successfully!");
        setSuccess(true);
      } else {
        throw new Error(data.message || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("⚠️ Error uploading image.");
      setSuccess(false);
    } finally {
      setUploading(false);
    }
  };

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccess(false);

    const API_URL = import.meta.env.DEV
      ? "http://localhost:3001/api/equipment"
      : "/api/equipment";

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          total_quantity: formData.is_quantity_based
            ? Number(formData.total_quantity) || 0
            : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add equipment.");

      setMessage("✅ Equipment added successfully!");
      setSuccess(true);

      // ✅ Reset form after successful add
      setFormData({
        name: "",
        description: "",
        purchase_date: "",
        picture_url: "",
        is_active: true,
        is_quantity_based: false,
        total_quantity: "",
      });

      // Auto-clear message after 3s
      setTimeout(() => {
        setMessage("");
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Error adding equipment:", err);
      setMessage("⚠️ Failed to add equipment.");
      setSuccess(false);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "600px" }}>
      <h2 className="text-center mb-4">Add New Equipment</h2>

      {message && (
        <div
          className={`alert text-center ${
            success ? "alert-success" : "alert-warning"
          }`}
        >
          {message}
        </div>
      )}

      {/* ✅ Image Upload Section */}
      <div className="mb-4 text-center">
        {formData.picture_url ? (
          <img
            src={formData.picture_url}
            alt="Preview"
            style={{
              width: "200px",
              height: "200px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        ) : (
          <p>No image selected</p>
        )}

        <div className="mt-3">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            id="fileUpload"
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => document.getElementById("fileUpload").click()}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "📸 Upload Photo"}
          </button>
        </div>
      </div>

      {/* ✅ Form Fields */}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            rows="3"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Purchase Date</label>
          <input
            type="date"
            name="purchase_date"
            className="form-control"
            value={formData.purchase_date}
            onChange={handleChange}
          />
        </div>

        {/* ✅ Quantity Based Toggle */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <label className="form-label mb-0">Quantity Based</label>
          <label className="switch">
            <input
              type="checkbox"
              checked={formData.is_quantity_based}
              onChange={() => handleToggle("is_quantity_based")}
            />
            <span className="slider"></span>
          </label>
        </div>

        {/* ✅ Show Total Quantity if Enabled */}
        {formData.is_quantity_based && (
          <div className="mb-3">
            <label className="form-label">Total Quantity</label>
            <input
              type="number"
              name="total_quantity"
              className="form-control"
              value={formData.total_quantity}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
        )}

        {/* ✅ Active Toggle */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <label className="form-label mb-0">Active</label>
          <label className="switch">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={() => handleToggle("is_active")}
            />
            <span className="slider"></span>
          </label>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Add Equipment
        </button>
      </form>
    </div>
  );
}

export default AddEquipmentPage;
