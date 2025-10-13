// src/pages/LogoutPage.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any local session state later (tokens, user, etc.)
    // localStorage.removeItem("auth");
    // Optionally hit /api/logout when backend session exists.
    navigate("/", { replace: true });
  }, [navigate]);

  return <p className="text-center mt-4 text-muted">Logging out…</p>;
}
