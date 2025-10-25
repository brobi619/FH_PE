// src/pages/EquipmentDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EquipmentDetail from "../components/EquipmentDetail";
import ConditionReports from "../components/ConditionReports";
import "./EquipmentDetailPage.css";

function EquipmentDetailPage() {
  const { id } = useParams();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const API_URL = import.meta.env.DEV
          ? `http://localhost:3001/api/equipment/${id}`
          : `/api/equipment/${id}`;

        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch equipment details");

        const data = await res.json();
        setEquipment(data);
      } catch (err) {
        console.error("Error fetching equipment:", err);
        setError("Unable to load equipment details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [id]);

  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3 text-secondary">Loading equipment...</p>
      </div>
    );

  if (error)
    return <p className="text-center text-danger mt-4">{error}</p>;

  if (!equipment)
    return <p className="text-center mt-5">No equipment found.</p>;

  return (
    <div className="container mt-5 mb-5" style={{ maxWidth: "900px" }}>
      {/* ✅ Equipment Detail Card */}
      <EquipmentDetail data={equipment} isAdmin={true} />

      {/* ✅ Condition Reports Section */}
      <ConditionReports equipmentId={equipment.id} />
    </div>
  );
}

export default EquipmentDetailPage;
