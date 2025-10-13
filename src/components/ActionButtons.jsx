import "./ActionButtons.css";

function ActionButtons({ item, isAdmin }) {
  return (
    <div className={`action-buttons ${isAdmin ? "admin" : "user"}`}>
      <button className="action-btn checkout" title="Check Out">
        <i className="fas fa-shopping-cart" />
      </button>

      <button className="action-btn issue" title="Report Issue">
        <i className="fas fa-exclamation-triangle" />
      </button>

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
