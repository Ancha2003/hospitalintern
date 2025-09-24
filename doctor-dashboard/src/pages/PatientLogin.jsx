import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/PatientLogin.css";

function PatientLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "patient") navigate("/patient-dashboard");
    else if (role === "doctor") navigate("/appointments");
    else setLoading(false);
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });

      if (res.data.user.role !== "patient") {
        setMessage("❌ This is not a patient account");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "patient");
      localStorage.setItem("patient", JSON.stringify(res.data.user));

      navigate("/patient-dashboard", { replace: true });
      setMessage("✅ Login successful! Redirecting...");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "❌ Invalid credentials");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Patient Login</h2>
        {message && <p className="login-error">{message}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default PatientLogin;
