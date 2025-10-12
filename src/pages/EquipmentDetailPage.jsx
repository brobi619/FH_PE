import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EquipmentDetail from "../components/EquipmentDetail";

function EquipmentDetailPage() {
  const { id } = useParams();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const API_URL = import.meta.env.DEV
      ? `http://localhost:3001/api/equipment/${id}`
      : `/api/equipment/${id}`;

    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch equipment details");
        return res.json();
      })
      .then((data) => setEquipment(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3 text-secondary">Loading equipment...</p>
      </div>
    );
  }

  if (error)
    return <p className="text-center mt-4 text-danger">{error}</p>;

  if (!equipment)
    return <p className="text-center mt-4 text-muted">Item not found.</p>;

  return (
    <div className="container mt-4">
      <EquipmentDetail data={equipment} isAdmin={false} />
    </div>
  );
}

export default EquipmentDetailPage;
