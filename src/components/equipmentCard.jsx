import { Link } from "react-router-dom";
import ActionButtons from "./ActionButtons";
import QuantityPicker from "./QuantityPicker";
import "./EquipmentCard.css";

function EquipmentCard({ data, isAdmin = false }) {
  const {
    id,
    name,
    description,
    picture_url,
    is_quantity_based,
    total_quantity,
    checked_out_by, // ✅ new field from backend
  } = data;

  const shortDesc =
    description?.length > 100
      ? description.substring(0, 97) + "..."
      : description || "No description available.";

  // ✅ Get logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Determine if this item is checked out
  const isCheckedOut = !!checked_out_by;
  const isCheckedOutByUser = user && checked_out_by === user.id;

  // ✅ Add CSS class if checked out
  const cardClass = `equipment-card card shadow-sm d-flex flex-row align-items-center justify-content-between p-3 ${
    isCheckedOut ? "checked-out" : ""
  }`;

  return (
    <div className={cardClass}>
      {/* Left: Image */}
      <div className="image-container me-3">
        <Link to={`/equipment/${id}`}>
          <img
            src={picture_url}
            alt={name}
            className="equipment-img img-fluid rounded"
          />
        </Link>
      </div>

      {/* Middle: Info */}
      <div className="info flex-grow-1 text-start">
        <h5 className="fw-bold mb-1">
          <Link
            to={`/equipment/${id}`}
            className={`text-decoration-none ${
              isCheckedOut ? "text-secondary" : "text-dark"
            }`}
          >
            {name}
          </Link>
        </h5>

        <p className={`small mb-2 ${isCheckedOut ? "text-muted" : "text-muted"}`}>
          {shortDesc}
        </p>

        {is_quantity_based && (
          <div className="d-flex align-items-center gap-2">
            <span className="small text-secondary">
              {total_quantity} available
            </span>
            <QuantityPicker max={total_quantity} />
          </div>
        )}

        {/* ✅ Checked-out label */}
        {isCheckedOut && !isCheckedOutByUser && (
          <p className="small text-danger mt-1 mb-0 fw-semibold">
            Checked out by another user
          </p>
        )}
        {isCheckedOutByUser && (
          <p className="small text-success mt-1 mb-0 fw-semibold">
            You have this checked out
          </p>
        )}
      </div>

      {/* Right: Action Buttons */}
      <div className="button-group d-flex align-items-center gap-2 ms-3">
        <ActionButtons item={data} isAdmin={isAdmin} />
      </div>
    </div>
  );
}

export default EquipmentCard;
