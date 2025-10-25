import "./ActionButtons.css";
import api from "../config/api";
import { Link } from "react-router-dom";

function ActionButtons({ item, isAdmin, refreshEquipment, selectedQty = 1 }) {
  const user = JSON.parse(localStorage.getItem("user"));

  // Is *anyone* currently checked out on this item?
  const isCheckedOut = !!item.checked_out_by;

  // Is the CURRENT logged-in user the one who has it?
  const isCheckedOutByUser = user && item.checked_out_by === user.id;

  // For quantity-based items (like balls, cones, etc),
  // we should only block checkout if there are 0 left.
  const isOutOfStock =
    item.is_quantity_based && Number(item.available_quantity) <= 0;

  // For single items (like 1 speaker),
  // block checkout if someone else already has it.
  const isLockedBySomeoneElse =
    !item.is_quantity_based && isCheckedOut && !isCheckedOutByUser;

  // Final rule: should the checkout button be disabled?
  const disableCheckout = isOutOfStock || isLockedBySomeoneElse;

  // Text / tooltip for the checkout button
  let checkoutTitle = "Check Out";
  if (isOutOfStock) {
    checkoutTitle = "Out of Stock";
  } else if (isLockedBySomeoneElse) {
    checkoutTitle = "Checked Out";
  }

  // ✅ Handle checkout
  const handleCheckout = async () => {
    if (!user) {
      alert("Please log in to check out equipment.");
      return;
    }

    try {
      const quantityToSend = item.is_quantity_based
        ? Number(selectedQty) || 1
        : 1;

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
        refreshEquipment?.(); // refresh parent data
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
        refreshEquipment?.(); // refresh after returning
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
      {/* If THIS user already has this item, show Return */}
      {isCheckedOutByUser ? (
        <button
          className="action-btn return"
          title="Return Equipment"
          onClick={handleReturn}
        >
          <i className="fas fa-undo" />
        </button>
      ) : (
        // Otherwise show Checkout, with our smarter rules
        <button
          className="action-btn checkout"
          title={checkoutTitle}
          onClick={!disableCheckout ? handleCheckout : undefined}
          disabled={disableCheckout}
        >
          <i className="fas fa-shopping-cart" />
        </button>
      )}

      {/* Report Issue (future condition report flow) */}
      <button className="action-btn issue" title="Report Issue">
        <i className="fas fa-exclamation-triangle" />
      </button>

      {/* Admin-only controls */}
      {isAdmin && (
        <>
          <Link
            to={`/equipment/${item.id}/edit`}
            className="action-btn edit"
            title="Edit"
          >
            <i className="fas fa-pen" />
          </Link>

          <button className="action-btn delete" title="Delete">
            <i className="fas fa-trash" />
          </button>
        </>
      )}
    </div>
  );
}

export default ActionButtons;
