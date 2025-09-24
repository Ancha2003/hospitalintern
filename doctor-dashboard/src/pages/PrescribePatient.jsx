import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function PrescribePatient({ appointmentId, patientId }) {
  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [medicines, setMedicines] = useState([{ name: "", dosage: "", duration: "" }]);
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  const handleMedicineChange = (index, field, value) => {
    const newMedicines = [...medicines];
    newMedicines[index][field] = value;
    setMedicines(newMedicines);
  };

  const addMedicine = () => setMedicines([...medicines, { name: "", dosage: "", duration: "" }]);
  const removeMedicine = (index) => setMedicines(medicines.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/prescriptions", {
        appointment: appointmentId,
        patient: patientId,
        symptoms,
        diagnosis,
        medicines,
        notes,
      });
      setMessage("✅ Prescription saved successfully!");
      setSymptoms("");
      setDiagnosis("");
      setMedicines([{ name: "", dosage: "", duration: "" }]);
      setNotes("");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "❌ Failed to save prescription");
    }
  };

  return (
    <div className="container">
      <h2>Write Prescription</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Symptoms"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          rows="3"
          required
        />
        <textarea
          placeholder="Diagnosis"
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
          rows="3"
          required
        />
        <h4>Medicines</h4>
        {medicines.map((med, index) => (
          <div key={index}>
            <input
              placeholder="Name"
              value={med.name}
              onChange={(e) => handleMedicineChange(index, "name", e.target.value)}
              required
            />
            <input
              placeholder="Dosage"
              value={med.dosage}
              onChange={(e) => handleMedicineChange(index, "dosage", e.target.value)}
              required
            />
            <input
              placeholder="Duration"
              value={med.duration}
              onChange={(e) => handleMedicineChange(index, "duration", e.target.value)}
              required
            />
            <button type="button" onClick={() => removeMedicine(index)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={addMedicine}>Add Medicine</button>

        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows="3"
        />

        <button type="submit">Save Prescription</button>
      </form>
    </div>
  );
}

export default PrescribePatient;
