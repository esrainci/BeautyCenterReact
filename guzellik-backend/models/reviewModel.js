// models/reviewModel.js
const pool = require('../config/db');

const createReviewsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      service VARCHAR(100) NOT NULL,
      comment TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(query);
    console.log("✅ 'reviews' tablosu oluşturuldu (veya zaten vardı).");
  } catch (err) {
    console.error('❌ reviews tablosu oluşturma hatası:', err);
  }
};

module.exports = { createReviewsTable };
