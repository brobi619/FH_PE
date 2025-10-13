import { useEffect, useState } from "react";
import EquipmentList from "../components/EquipmentList";

function EquipmentListPage({ user }) {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Determine admin status
  const isAdmin = user?.role_id === 1;

  // ✅ Function to reload equipment after checkout/return
  const fetchEquipment = () => {
    const API_URL = import.meta.env.DEV
      ? "http://localhost:3001/api/equipment"
      : "/api/equipment";

    setLoading(true);
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
  };

  useEffect(() => {
    fetchEquipment();
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
      <h2 className="my-4">All Equipment</h2>
      {/* ✅ Pass user, admin flag, and refresh function */}
      <EquipmentList
        equipment={equipment}
        user={user}
        isAdmin={isAdmin}
        refreshEquipment={fetchEquipment}
      />
    </div>
  );
}

export default EquipmentListPage;
