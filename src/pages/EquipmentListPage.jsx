import { useEffect, useState, useCallback } from "react";
import EquipmentList from "../components/EquipmentList";
import api from "../config/api"; // ✅ Central API helper
import "./EquipmentListPage.css";

function EquipmentListPage({ user }) {
  const [equipment, setEquipment] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const isAdmin = user?.role_id === 1;

  // ✅ Fetch all equipment and merge user-specific data
  const fetchEquipment = useCallback(() => {
    setLoading(true);

    fetch(api.getAllEquipment())
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch equipment data");
        return res.json();
      })
      .then(async (data) => {
        if (user && user.id) {
          try {
            const myRes = await fetch(api.getMyEquipment(user.id));
            if (myRes.ok) {
              const myData = await myRes.json();

              // Build map of equipment id → checkout info
              const myMap = new Map();
              myData.forEach((row) => myMap.set(row.id, row));

              // Merge user-specific info into main list
              const merged = data.map((item) => {
                const myRow = myMap.get(item.id);
                return myRow
                  ? {
                      ...item,
                      quantity_checked_out: myRow.quantity_checked_out,
                      checkout_id: myRow.checkout_id,
                      checked_out_by: myRow.checked_out_by,
                    }
                  : item;
              });

              setEquipment(merged);
              setFilteredEquipment(merged);
              return;
            }
          } catch (err) {
            console.error("Error fetching user's equipment for merge:", err);
          }
        }

        // Default case — no merge
        setEquipment(data);
        setFilteredEquipment(data);
      })
      .catch((err) => {
        console.error("Error fetching equipment:", err);
        setError("Error loading equipment data.");
      })
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    fetchEquipment();
  }, [fetchEquipment]);

  // ✅ Search, filter, and sort logic
  useEffect(() => {
    let filtered = [...equipment];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          (item.description && item.description.toLowerCase().includes(term))
      );
    }

    if (showAvailableOnly) {
      filtered = filtered.filter(
        (item) =>
          (item.is_quantity_based && item.available_quantity > 0) ||
          (!item.is_quantity_based && !item.checked_out_by)
      );
    }

    filtered.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );

    setFilteredEquipment(filtered);
  }, [equipment, searchTerm, showAvailableOnly]);

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

      {/* 🔍 Sticky Search & Filter Bar */}
      <div className="sticky-filter-bar bg-light shadow-sm p-3 mb-4">
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <input
            type="text"
            placeholder="Search equipment..."
            className="form-control w-100 w-md-50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="form-check ms-md-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="availableOnly"
              checked={showAvailableOnly}
              onChange={(e) => setShowAvailableOnly(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="availableOnly">
              Show only available equipment
            </label>
          </div>
        </div>
      </div>

      {/* ✅ Equipment List */}
      <EquipmentList
        equipment={filteredEquipment}
        user={user}
        isAdmin={isAdmin}
        refreshEquipment={fetchEquipment}
      />
    </div>
  );
}

export default EquipmentListPage;
