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
  } = data;

  const shortDesc =
    description?.length > 100
      ? description.substring(0, 97) + "..."
      : description || "No description available.";

  return (
    <div className="equipment-card card shadow-sm d-flex flex-row align-items-center justify-content-between p-3">
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
          <Link to={`/equipment/${id}`} className="text-decoration-none text-dark">
            {name}
          </Link>
        </h5>
        <p className="text-muted small mb-2">{shortDesc}</p>

        {is_quantity_based && (
          <div className="d-flex align-items-center gap-2">
            <span className="small text-secondary">
              {total_quantity} available
            </span>
            <QuantityPicker max={total_quantity} />
          </div>
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
