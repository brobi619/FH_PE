import "./ActionButtons.css";

function ActionButtons({ item, isAdmin }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const isCheckedOut = !!item.checked_out_by;
  const isCheckedOutByUser = user && item.checked_out_by === user.id;

  // ✅ Checkout handler
  const handleCheckout = async () => {
    if (!user) return alert("Please log in to check out equipment.");

    // 🧮 Find quantity from the QuantityPicker for this specific item
    const qtyInput = document.querySelector(
      `[data-equipment-id="${item.id}"] input`
    );
    const quantity =
      qtyInput && qtyInput.value ? parseInt(qtyInput.value, 10) : 1;

    try {
      const res = await fetch("http://localhost:3001/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          equipment_id: item.id,
          user_id: user.id,
          quantity_checked_out: quantity, // ✅ send actual quantity
          notes: null,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`✅ Checked out ${quantity} ${item.name}(s) successfully`);
        window.location.reload();
      } else {
        alert(`⚠️ ${data.message || "Failed to check out item."}`);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Server error while checking out. Please try again.");
    }
  };

  // ✅ Return handler
  const handleReturn = async () => {
    if (!user) return alert("Please log in first.");

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
        window.location.reload();
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
      {/* ✅ Return button for the user who has it */}
      {isCheckedOutByUser ? (
        <button
          className="action-btn return"
          title="Return Equipment"
          onClick={handleReturn}
        >
          <i className="fas fa-undo" />
        </button>
      ) : (
        // ✅ Checkout button (disabled if another user has it)
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

      {/* 🛠 Admin-only buttons */}
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
