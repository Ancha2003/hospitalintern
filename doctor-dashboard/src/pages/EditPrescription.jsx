import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/PrescriptionForm.css";
import MedicineInput from "../components/MedicineInput";

function EditPrescription() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [prescription, setPrescription] = useState({
    symptoms: "",
    diagnosis: "",
    medicines: [{ name: "", dosage: "", duration: "" }],
    notes: "",
  });
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const res = await api.get(`/prescriptions/appointment/${id}`);
        const presData = res.data;

        setPrescription({
          symptoms: presData.symptoms || "",
          diagnosis: presData.diagnosis || "",
          medicines: presData.medicines.length
            ? presData.medicines
            : [{ name: "", dosage: "", duration: "" }],
          notes: presData.notes || "",
        });

        setPatient(presData.patient || null);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setMessage({
          text: err.response?.data?.error || "Failed to load prescription",
          type: "error",
        });
        setLoading(false);
      }
    };

    fetchPrescription();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPrescription({ ...prescription, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const filteredMeds = prescription.medicines
      .map((m) => ({
        name: m.name.trim(),
        dosage: m.dosage.trim(),
        duration: m.duration.trim(),
      }))
      .filter((m) => m.name);

    try {
      await api.put(`/prescriptions/appointment/${id}`, { ...prescription, medicines: filteredMeds });
      setMessage({ text: "Prescription updated successfully!", type: "success" });
      setTimeout(() => navigate("/appointments"), 1500);
    } catch (err) {
      console.error(err);
      setMessage({ text: err.response?.data?.error || "Failed to update prescription", type: "error" });
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div className="container">
      <h2>Edit Prescription</h2>
      {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

      {patient && (
        <div className="patient-info-card">
          <img
            src={patient.avatar || "https://img.freepik.com/free-photo/young-happy-man-standing-isolated_171337-1127.jpg"}
            alt={patient.name}
            className="patient-avatar"
          />
          <h3>{patient.name}</h3>
          <p><strong>Email:</strong> {patient.email}</p>
          <p><strong>Phone:</strong> {patient.phone || "N/A"}</p>
          <p><strong>Age:</strong> {patient.age || "N/A"}</p>
          <p><strong>Gender:</strong> {patient.gender || "N/A"}</p>
          <p><strong>Problem:</strong> {patient.problem || "Not provided yet"}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label>Symptoms:</label>
        <textarea name="symptoms" value={prescription.symptoms} onChange={handleChange} />

        <label>Diagnosis:</label>
        <textarea name="diagnosis" value={prescription.diagnosis} onChange={handleChange} />

        <MedicineInput medicines={prescription.medicines} setMedicines={(meds) => setPrescription({ ...prescription, medicines: meds })} />

        <label>Notes:</label>
        <textarea name="notes" value={prescription.notes} onChange={handleChange} />

        <button type="submit" className="btn-update">Update Prescription</button>
      </form>
    </div>
  );
}

export default EditPrescription;
