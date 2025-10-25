// src/components/ConditionReports.jsx
import { useEffect, useState } from "react";

function ConditionReports({ equipmentId }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Fetch reports from backend
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const API_URL = import.meta.env.DEV
          ? `http://localhost:3001/api/condition-reports/${equipmentId}`
          : `/api/condition-reports/${equipmentId}`;

        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch condition reports");
        const data = await res.json();
        setReports(data);
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError("Unable to load condition reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [equipmentId]);

  // ✅ Handle "Mark as Resolved"
  const handleResolve = async (reportId) => {
    if (!window.confirm("Mark this report as resolved?")) return;

    try {
      const API_URL = import.meta.env.DEV
        ? `http://localhost:3001/api/condition-reports/${reportId}/resolve`
        : `/api/condition-reports/${reportId}/resolve`;

      const res = await fetch(API_URL, { method: "PATCH" });
      const data = await res.json();

      if (res.ok) {
        alert("✅ Report marked as resolved.");
        // Update state locally
        // ✅ Remove resolved report from local list
        setReports((prev) => prev.filter((r) => r.id !== reportId));

      } else {
        alert(`⚠️ ${data.message || "Failed to resolve report."}`);
      }
    } catch (err) {
      console.error("Error resolving report:", err);
      alert("Server error resolving report.");
    }
  };

  // ✅ Get color and label based on condition
  const getConditionBadge = (condition) => {
    const map = {
      "Usable": { color: "bg-success", label: "Usable" },
      "Needs Repair": { color: "bg-warning text-dark", label: "Needs Repair" },
      "Broken / Unusable": { color: "bg-danger", label: "Broken / Unusable" },
    };
    return map[condition] || { color: "bg-secondary", label: condition };
  };

  if (loading)
    return (
      <div className="text-center mt-4">
        <div className="spinner-border text-secondary" role="status"></div>
        <p className="text-muted mt-2">Loading condition reports...</p>
      </div>
    );

  if (error)
    return <p className="text-center text-danger mt-3">{error}</p>;

  return (
    <div className="mt-5">
      <h4 className="fw-bold mb-3">Condition Reports</h4>

      {reports.length === 0 ? (
        <p className="text-secondary">No active condition reports.</p>
      ) : (
        <div className="list-group">
          {reports.map((r) => {
            const badge = getConditionBadge(r.condition);

            return (
              <div
                key={r.id}
                className={`list-group-item list-group-item-action ${
                  r.resolved ? "bg-light" : ""
                }`}
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    {/* Condition Badge */}
                    <span
                      className={`badge ${badge.color} mb-2`}
                      style={{ fontSize: "0.85rem" }}
                    >
                      {badge.label}
                    </span>

                    <p className="mb-1 small text-muted">
                      Reported on:{" "}
                      {new Date(r.report_date).toLocaleDateString()}
                    </p>
                    <p className="mb-2">{r.description}</p>
                    <p className="mb-0 small">
                      Reported by:{" "}
                      <strong>
                        {r.first_name} {r.last_name}
                      </strong>{" "}
                      (<a href={`mailto:${r.email}`}>{r.email}</a>)
                    </p>
                  </div>

                  {/* Admin-only "Resolve" button */}
                  {user?.role_id === 1 && !r.resolved && (
                    <button
                      className="btn btn-sm btn-outline-success ms-3"
                      onClick={() => handleResolve(r.id)}
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>

                {r.resolved && (
                  <div className="mt-2">
                    <span className="badge bg-success">Resolved</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ConditionReports;
