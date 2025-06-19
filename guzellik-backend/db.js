const { Pool } = require('pg');

// PostgreSQL bağlantısı için Pool oluşturuyoruz
const pool = new Pool({
  user: 'postgres',          // kendi PostgreSQL kullanıcı adını yaz
  host: 'localhost',          // genellikle localhost
  database: 'guzellik_merkezi',       // kendi veritabanı adını yaz
  password: '4141',           // kendi PostgreSQL şifreni yaz
  port: 5432,                 // PostgreSQL varsayılan portu
});

module.exports = pool;
