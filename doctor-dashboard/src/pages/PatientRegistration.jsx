import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/PatientRegistration.css";

function PatientRegistration() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", age: "", gender: "Male", password: "" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => setAvatarFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => formData.append(key, val || ""));
      if (avatarFile) formData.append("avatar", avatarFile);

      const res = await api.post("/patients", formData, { headers: { "Content-Type": "multipart/form-data" } });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "patient");
      localStorage.setItem("patient", JSON.stringify(res.data.user));

      navigate("/patient-dashboard");
    } catch (err) {
      console.error(err);
      const backendError = err.response?.data?.errors?.[0]?.msg || err.response?.data?.error;
      setMessage(backendError || "❌ Error registering patient");
    }
  };

  return (
    <div className="patient-register-container">
      <div className="form-card">
        <h2>🩺 Patient Registration</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <input placeholder="Name" name="name" value={form.name} onChange={handleChange} required />
          <input placeholder="Email" type="email" name="email" value={form.email} onChange={handleChange} required />
          <input placeholder="Phone" name="phone" value={form.phone} onChange={handleChange} />
          <input placeholder="Age" type="number" name="age" value={form.age} onChange={handleChange} />
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input placeholder="Password" type="password" name="password" value={form.password} onChange={handleChange} required />
          <label className="file-label">
            Upload Profile Image (optional)
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </label>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default PatientRegistration;
