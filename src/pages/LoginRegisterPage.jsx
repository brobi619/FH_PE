// src/pages/LoginRegisterPage.jsx
import { useState } from "react";
import RegisterForm from "../components/RegisterForm";
import LoginForm from "../components/LoginForm";
import "./LoginRegisterPage.css";

export default function LoginRegisterPage({ setUser }) {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="login-register-page container mt-5">
      <div className="auth-card mx-auto shadow-lg p-4 rounded" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-4">
          {showLogin ? "Welcome Back" : "Create Your Account"}
        </h2>

        {/* Toggle buttons */}
        <div className="text-center mb-4">
          <button
            className={`btn ${showLogin ? "btn-primary" : "btn-outline-primary"} me-2`}
            onClick={() => setShowLogin(true)}
          >
            Login
          </button>
          <button
            className={`btn ${!showLogin ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setShowLogin(false)}
          >
            Register
          </button>
        </div>

        {/* Render the selected form */}
        {showLogin ? (
          <LoginForm setUser={setUser} />
        ) : (
          <RegisterForm />
        )}
      </div>
    </div>
  );
}
