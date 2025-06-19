// models/appointmentModel.js
const pool = require('../config/db');

const createAppointmentTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS appointments (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      employee VARCHAR(100) NOT NULL,
      service VARCHAR(100) NOT NULL,
      date TIMESTAMP NOT NULL,
      time VARCHAR(10) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
  console.log("✅ 'appointments' tablosu oluşturuldu (veya zaten vardı).");
};

module.exports = { createAppointmentTable };
