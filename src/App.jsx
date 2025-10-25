import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginRegisterPage from "./pages/LoginRegisterPage";
import EquipmentListPage from "./pages/EquipmentListPage";
import EquipmentDetailPage from "./pages/EquipmentDetailPage";
import ProfilePage from "./pages/ProfilePage";
import LogoutPage from "./pages/LogoutPage";
import MyEquipmentPage from "./pages/MyEquipmentPage";
import ApproveUsersPage from "./pages/ApproveUsersPage";
import ManageUsers from "./pages/ManageUsers";
import AddEquipmentPage from "./pages/AddEquipmentPage";
import EquipmentEditPage from "./pages/EquipmentEditPage";
import ReportIssuePage from "./pages/ReportIssuePage.jsx";

// ✅ Protected route component
function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
}

// ✅ Admin-only route component
function AdminRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/" replace />;
  }
  if (user.role_id !== 1) {
    return (
      <div className="text-center mt-5 text-danger">
        <h4>Access Denied</h4>
        <p>Administrator privileges required.</p>
      </div>
    );
  }
  return children;
}

function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar user={user} />
        <main className="container mt-4">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LoginRegisterPage setUser={setUser} />} />
            <Route path="/logout" element={<LogoutPage setUser={setUser} />} />

            {/* Protected Routes */}
            <Route
              path="/equipment"
              element={
                <ProtectedRoute user={user}>
                  <EquipmentListPage user={user} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/equipment/:id"
              element={
                <ProtectedRoute user={user}>
                  <EquipmentDetailPage user={user} />
                </ProtectedRoute>
              }
            />

            {/* ✅ New route: Any logged-in user can report an issue */}
            <Route
              path="/equipment/:id/report"
              element={
                <ProtectedRoute user={user}>
                  <ReportIssuePage user={user} />
                </ProtectedRoute>
              }
            />

            {/* Admin-only edit route */}
            <Route
              path="/equipment/:id/edit"
              element={
                <AdminRoute user={user}>
                  <EquipmentEditPage user={user} />
                </AdminRoute>
              }
            />

            <Route
              path="/my-equipment"
              element={
                <ProtectedRoute user={user}>
                  <MyEquipmentPage user={user} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute user={user}>
                  <ProfilePage user={user} />
                </ProtectedRoute>
              }
            />

            {/* Admin-Only Routes */}
            <Route
              path="/approve-users"
              element={
                <AdminRoute user={user}>
                  <ApproveUsersPage user={user} />
                </AdminRoute>
              }
            />
            <Route
              path="/manage-users"
              element={
                <AdminRoute user={user}>
                  <ManageUsers user={user} />
                </AdminRoute>
              }
            />
            <Route
              path="/add-equipment"
              element={
                <AdminRoute user={user}>
                  <AddEquipmentPage user={user} />
                </AdminRoute>
              }
            />

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
