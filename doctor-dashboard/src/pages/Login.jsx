import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      setMessage("✅ Login successful! Redirecting...");

      setTimeout(() => {
        if (res.data.user.role === "doctor") navigate("/appointments");
        else if (res.data.user.role === "patient") navigate("/patient-dashboard");
      }, 1500);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "❌ Login failed");
    }
  };

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