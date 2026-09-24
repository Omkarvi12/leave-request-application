import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/employee"
          element={<EmployeeDashboard />}
        />
        <Route
          path="/manager"
          element={<ManagerDashboard />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;