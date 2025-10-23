import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../config/api"; // ✅ added import

function EquipmentDetailPage() {
  const { id } = useParams();
  const [equipment, setEquipment] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(api.getEquipmentById(id)) // ✅ uses shared api helper
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch equipment details");
        return res.json();
      })
      .then((data) => setEquipment(data))
      .catch((err) => {
        console.error("Error fetching equipment:", err);
        setError("Unable to load equipment details.");
      });
  }, [id]);

  if (error) return <p className="text-center text-danger mt-4">{error}</p>;
  if (!equipment)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3 text-secondary">Loading equipment...</p>
      </div>
    );

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">{equipment.name}</h2>
      <img
        src={equipment.image_url}
        alt={equipment.name}
        className="img-fluid rounded mb-3"
      />
      <p>{equipment.description}</p>
      <p>
        <strong>Available:</strong>{" "}
        {equipment.is_quantity_based
          ? equipment.available_quantity
          : equipment.checked_out_by
          ? "Checked out"
          : "Available"}
      </p>
    </div>
  );
}

export default EquipmentDetailPage;
