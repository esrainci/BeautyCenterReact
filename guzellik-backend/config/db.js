const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => console.log('🐘 PostgreSQL bağlantısı başarılı!'))
  .catch(err => console.error('❌ Bağlantı hatası:', err));

module.exports = pool;
