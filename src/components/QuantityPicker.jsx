import "./QuantityPicker.css";

// Controlled QuantityPicker: parent supplies `value` and `onChange`.
function QuantityPicker({ max, equipmentId, value = 0, onChange = () => {} }) {
  const qty = Number(value || 0);

  const increase = () => onChange(Math.min(qty + 1, max));
  const decrease = () => onChange(Math.max(qty - 1, 0));

  const handleChange = (e) => {
    const raw = e.target.value.trim();
    if (!/^\d*$/.test(raw)) return;
    const numericValue = Number(raw);
    if (numericValue < 0) onChange(0);
    else if (numericValue > max) onChange(max);
    else onChange(numericValue);
  };

  const handleBlur = () => {
    if (!qty || qty < 0) onChange(0);
  };

  return (
    <div className="qty-picker" data-equipment-id={equipmentId}>
      <button onClick={decrease} disabled={qty <= 0}>
        <i className="fa-solid fa-minus"></i>
      </button>

      <input
        type="text"
        value={qty}
        onChange={handleChange}
        onBlur={handleBlur}
        className="qty-input"
      />

      <button onClick={increase} disabled={qty >= max}>
        <i className="fa-solid fa-plus"></i>
      </button>
    </div>
  );
}

export default QuantityPicker;
