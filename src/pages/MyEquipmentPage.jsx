import { useEffect, useState } from "react";
import api from "../config/api"; // ✅ added import
import EquipmentList from "../components/EquipmentList";

function MyEquipmentPage({ user }) {
  const [myEquipment, setMyEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyEquipment = () => {
    if (!user?.id) return;

    setLoading(true);
    fetch(api.getMyEquipment(user.id)) // ✅ centralized call
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch your equipment");
        return res.json();
      })
      .then((data) => setMyEquipment(data))
      .catch((err) => {
        console.error("Error loading equipment:", err);
        setError("Unable to load your equipment list.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMyEquipment();
  }, [user]);

  if (!user) return <p className="text-center mt-5">Please log in first.</p>;
  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3 text-secondary">Loading your equipment...</p>
      </div>
    );
  if (error) return <p className="text-center text-danger mt-4">{error}</p>;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">My Equipment</h2>
      {myEquipment.length === 0 ? (
        <p className="text-center">You haven’t checked out any equipment yet.</p>
      ) : (
        <EquipmentList
          equipment={myEquipment}
          user={user}
          isAdmin={false}
          refreshEquipment={fetchMyEquipment}
        />
      )}
    </div>
  );
}

export default MyEquipmentPage;
