import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import MedicineInput from "../components/MedicineInput";
import "../styles/PrescriptionForm.css";

function PrescriptionForm() {
  const { id } = useParams(); // appointment ID
  const location = useLocation();
  const navigate = useNavigate();
  const patientId = location.state?.patientId;

  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [medicines, setMedicines] = useState([{ name: "", dosage: "", duration: "" }]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!patientId) {
      alert("❌ Patient ID is missing. Please access via the Appointments page.");
      navigate("/appointments");
      return;
    }

    const fetchPrescription = async () => {
      try {
        const res = await api.get(`/prescriptions/appointment/${id}`);
        if (res.data) {
          setSymptoms(res.data.symptoms || "");
          setDiagnosis(res.data.diagnosis || "");
          setMedicines(res.data.medicines.length ? res.data.medicines : [{ name: "", dosage: "", duration: "" }]);
          setNotes(res.data.notes || "");
          setEditing(true);
        }
      } catch (err) {
        if (!(err.response && err.response.status === 404)) console.error(err);
      }
    };

    fetchPrescription();
  }, [id, patientId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientId) return;

    setLoading(true);

    const filteredMeds = medicines
      .map((m) => ({ name: m.name.trim(), dosage: m.dosage.trim(), duration: m.duration.trim() }))
      .filter((m) => m.name);

    try {
      if (editing) {
        await api.put(`/prescriptions/appointment/${id}`, {
          symptoms,
          diagnosis,
          medicines: filteredMeds,
          notes
        });
        alert("✅ Prescription updated!");
      } else {
        await api.post("/prescriptions", {
          appointment: id,
          patient: patientId,
          symptoms,
          diagnosis,
          medicines: filteredMeds,
          notes
        });
        await api.patch(`/appointments/${id}/status`, { status: "completed" });
        alert("✅ Prescription saved!");
      }
      navigate("/appointments");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "❌ Error saving prescription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-card">
        <h2>{editing ? "Edit Prescription" : "Add Prescription"}</h2>

        <form onSubmit={handleSubmit}>
          <label>Symptoms</label>
          <textarea value={symptoms} onChange={(e) => setSymptoms(e.target.value)} required />

          <label>Diagnosis</label>
          <textarea value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} required />

          <MedicineInput medicines={medicines} setMedicines={setMedicines} />

          <label>Additional Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />

          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : editing ? "Update Prescription" : "Save Prescription"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PrescriptionForm;
