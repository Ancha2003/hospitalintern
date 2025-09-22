import { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

function PrescribePatient() {
  const { id } = useParams();
  const [prescription, setPrescription] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/patients/${id}/prescriptions`, { prescription });
      setMessage("✅ Prescription saved successfully!");
      setPrescription("");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to save prescription");
    }
  };

  return (
    <div className="container">
      <h2>Write Prescription</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Write prescription here..."
          value={prescription}
          onChange={(e) => setPrescription(e.target.value)}
          rows="5"
        />
        <button type="submit">Save Prescription</button>
      </form>
    </div>
  );
}

export default PrescribePatient;
