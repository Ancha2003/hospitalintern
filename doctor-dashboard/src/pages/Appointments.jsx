import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "../styles/Appointments.css";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchAppointments = async () => {
    try {
      const timestamp = new Date().getTime();
      const res = await api.get(`/appointments?_t=${timestamp}`);

      const apptsWithPrescription = await Promise.all(
        res.data.map(async (a) => {
          let prescription = null;
          try {
            const presRes = await api.get(`/prescriptions/appointment/${a._id}?_t=${timestamp}`);
            prescription = presRes.data || null;
          } catch (err) {
            if (!(err.response && err.response.status === 404)) console.error(err);
          }
          return { ...a, prescription };
        })
      );

      setAppointments(apptsWithPrescription);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const handleComplete = async (id) => {
    try {
      await api.patch(`/appointments/${id}/status`, { status: "completed" });
      fetchAppointments();
    } catch (err) { console.error(err); }
  };

  const handleCancel = async (id) => {
    try {
      await api.patch(`/appointments/${id}/status`, { status: "cancelled" });
      fetchAppointments();
    } catch (err) { console.error(err); alert("Failed to cancel appointment"); }
  };

  const filteredAppointments = filter === "all"
    ? appointments
    : appointments.filter((a) => a.status === filter);

  if (loading) return <p style={{ textAlign: "center" }}>Loading appointments...</p>;

  return (
    <>
      <header className="dashboard-header-section">
        <div className="dashboard-header-content">
          <img
            src="https://static.vecteezy.com/system/resources/previews/026/375/249/non_2x/ai-generative-portrait-of-confident-male-doctor-in-white-coat-and-stethoscope-standing-with-arms-crossed-and-looking-at-camera-photo.jpg"
            alt="Doctor"
            className="doctor-img"
          />
          <div className="doctor-intro">
            <h2>Welcome Dr. Smith!</h2>
            <p>Manage your appointments, prescriptions, and patient progress efficiently.</p>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="filter-bar">
          {["all", "pending", "completed", "confirmed", "cancelled"].map(status => (
            <button
              key={status}
              className={`filter-btn ${filter === status ? "active" : ""}`}
              onClick={() => setFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <div className="appointments-cards">
          {filteredAppointments.map(a => (
            <div className="appointment-card" key={a._id}>
              <div className="patient-info">
                <img
                  src={a.avatar || a.patient?.avatar || "https://img.freepik.com/free-photo/young-happy-man-standing-isolated_171337-1127.jpg"}
                  alt={a.patient?.name || "Patient"}
                  className="patient-img"
                />
                <div>
                  <h4>{a.patient?.name || "N/A"}</h4>
                  <p><strong>Email:</strong> {a.patient?.email || "N/A"}</p>
                  <p><strong>Phone:</strong> {a.patient?.phone || "N/A"}</p>
                  <p><strong>Age:</strong> {a.patient?.age || "N/A"}</p>
                  <p><strong>Gender:</strong> {a.patient?.gender || "N/A"}</p>
                  <p><strong>Problem:</strong> {a.problem || a.patient?.problem || "N/A"}</p>
                  <p><strong>Appointment:</strong> {a.datetime ? new Date(a.datetime).toLocaleString() : "N/A"}</p>
                </div>
              </div>

              <div className="status-badge-container">
                <span className={`status-badge ${a.status}`}>
                  {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                </span>
              </div>

              {a.prescription ? (
                <div className="prescription-info">
                  <p><strong>Symptoms:</strong> {a.prescription.symptoms || "N/A"}</p>
                  <p><strong>Diagnosis:</strong> {a.prescription.diagnosis || "N/A"}</p>
                  <p><strong>Notes:</strong> {a.prescription.notes || "N/A"}</p>
                  <p><strong>Medicines:</strong> {a.prescription.medicines?.map(m => m.name).join(", ") || "N/A"}</p>
                </div>
              ) : (
                <span className="status-badge pending">No Prescription</span>
              )}

              <div className="prescription-actions">
                {a.status === "completed" ? (
                  a.prescription ? (
                    <>
                      <Link className="pres-btn view" to={`/appointments/${a._id}/view-prescription`}>View</Link>
                      <Link className="pres-btn edit" to={`/appointments/${a._id}/edit-prescription`} state={{ patientId: a.patient?._id }}>Edit</Link>
                    </>
                  ) : (
                    <Link className="pres-btn add" to={`/appointments/${a._id}/add-prescription`} state={{ patientId: a.patient?._id }}>Add</Link>
                  )
                ) : (
                  <span className="status-badge pending">Pending</span>
                )}
              </div>

              {a.status !== "completed" && (
                <>
                  <button className="pres-btn add" onClick={() => handleComplete(a._id)}>✔️ Mark Completed</button>
                  {["pending", "confirmed"].includes(a.status) && (
                    <button className="pres-btn cancel" onClick={() => handleCancel(a._id)}>❌ Cancel Request</button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <footer className="dashboard-footer">
        <p>© 2025 HealthCare Management. All rights reserved.</p>
      </footer>
    </>
  );
}

export default Appointments;
