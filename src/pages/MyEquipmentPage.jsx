// src/pages/MyEquipmentPage.jsx
import { useEffect, useState, useCallback } from "react";
import EquipmentList from "../components/EquipmentList";

function MyEquipmentPage({ user }) {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Reusable fetch so child components can trigger a refresh
  const fetchMyEquipment = useCallback(() => {
    if (!user) return;
    setLoading(true);

    const API_URL = import.meta.env.DEV
      ? `http://localhost:3001/api/equipment/my-equipment/${user.id}`
      : `/api/equipment/my-equipment/${user.id}`;

    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user's checked-out equipment");
        return res.json();
      })
      .then((data) => setEquipment(data))
      .catch((err) => {
        console.error("Error fetching user's equipment:", err);
        setError("Error loading equipment data.");
      })
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    fetchMyEquipment();
  }, [fetchMyEquipment]);

  if (!user)
    return <p className="text-center mt-5 text-secondary">Please log in to view your equipment.</p>;

  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3 text-secondary">Loading your checked-out equipment...</p>
      </div>
    );

  if (error) return <p className="text-center mt-4 text-danger">{error}</p>;

  return (
    <div className="text-center">
      <h2 className="my-4">My Checked-Out Equipment</h2>
      {equipment.length > 0 ? (
        <EquipmentList equipment={equipment} user={user} refreshEquipment={fetchMyEquipment} isMyPage={true} />
      ) : (
        <p className="text-muted">You have no equipment checked out.</p>
      )}
    </div>
  );
}

export default MyEquipmentPage;
