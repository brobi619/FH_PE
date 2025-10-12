import QuantityPicker from "./QuantityPicker";
import ActionButtons from "./ActionButtons";
import "./EquipmentDetail.css";

function EquipmentDetail({ data, isAdmin = false }) {
  if (!data) return null;

  const {
    name,
    description,
    picture_url,
    is_quantity_based,
    total_quantity,
    purchase_date,
    checked_out,
  } = data;

  return (
    <div className="equipment-detail card shadow-lg p-4">
      <div className="row g-4 align-items-center">
        {/* Left: Image */}
        <div className="col-md-5 text-center">
          <img
            src={picture_url}
            alt={name}
            className="img-fluid rounded detail-img"
          />
        </div>

        {/* Right: Info */}
        <div className="col-md-7 text-start">
          <h3 className="fw-bold mb-3">{name}</h3>
          <p className="text-muted">{description}</p>

          {purchase_date && (
            <p className="small text-secondary mb-3">
              Purchased on:{" "}
              {new Date(purchase_date).toLocaleDateString("en-US")}
            </p>
          )}

          {is_quantity_based && (
            <div className="d-flex align-items-center gap-3 mb-4">
              <span className="small text-secondary">
                {total_quantity} available
              </span>
              <QuantityPicker max={total_quantity} />
            </div>
          )}

          <div className="d-flex justify-content-start mt-3 mb-4">
            <ActionButtons item={data} isAdmin={isAdmin} />
          </div>

          {/* NEW SECTION: Checked Out Info */}
          <div className="checked-out-section mt-4">
            <h6 className="fw-bold mb-2">Currently Checked Out By:</h6>
            {checked_out && checked_out.length > 0 ? (
              <ul className="list-group small">
                {checked_out.map((entry) => (
                  <li
                    key={entry.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span>
                      {entry.first_name} {entry.last_name}{" "}
                      {entry.grade_name && (
                        <span className="text-secondary">
                          ({entry.grade_name})
                        </span>
                      )}
                    </span>
                    <span className="text-muted small">
                      {new Date(entry.checkout_date).toLocaleDateString("en-US")}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted small">
                No one currently has this checked out.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EquipmentDetail;
