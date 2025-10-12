import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import EquipmentListPage from "./pages/EquipmentListPage";
import EquipmentDetailPage from "./pages/EquipmentDetailPage";
import ProfilePage from "./pages/ProfilePage";
import LogoutPage from "./pages/LogoutPage";

function App() {
  return (
    <Router>
      <Navbar />
      <main className="container mt-4">
        <Routes>
          {/* Default home page */}
          <Route path="/" element={<EquipmentListPage />} />

          {/* Equipment detail view */}
          <Route path="/equipment/:id" element={<EquipmentDetailPage />} />

          {/* User profile + logout */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/logout" element={<LogoutPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
