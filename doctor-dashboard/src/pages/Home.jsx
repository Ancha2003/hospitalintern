import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <header className="home-header">
        <h1>Welcome to Clinix Sphere</h1>
        <p>
          Your reliable healthcare management system.  
          Choose your role to get started.
        </p>
      </header>

      {/* Role Cards */}
      <div className="cards-container">
        {/* Doctor Card */}
        <div className="role-card">
          <img
            src="https://static.vecteezy.com/system/resources/previews/026/375/249/non_2x/ai-generative-portrait-of-confident-male-doctor-in-white-coat-and-stethoscope-standing-with-arms-crossed-and-looking-at-camera-photo.jpg"
            alt="Doctor"
            className="role-img"
          />
          <h3>Doctor</h3>
          <p>
            Access your dashboard, manage appointments,  
            and prescribe medicines efficiently.
          </p>
          <Link to="/login">
            <button className="role-btn doctor-btn">Login as Doctor</button>
          </Link>
        </div>

        {/* Patient Card */}
        <div className="role-card">
          <img
            src="https://img.freepik.com/free-photo/young-happy-man-standing-isolated_171337-1127.jpg?semt=ais_incoming&w=740&q=80"
            alt="Patient"
            className="role-img"
          />
          <h3>Patient</h3>
          <p>
            Register or log in as a patient to book appointments  
            and receive prescriptions from your doctor.
          </p>
          <div className="patient-actions">
            <Link to="/register">
              <button className="role-btn register-btn">Register as Patient</button>
            </Link>
            <Link to="/login">
              <button className="role-btn patient-btn">Login as Patient</button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="home-footer">
        <p>© {new Date().getFullYear()} Clinix Sphere. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
