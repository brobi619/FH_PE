import { Link } from "react-router-dom";
import { useState } from "react";
import ActionButtons from "./ActionButtons";
import QuantityPicker from "./QuantityPicker";
import "./EquipmentCard.css";

function EquipmentCard({ data, isAdmin, refreshEquipment, isMyPage }) {
  const {
    id,
    name,
    description,
    picture_url,
    is_quantity_based,
    available_quantity,
    quantity_checked_out,
    checked_out_by,
    current_condition, // ✅ field now matches backend
  } = data;

  const condition = current_condition || data.latest_condition; // fallback just in case

  const shortDesc =
    description?.length > 100
      ? description.substring(0, 97) + "..."
      : description || "No description available.";

  const user = JSON.parse(localStorage.getItem("user"));
  const isCheckedOut = available_quantity <= 0;
  const isCheckedOutByUser = user && checked_out_by === user.id;

  const cardClass = `equipment-card card shadow-sm d-flex flex-row align-items-center justify-content-between p-3 ${
    isCheckedOut && !isCheckedOutByUser ? "dimmed" : ""
  }`;

  // Per-card selected quantity
  const [selectedQty, setSelectedQty] = useState(1);

  const getNumeric = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  };

  const numericAvailable =
    getNumeric(available_quantity) ??
    (getNumeric(data.total_quantity) !== undefined &&
    getNumeric(data.checked_out_quantity) !== undefined
      ? getNumeric(data.total_quantity) - getNumeric(data.checked_out_quantity)
      : undefined);

  // ✅ Helper for condition badge
  const getConditionBadge = (condition) => {
    switch (condition) {
      case "Usable":
        return <span className="badge bg-success">Usable</span>;
      case "Needs Repair":
        return <span className="badge bg-warning text-dark">Needs Repair</span>;
      case "Broken / Unusable":
        return <span className="badge bg-danger">Broken / Unusable</span>;
      default:
        return null;
    }
  };

  return (
    <div className={cardClass}>
      {/* Left: Image */}
      <div className="image-container me-3 position-relative">
        <Link to={`/equipment/${id}`}>
          <img
            src={picture_url}
            alt={name}
            className="equipment-img img-fluid rounded"
          />
        </Link>

        {/* ✅ Condition badge over image */}
        {condition && (
          <div
            className="position-absolute top-0 start-0 m-2"
            style={{ zIndex: 2 }}
          >
            {getConditionBadge(condition)}
          </div>
        )}
      </div>

      {/* Middle: Info */}
      <div className="info flex-grow-1 text-start">
        <div className="d-flex align-items-center justify-content-between">
          <h5 className="fw-bold mb-1">
            <Link
              to={`/equipment/${id}`}
              className={`text-decoration-none ${
                isCheckedOut && !isCheckedOutByUser
                  ? "text-secondary"
                  : "text-dark"
              }`}
            >
              {name}
            </Link>
          </h5>

          {/* ✅ Condition badge next to name (fallback if not using overlay) */}
          {!condition ? null : (
            <div className="d-md-none">{getConditionBadge(condition)}</div>
          )}
        </div>

        <p className="small text-muted mb-2">{shortDesc}</p>

        {is_quantity_based && (
          <div className="d-flex align-items-center gap-2 flex-wrap">
            {numericAvailable !== undefined ? (
              <span
                className={`small ${
                  numericAvailable > 0
                    ? "text-secondary"
                    : "text-danger fw-semibold"
                }`}
              >
                {numericAvailable > 0
                  ? `${numericAvailable} available`
                  : "0 available"}
              </span>
            ) : quantity_checked_out ? (
              <span className="small text-secondary">
                {`${quantity_checked_out} checked out by you`}
              </span>
            ) : null}

            {!isMyPage &&
              !isCheckedOutByUser &&
              (numericAvailable === undefined || numericAvailable > 0) && (
                <QuantityPicker
                  max={
                    numericAvailable !== undefined
                      ? numericAvailable
                      : Number(data.total_quantity) || 1
                  }
                  equipmentId={id}
                  value={selectedQty}
                  onChange={setSelectedQty}
                />
              )}
          </div>
        )}

        {!is_quantity_based && isCheckedOut && !isCheckedOutByUser && (
          <p className="small text-danger mt-1 mb-0 fw-semibold">
            Checked out by another user
          </p>
        )}
        {isCheckedOutByUser && (
          <p className="small text-success mt-1 mb-0 fw-semibold">
            {is_quantity_based
              ? quantity_checked_out
                ? `You have ${quantity_checked_out} checked out`
                : "You have this checked out"
              : "You have this checked out"}
          </p>
        )}
      </div>

      {/* Right: Action Buttons */}
      <div className="button-group d-flex align-items-center gap-2 ms-3">
        <ActionButtons
          item={data}
          isAdmin={isAdmin}
          refreshEquipment={refreshEquipment}
          selectedQty={selectedQty}
        />
      </div>
    </div>
  );
}

export default EquipmentCard;
