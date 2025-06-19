// models/favoriteModel.js
const pool = require('../config/db');

async function createFavoriteTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS favorites (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      service VARCHAR(100) NOT NULL
    );
  `);
}

module.exports = { createFavoriteTable };
