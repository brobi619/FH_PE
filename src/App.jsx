import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginRegisterPage from "./pages/LoginRegisterPage";
import EquipmentListPage from "./pages/EquipmentListPage";
import EquipmentDetailPage from "./pages/EquipmentDetailPage";
import ProfilePage from "./pages/ProfilePage";
import LogoutPage from "./pages/LogoutPage";

function App() {
  const [user, setUser] = useState(null);

  // Load from localStorage on refresh
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
            <Route path="/" element={<LoginRegisterPage setUser={setUser} />} />
            <Route path="/equipment" element={<EquipmentListPage user={user} />} />
            <Route path="/equipment/:id" element={<EquipmentDetailPage user={user} />} />
            <Route path="/profile" element={<ProfilePage user={user} />} />
            <Route path="/logout" element={<LogoutPage setUser={setUser} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
