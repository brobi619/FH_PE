import { Navigate } from "react-router-dom";

function ProtectedRoute({ user, children }) {
  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render the child page
  return children;
}

export default ProtectedRoute;
