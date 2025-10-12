import "./ActionButtons.css";

function ActionButtons({ item, isAdmin }) {
  return (
    <div className="action-buttons">
      <button className="btn action-btn checkout" title="Check Out">
        <i className="fas fa-shopping-cart"></i>
      </button>

      <button className="btn action-btn issue" title="Report Issue">
        <i className="fas fa-exclamation-triangle"></i>
      </button>

      {isAdmin && (
        <>
          <button className="btn action-btn edit" title="Edit">
            <i className="fas fa-pen"></i>
          </button>

          <button className="btn action-btn delete" title="Delete">
            <i className="fas fa-trash"></i>
          </button>
        </>
      )}
    </div>
  );
}

export default ActionButtons;
