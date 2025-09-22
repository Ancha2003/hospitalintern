import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Appointments from "./pages/Appointments";
import PrescriptionForm from "./pages/PrescriptionForm";
import ViewPrescription from "./pages/ViewPrescription";
import EditPrescription from "./pages/EditPrescription";
import PatientRegister from "./pages/PatientRegistration";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import PatientDashboard from "./pages/PatientDashboard";
import PatientsList from "./pages/PatientList";
import PrescribePatient from "./pages/PrescribePatient";
import "./App.css";

function App() {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token"),
    role: localStorage.getItem("role")?.toLowerCase(),
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setAuth({
        token: localStorage.getItem("token"),
        role: localStorage.getItem("role")?.toLowerCase(),
      });
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const { token, role } = auth;

  const ProtectedRoute = ({ children, allowedRole }) => {
    if (!token) return <Navigate to="/login" replace />;
    if (allowedRole && role !== allowedRole) return <Navigate to="/" replace />;
    return children;
  };

  return (
    <BrowserRouter>
      {role === "doctor" && token && <Navbar />}

      <Routes>
        <Route
          path="/"
          element={
            !token ? <Home /> : role === "doctor" ? <Navigate to="/appointments" /> : <Navigate to="/patient-dashboard" />
          }
        />

        <Route
          path="/login"
          element={
            !token ? <Login /> : role === "doctor" ? <Navigate to="/appointments" /> : <Navigate to="/patient-dashboard" />
          }
        />

        <Route path="/appointments" element={<ProtectedRoute allowedRole="doctor"><Appointments /></ProtectedRoute>} />
        <Route path="/appointments/:id/prescription" element={<ProtectedRoute allowedRole="doctor"><PrescriptionForm /></ProtectedRoute>} />
        <Route path="/appointments/:id/view-prescription" element={<ProtectedRoute allowedRole="doctor"><ViewPrescription /></ProtectedRoute>} />
        <Route path="/appointments/:id/edit-prescription" element={<ProtectedRoute allowedRole="doctor"><EditPrescription /></ProtectedRoute>} />
        <Route path="/patients" element={<ProtectedRoute allowedRole="doctor"><PatientsList /></ProtectedRoute>} />
        <Route path="/patients/:id/prescribe" element={<ProtectedRoute allowedRole="doctor"><PrescribePatient /></ProtectedRoute>} />

        <Route path="/register" element={!token ? <PatientRegister /> : <Navigate to="/patient-dashboard" replace />} />

        <Route path="/patient-dashboard" element={<ProtectedRoute allowedRole="patient"><PatientDashboard /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;