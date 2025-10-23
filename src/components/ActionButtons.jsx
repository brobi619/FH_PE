import "./ActionButtons.css";
import api from "../config/api";

function ActionButtons({ item, isAdmin, refreshEquipment, selectedQty = 1 }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const isCheckedOut = !!item.checked_out_by;
  const isCheckedOutByUser = user && item.checked_out_by === user.id;

  // ✅ Handle checkout
  const handleCheckout = async () => {
    if (!user) {
      alert("Please log in to check out equipment.");
      return;
    }

    try {
      const quantityToSend = item.is_quantity_based ? Number(selectedQty) || 1 : 1;

      const res = await fetch(api.checkout(), {
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
        refreshEquipment?.(); // 🔁 refresh data instead of reloading
      } else {
        alert(`⚠️ ${data.message || "Failed to check out item."}`);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Server error while checking out. Please try again.");
    }
  };

  // ✅ Handle return
  const handleReturn = async () => {
    if (!user) {
      alert("Please log in first.");
      return;
    }

    try {
      const res = await fetch(api.returnEquipment(), {
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
        refreshEquipment?.(); // 🔁 refresh after returning
      } else {
        alert(`⚠️ ${data.message || "Failed to return item."}`);
      }
    } catch (err) {
      console.error("Return error:", err);
      alert("Server error returning item. Please try again.");
    }
  };

  return (
    <div className={`action-buttons ${isAdmin ? "admin" : "user"}`}>
      {/* ✅ Show Return if the current user checked it out */}
      {isCheckedOutByUser ? (
        <button
          className="action-btn return"
          title="Return Equipment"
          onClick={handleReturn}
        >
          <i className="fas fa-undo" />
        </button>
      ) : (
        // ✅ Otherwise show checkout (disabled if checked out by someone else)
        <button
          className="action-btn checkout"
          title={isCheckedOut ? "Checked Out" : "Check Out"}
          onClick={!isCheckedOut ? handleCheckout : undefined}
          disabled={isCheckedOut}
        >
          <i className="fas fa-shopping-cart" />
        </button>
      )}

      {/* ⚠️ Report Issue */}
      <button className="action-btn issue" title="Report Issue">
        <i className="fas fa-exclamation-triangle" />
      </button>

      {/* 🛠 Admin-only controls */}
      {isAdmin && (
        <>
          <button className="action-btn edit" title="Edit">
            <i className="fas fa-pen" />
          </button>
          <button className="action-btn delete" title="Delete">
            <i className="fas fa-trash" />
          </button>
        </>
      )}
    </div>
  );
}

export default ActionButtons;
