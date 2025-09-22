Clinix Sphere — Backend

1) Setup
- copy .env.example to .env and update MONGO_URI and JWT_SECRET
- npm install
- npm run seed      # seeds 3 doctors
- npm run dev       # start server on PORT

2) API endpoints (examples)
- POST /api/auth/register
- POST /api/auth/login
- GET  /api/doctors
- POST /api/appointments
- GET  /api/appointments
- GET  /api/appointments/:id
- PATCH /api/appointments/:id/status
- POST /api/prescriptions
- GET  /api/prescriptions/appointment/:id

3) Notes
- JWT required for protected routes. Send header: Authorization: Bearer <token>


backend/
├─ models/
│  ├─ User.js
│  ├─ Appointment.js
│  ├─ Prescription.js
├─ routes/
│  ├─ auth.js
│  ├─ patients.js
│  ├─ appointments.js
│  ├─ prescriptions.js
├─ middlewares/
│  ├─ auth.js
├─ uploads/
│  └─ prescriptions/
├─ server.js
