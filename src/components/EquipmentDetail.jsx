import "./EquipmentDetail.css";

function EquipmentDetail({ data, isAdmin }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const isCheckedOut = data.checked_out?.length > 0;
  const checkedOutByUser =
    isCheckedOut && data.checked_out[0].user_id === user?.id;

  const handleCheckout = async () => {
    if (!user) {
      alert("Please log in to check out equipment.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          equipment_id: data.id,
          user_id: user.id,
          quantity_checked_out: 1,
          notes: null,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        alert(`✅ Successfully checked out: ${data.name}`);
        window.location.reload();
      } else {
        alert(`⚠️ ${result.message || "Checkout failed."}`);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Server error while checking out.");
    }
  };

  const handleReturn = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/equipment/return", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          equipment_id: data.id,
          user_id: user.id,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        alert("✅ Item successfully returned.");
        window.location.reload();
      } else {
        alert(`⚠️ ${result.message || "Failed to return item."}`);
      }
    } catch (err) {
      console.error("Return error:", err);
      alert("Server error while returning item.");
    }
  };

  return (
    <div
      className={`equipment-detail card shadow-sm p-4 ${
        isCheckedOut && !checkedOutByUser ? "dimmed" : ""
      }`}
    >
      <div className="row align-items-center">
        <div className="col-md-4 text-center">
          <img
            src={data.picture_url}
            alt={data.name}
            className="img-fluid rounded"
            style={{ maxHeight: "250px", objectFit: "cover" }}
          />
        </div>

        <div className="col-md-8">
          <h2 className="fw-bold mb-2">{data.name}</h2>
          <p className="text-muted">{data.description}</p>

          {data.purchase_date && (
            <p className="small text-secondary">
              Purchased on: {new Date(data.purchase_date).toLocaleDateString()}
            </p>
          )}

          <div className="mt-3 d-flex gap-2">
            {checkedOutByUser ? (
              <button
                className="btn btn-success d-flex align-items-center gap-2"
                onClick={handleReturn}
              >
                <i className="fas fa-undo"></i> Return
              </button>
            ) : (
              <button
                className="btn btn-primary d-flex align-items-center gap-2"
                onClick={handleCheckout}
                disabled={isCheckedOut}
              >
                <i className="fas fa-shopping-cart"></i> Check Out
              </button>
            )}

            <button className="btn btn-warning text-dark d-flex align-items-center gap-2">
              <i className="fas fa-exclamation-triangle"></i> Report Issue
            </button>
          </div>

          {isCheckedOut && (
            <div className="mt-4">
              <hr />
              <p className="fw-bold mb-3">Currently Checked Out By:</p>

              {data.checked_out.map((co) => (
                <div
                  key={co.id}
                  className="checkout-info border rounded p-3 mb-2 bg-light"
                >
                  <div className="fw-bold mb-1">
                    {co.first_name} {co.last_name}
                  </div>
                  {co.email && (
                    <div className="small mb-1">
                      <i className="fas fa-envelope me-1 text-secondary"></i>
                      <a
                        href={`mailto:${co.email}`}
                        className="text-decoration-none text-primary"
                      >
                        {co.email}
                      </a>
                    </div>
                  )}
                  {co.grade_name && (
                    <div className="small text-secondary">
                      <strong>Grade:</strong> {co.grade_name}
                    </div>
                  )}
                  <div className="text-muted small mt-2">
                    Checked out on:{" "}
                    {new Date(co.checkout_date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EquipmentDetail;
