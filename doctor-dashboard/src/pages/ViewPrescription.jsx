import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/ViewPrescription.css";

function ViewPrescription() {
  const { id } = useParams(); // appointment ID
  const navigate = useNavigate();
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const res = await api.get(`/prescriptions/appointment/${id}`);
        setPrescription(res.data);
      } catch (err) {
        console.error(err);
        setPrescription(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescription();
  }, [id]);

  if (loading) return <p>Loading prescription...</p>;
  if (!prescription) return <p>No prescription found.</p>;

  return (
    <div className="container">
      <div className="form-card">
        <h2>Prescription Details</h2>

        <p><strong>Doctor:</strong> {prescription.doctor?.name || "N/A"}</p>
        <p><strong>Patient:</strong> {prescription.patient?.name || "N/A"}</p>
        <p><strong>Symptoms:</strong> {prescription.symptoms || "N/A"}</p>
        <p><strong>Diagnosis:</strong> {prescription.diagnosis || "N/A"}</p>

        <h4>Medicines</h4>
        <ul>
          {prescription.medicines.length > 0 ? (
            prescription.medicines.map((m, idx) => (
              <li key={idx}>{m.name} — {m.dosage}, {m.duration}</li>
            ))
          ) : (
            <li>No medicines listed</li>
          )}
        </ul>

        <p><strong>Notes:</strong> {prescription.notes || "N/A"}</p>

        <button className="back-btn" onClick={() => navigate("/appointments")}>Back</button>
      </div>
    </div>
  );
}

export default ViewPrescription;
