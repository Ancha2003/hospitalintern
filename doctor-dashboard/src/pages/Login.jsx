import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "doctor") navigate("/appointments");
    else if (role === "patient") navigate("/patient-dashboard");
    else setLoading(false);
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      if (res.data.user.role === "doctor") navigate("/appointments");
      else if (res.data.user.role === "patient") navigate("/patient-dashboard");
      else setMessage("❌ Unknown user role");

      setMessage("✅ Login successful! Redirecting...");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "❌ Login failed");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Login</h2>
        <p>Enter your email and password to access your dashboard</p>
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
        <p>
          Not registered? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
