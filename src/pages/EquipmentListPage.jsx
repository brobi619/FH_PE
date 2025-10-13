import { useEffect, useState } from "react";
import EquipmentList from "../components/EquipmentList";

function EquipmentListPage({ user }) {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isAdmin = user?.role_id === 1; // ✅ determines admin status

  useEffect(() => {
    const API_URL = import.meta.env.DEV
      ? "http://localhost:3001/api/equipment"
      : "/api/equipment";

    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch equipment data");
        return res.json();
      })
      .then((data) => setEquipment(data))
      .catch((err) => {
        console.error("Error fetching equipment:", err);
        setError("Error loading equipment data.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3 text-secondary">Loading equipment...</p>
      </div>
    );

  if (error) return <p className="text-center mt-4 text-danger">{error}</p>;

  return (
    <div className="text-center">
      <h2 className="my-4">PE Equipment</h2>
      {/* ✅ Pass isAdmin correctly */}
      <EquipmentList equipment={equipment} isAdmin={isAdmin} />
    </div>
  );
}

export default EquipmentListPage;
