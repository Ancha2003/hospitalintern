import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/PatientDashboard.css";

function PatientDashboard() {
  const [patient, setPatient] = useState(null);
  const [problem, setProblem] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [reportFile, setReportFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login", { replace: true });

    const fetchData = async () => {
      try {
        const res = await api.get("/patients/me");
        setPatient(res.data);
        setProblem(res.data.problem || "");

        const docRes = await api.get("/doctors");
        setDoctors(docRes.data);

        const apptRes = await api.get("/appointments");
        const patientAppointments = apptRes.data.filter(a => a.patient._id === res.data._id);

        const apptsWithPrescription = await Promise.all(
          patientAppointments.map(async (a) => {
            try {
              const presRes = await api.get(`/prescriptions/appointment/${a._id}`);
              return { ...a, prescription: presRes.data };
            } catch {
              return { ...a, prescription: null };
            }
          })
        );

        setAppointments(apptsWithPrescription);
      } catch {
        navigate("/login", { replace: true });
      }
    };

    fetchData();
  }, [navigate]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return alert("Select an image to upload");

    const formData = new FormData();
    formData.append("avatar", avatarFile);

    try {
      const res = await api.put(`/patients/${patient._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setPatient(res.data);
      setAvatarFile(null);
      setAvatarPreview(null);
      alert("Avatar uploaded successfully!");
    } catch {
      alert("Failed to upload avatar");
    }
  };

  const handleSubmitProblem = async () => {
    try {
      const res = await api.put(`/patients/${patient._id}`, { problem });
      setPatient(res.data);
      alert("Problem updated successfully!");
    } catch {
      alert("Failed to update problem");
    }
  };

  const handleSendToDoctor = async () => {
    if (!selectedDoctor) return alert("Please select a doctor");
    if (!problem.trim()) return alert("Please enter your problem");

    try {
      let avatarUrl = patient.avatar;

      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);
        const resAvatar = await api.put(`/patients/${patient._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        avatarUrl = resAvatar.data.avatar;
        setPatient(resAvatar.data);
        setAvatarFile(null);
        setAvatarPreview(null);
      }

      const res = await api.post("/patients/send", {
        doctorId: selectedDoctor,
        problem,
        avatar: avatarUrl,
      });

      const presRes = await api
        .get(`/prescriptions/appointment/${res.data.appointment._id}`)
        .catch(() => null);

      setAppointments(prev => [...prev, { ...res.data.appointment, prescription: presRes?.data || null }]);
      alert(res.data.message);
      setSelectedDoctor("");
    } catch {
      alert("Failed to send details");
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await api.patch(`/appointments/${id}/status`, { status });
      setAppointments(prev => prev.map(a => (a._id === id ? res.data : a)));
    } catch {
      alert("Failed to update status");
    }
  };

  const handleReportUpload = async (appointmentId) => {
    if (!reportFile) return alert("Select a file to upload");

    const formData = new FormData();
    formData.append("report", reportFile);

    try {
      const res = await api.post(`/appointments/${appointmentId}/upload-report`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAppointments(prev =>
        prev.map(a => (a._id === appointmentId ? { ...a, report: res.data.report } : a))
      );
      alert("Report uploaded successfully!");
      setReportFile(null);
    } catch {
      alert("Failed to upload report");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  if (!patient) return <p>Loading...</p>;

  return (
    <div className="patient-dashboard container">
      <div className="dashboard-header">
        <h2>👋 Welcome, {patient.name}!</h2>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {/* Patient Info Card */}
      <div className="patient-info-card">
        <div className="patient-info-left">
          <div className="avatar-wrapper">
            <img
              src={avatarPreview || patient.avatar || "https://img.freepik.com/free-photo/young-happy-man-standing-isolated_171337-1127.jpg"}
              alt={patient.name}
              className="patient-avatar"
            />
            <input
              type="file"
              accept="image/*"
              id="avatarUpload"
              className="avatar-input"
              onChange={handleAvatarChange}
            />
            <label htmlFor="avatarUpload" className="camera-icon" title="Upload Avatar">📷</label>
          </div>
          {avatarFile && <button className="upload-btn" onClick={handleAvatarUpload}>Upload Avatar</button>}
        </div>

        <div className="patient-info-right">
          <h3>{patient.name}</h3>
          <p><strong>Email:</strong> {patient.email}</p>
          <p>
            <strong>Problem:</strong>
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Enter your problem here"
              rows={3}
            />
            <button className="submit-problem-btn" onClick={handleSubmitProblem}>💾 Submit Problem</button>
          </p>
        </div>
      </div>

      {/* Send Details to Doctor */}
      <div className="send-doctor-card">
        <h3>Send Your Details to Doctor</h3>
        <select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)}>
          <option value="">Select a doctor</option>
          {doctors.map((doc) => (
            <option key={doc._id} value={doc._id}>
              {doc.name} ({doc.email})
            </option>
          ))}
        </select>
        <button onClick={handleSendToDoctor}>📤 Send to Doctor</button>
      </div>

      {/* Appointments */}
      <div className="appointments-card">
        <h3>Your Appointments</h3>
        {appointments.length === 0 ? (
          <p>No appointments yet.</p>
        ) : (
          appointments.map((a) => (
            <div key={a._id} className="appointment-item">
              <div className="appointment-left">
                {a.report && (
                  <a href={a.report} target="_blank" rel="noreferrer">View Report</a>
                )}
              </div>
              <div className="appointment-right">
                <p><strong>Doctor:</strong> {a.doctor.name || a.doctor}</p>
                <p><strong>Status:</strong> {a.status}</p>
                <p><strong>Reason / Problem:</strong> {a.problem || a.reason}</p>
                <p><strong>Date:</strong> {new Date(a.datetime).toLocaleString()}</p>

                {/* Prescription */}
                {a.prescription ? (
                  <div className="prescription-info">
                    <p><strong>Symptoms:</strong> {a.prescription.symptoms || "N/A"}</p>
                    <p><strong>Diagnosis:</strong> {a.prescription.diagnosis || "N/A"}</p>
                    <p><strong>Notes:</strong> {a.prescription.notes || "N/A"}</p>
                    <p><strong>Medicines:</strong> {a.prescription.medicines?.map(m => `${m.name} (${m.dosage}, ${m.duration})`).join(", ") || "N/A"}</p>
                  </div>
                ) : (
                  <span>No prescription yet</span>
                )}

                {/* Upload report */}
                <input type="file" accept="image/*,application/pdf" onChange={(e) => setReportFile(e.target.files[0])} />
                <button onClick={() => handleReportUpload(a._id)}>Upload Report</button>

                {["pending", "confirmed"].includes(a.status) && (
                  <button onClick={() => handleUpdateStatus(a._id, "cancelled")}>❌ Cancel Request</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PatientDashboard;
