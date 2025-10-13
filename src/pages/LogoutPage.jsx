// src/pages/LogoutPage.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutPage({ setUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    // 🧹 Clear local session data
    localStorage.removeItem("user");

    // 🧠 Reset user state in React
    if (setUser) setUser(null);

    // 🛰️ Optionally: call backend logout endpoint if you have sessions
    // fetch("/api/logout", { method: "POST", credentials: "include" });

    // 🔁 Redirect to login/register
    navigate("/", { replace: true });
  }, [navigate, setUser]);

  return <p className="text-center mt-4 text-muted">Logging out…</p>;
}
