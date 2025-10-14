import { useState } from "react";
import "./QuantityPicker.css";

function QuantityPicker({ max, equipmentId }) {
  const [qty, setQty] = useState(0);

  const increase = () => setQty((q) => Math.min(q + 1, max));
  const decrease = () => setQty((q) => Math.max(q - 1, 0));

  const handleChange = (e) => {
    const value = e.target.value.trim();

    // Allow only numbers
    if (!/^\d*$/.test(value)) return;

    const numericValue = Number(value);

    // Enforce range limits
    if (numericValue < 0) setQty(0);
    else if (numericValue > max) setQty(max);
    else setQty(numericValue);
  };

  const handleBlur = () => {
    if (!qty || qty < 0) setQty(0);
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
