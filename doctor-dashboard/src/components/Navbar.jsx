import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("doctorId");
    navigate("/login");
  };

  // Extract appointmentId from URL if on prescription page
  const pathParts = location.pathname.split("/");
  const appointmentId = pathParts[2];
  const isPrescriptionPage =
    pathParts[3] === "prescription" || pathParts[3] === "view-prescription";

  const isActive = (path) => location.pathname === path;

  return (
    <nav>
      <h2>Clinix Sphere</h2>

      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        &#9776;
      </div>

      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <Link
          to="/appointments"
          className={`nav-btn ${isActive("/appointments") ? "active-link" : ""}`}
          onClick={() => setMenuOpen(false)}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/2921/2921222.png"
            alt="appointments"
            className="nav-icon"
          />
          Appointments
        </Link>

        {isPrescriptionPage && appointmentId && (
          <>
            <Link
              to={`/appointments/${appointmentId}/prescription`}
              className={`nav-btn secondary ${
                isActive(`/appointments/${appointmentId}/prescription`) ? "active-link" : ""
              }`}
              onClick={() => setMenuOpen(false)}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/992/992651.png"
                alt="add"
                className="nav-icon"
              />
              Add Prescription
            </Link>
            <Link
              to={`/appointments/${appointmentId}/view-prescription`}
              className={`nav-btn secondary ${
                isActive(`/appointments/${appointmentId}/view-prescription`) ? "active-link" : ""
              }`}
              onClick={() => setMenuOpen(false)}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/709/709612.png"
                alt="view"
                className="nav-icon"
              />
              View Prescription
            </Link>
          </>
        )}

        <button onClick={handleLogout} className="nav-btn logout">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1828/1828479.png"
            alt="logout"
            className="nav-icon"
          />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
