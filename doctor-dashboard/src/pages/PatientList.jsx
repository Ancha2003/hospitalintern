import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function PatientsList() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get("/patients");
        setPatients(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPatients();
  }, []);

  return (
    <div className="container">
      <h2>All Patients</h2>
      <div className="patients-grid">
        {patients.map((p) => (
          <div key={p._id} className="patient-card">
            <img
              src={
                p.avatar ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt={p.name}
              className="patient-avatar"
            />
            <h3>{p.name}</h3>
            <p><strong>Problem:</strong> {p.problem || "Not specified"}</p>
            <Link to={`/patients/${p._id}/prescribe`}>
              <button>Give Prescription</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PatientsList;
