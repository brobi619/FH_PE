import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../config/api";
import "../pages/ManageUsers.css"; // ✅ Reuse the toggle switch styles

function EquipmentEditPage({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Redirect if not admin
  useEffect(() => {
    if (!user || user.role_id !== 1) navigate("/equipment");
  }, [user, navigate]);

  // ✅ Load existing equipment data
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const res = await fetch(api.getEquipmentById(id));
        if (!res.ok) throw new Error("Failed to fetch equipment.");
        const data = await res.json();
        setEquipment(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load equipment details.");
      } finally {
        setLoading(false);
      }
    };
    fetchEquipment();
  }, [id]);

  // ✅ Handle form updates
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEquipment((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ Save changes (PUT request)
  const handleSave = async () => {
    if (!equipment) return;
    setSaving(true);
    try {
      const res = await fetch(api.updateEquipment(id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(equipment),
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Equipment updated successfully!");
        navigate(`/equipment/${id}`);
      } else {
        alert(`⚠️ ${data.message || "Failed to update equipment."}`);
      }
    } catch (err) {
      console.error(err);
      alert("Server error while saving. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Delete handler
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this equipment?")) return;
    try {
      const res = await fetch(api.deleteEquipment(id), { method: "DELETE" });
      if (res.ok) {
        alert("🗑️ Equipment deleted.");
        navigate("/equipment");
      } else {
        alert("Failed to delete equipment.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error while deleting.");
    }
  };

  // ✅ Print handler
  const handlePrint = () => {
    window.print();
  };

  // ✅ Upload image handler (with 5 MB limit)
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 🚫 Client-side size check
    if (file.size > 5 * 1024 * 1024) {
      alert("⚠️ File too large — please choose an image under 5 MB.");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("equipment_id", id); // ✅ tell backend which record to update

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.url) {
        setEquipment((prev) => ({ ...prev, picture_url: data.url }));
        alert("✅ Image uploaded successfully!");
      } else {
        alert("⚠️ Upload failed: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("❌ Error uploading image.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <p className="text-center mt-4">Loading equipment...</p>;
  if (error)
    return <div className="alert alert-danger mt-4 text-center">{error}</div>;

  return (
    <div className="container mt-4" style={{ maxWidth: "700px" }}>
      <h2 className="mb-4">Edit Equipment</h2>

      {/* ✅ Image Section */}
      <div className="mb-4 text-center">
        {equipment.picture_url ? (
          <img
            src={equipment.picture_url}
            alt={equipment.name}
            style={{
              width: "200px",
              height: "200px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        ) : (
          <p>No image available</p>
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
            {uploading ? "Uploading..." : "📸 Edit Photo"}
          </button>
        </div>
      </div>

      {/* Editable fields */}
      <div className="mb-3">
        <label className="form-label fw-semibold">Name</label>
        <input
          type="text"
          className="form-control"
          name="name"
          value={equipment.name || ""}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">Description</label>
        <textarea
          className="form-control"
          name="description"
          rows="3"
          value={equipment.description || ""}
          onChange={handleChange}
        />
      </div>

      {/* ✅ Quantity toggle + conditional field */}
      <div className="row mb-3 align-items-center">
        <div className="col-md-6">
          <label className="form-label fw-semibold me-2">
            Quantity Based Item
          </label>
          <label className="switch">
            <input
              type="checkbox"
              name="is_quantity_based"
              checked={equipment.is_quantity_based || false}
              onChange={handleChange}
            />
            <span className="slider"></span>
          </label>
        </div>

        {equipment.is_quantity_based && (
          <div className="col-md-6">
            <label className="form-label fw-semibold">Total Quantity</label>
            <input
              type="number"
              className="form-control"
              name="total_quantity"
              value={equipment.total_quantity || 0}
              onChange={handleChange}
            />
          </div>
        )}
      </div>

      {/* ✅ Active status toggle */}
      <div className="mb-4">
        <label className="form-label fw-semibold me-2">Active</label>
        <label className="switch">
          <input
            type="checkbox"
            name="is_active"
            checked={equipment.is_active || false}
            onChange={handleChange}
          />
          <span className="slider"></span>
        </label>
      </div>

      {/* Action buttons */}
      <div className="d-flex gap-3">
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        <button className="btn btn-outline-secondary" onClick={handlePrint}>
          Print Tag
        </button>

        <button className="btn btn-danger ms-auto" onClick={handleDelete}>
          Delete
        </button>
      </div>

      <div className="mt-4">
        <Link to={`/equipment/${id}`} className="text-decoration-none">
          ← Back to Equipment Details
        </Link>
      </div>
    </div>
  );
}

export default EquipmentEditPage;
