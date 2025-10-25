import { useNavigate } from "react-router-dom";
import "./ActionButtons.css";

function ActionButtons({ item, isAdmin, refreshEquipment, selectedQty = 1 }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const isCheckedOut = !!item.checked_out_by;
  const isCheckedOutByUser = user && item.checked_out_by === user.id;

  /* ✅ Handle checkout */
  const handleCheckout = async () => {
    if (!user) {
      alert("Please log in to check out equipment.");
      return;
    }

    try {
      const quantityToSend = item.is_quantity_based ? Number(selectedQty) || 1 : 1;

      const res = await fetch("http://localhost:3001/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          equipment_id: item.id,
          user_id: user.id,
          quantity_checked_out: quantityToSend,
          notes: null,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`✅ Successfully checked out: ${item.name}`);
        refreshEquipment?.();
      } else {
        alert(`⚠️ ${data.message || "Failed to check out item."}`);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Server error while checking out. Please try again.");
    }
  };

  /* ✅ Handle return */
  const handleReturn = async () => {
    if (!user) {
      alert("Please log in first.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/equipment/return", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          equipment_id: item.id,
          user_id: user.id,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message || "✅ Item returned successfully.");
        refreshEquipment?.();
      } else {
        alert(`⚠️ ${data.message || "Failed to return item."}`);
      }
    } catch (err) {
      console.error("Return error:", err);
      alert("Server error returning item. Please try again.");
    }
  };

  /* ✅ Handle edit (admin only) */
  const handleEdit = () => {
    navigate(`/equipment/${item.id}/edit`);
  };

  /* ✅ Handle delete (admin only) */
  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${item.name}"?`)) return;

    try {
      const res = await fetch(`http://localhost:3001/api/equipment/${item.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok) {
        alert("🗑️ Equipment deleted successfully.");
        refreshEquipment?.();
      } else {
        alert(`⚠️ ${data.message || "Failed to delete equipment."}`);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Server error deleting equipment.");
    }
  };

  /* ✅ Handle report issue (redirect to page) */
  const handleReportIssue = () => {
    if (!user) {
      alert("Please log in to report an issue.");
      return;
    }
    navigate(`/equipment/${item.id}/report`);
  };

  return (
    <div className={`action-buttons ${isAdmin ? "admin" : "user"}`}>
      {/* ✅ Return if checked out by user */}
      {isCheckedOutByUser ? (
        <button
          className="action-btn return"
          title="Return Equipment"
          onClick={handleReturn}
        >
          <i className="fas fa-undo" />
        </button>
      ) : (
        <button
          className="action-btn checkout"
          title={isCheckedOut ? "Checked Out" : "Check Out"}
          onClick={!isCheckedOut ? handleCheckout : undefined}
          disabled={isCheckedOut}
        >
          <i className="fas fa-shopping-cart" />
        </button>
      )}

      {/* ⚠️ Report Issue (redirects instead of modal) */}
      <button
        className="action-btn issue"
        title="Report Issue"
        onClick={handleReportIssue}
      >
        <i className="fas fa-exclamation-triangle" />
      </button>

      {/* 🛠 Admin Controls */}
      {isAdmin && (
        <>
          <button
            className="action-btn edit"
            title="Edit"
            onClick={handleEdit}
          >
            <i className="fas fa-pen" />
          </button>
          <button
            className="action-btn delete"
            title="Delete"
            onClick={handleDelete}
          >
            <i className="fas fa-trash" />
          </button>
        </>
      )}
    </div>
  );
}

export default ActionButtons;
