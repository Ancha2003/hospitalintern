import React from "react";

function MedicineInput({ medicines, setMedicines }) {
  const handleMedicineChange = (index, field, value) => {
    const newMeds = [...medicines];
    newMeds[index][field] = value;
    setMedicines(newMeds);
  };

  const addMedicine = () => {
    setMedicines([...medicines, { name: "", dosage: "", duration: "" }]);
  };

  const removeMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label>Medicines:</label>
      {medicines.map((med, index) => (
        <div className="medicine-group" key={index}>
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
          />
          <input
            placeholder="Duration"
            value={med.duration}
            onChange={(e) => handleMedicineChange(index, "duration", e.target.value)}
          />
          {medicines.length > 1 && (
            <button type="button" onClick={() => removeMedicine(index)}>❌ Remove</button>
          )}
        </div>
      ))}
      <button type="button" onClick={addMedicine}>+ Add Medicine</button>
    </div>
  );
}

export default MedicineInput;
