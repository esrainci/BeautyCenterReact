require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./config/db');
const { verifyToken } = require('./middleware/authMiddleware');
const authRoutes = require('./routes/authRoutes');
const { createReviewsTable } = require('./models/reviewModel');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
createReviewsTable();
// Kullanıcı kayıt endpoint'i
app.post('/api/auth/register', async (req, res) => {
  const { name, phone, email, password } = req.body;

  if (!name || !phone || !email || !password) {
    return res.status(400).json({ message: 'Tüm alanlar zorunludur.' });
  }

  try {
    // Email kontrolü
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'Bu email zaten kayıtlı.' });
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Kullanıcı kaydet
    await pool.query(
      'INSERT INTO users (name, phone, email, password) VALUES ($1, $2, $3, $4)',
      [name, phone, email, hashedPassword]
    );

    res.status(201).json({ message: 'Kayıt başarılı, giriş yapabilirsiniz.' });
  } catch (error) {
    console.error('Kayıt Hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
});

// Kullanıcı giriş endpoint'i
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email ve şifre zorunludur.' });
  }

  try {
    // Email ile kullanıcı var mı kontrolü
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    // Şifre kontrolü
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Şifre yanlış.' });
    }

    // JWT Token oluştur
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
      },
      'gizliKeyBalim123',
      { expiresIn: '7d' }
    );

    res.status(200).json({ message: 'Giriş başarılı.', token });
  } catch (error) {
    console.error('Giriş Hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
});

app.post('/api/appointments', verifyToken, async (req, res) => {
  const { employee, service, date, time } = req.body;
  const { id: user_id } = req.user;

  if (!employee || !service || !date || !time) {
    return res.status(400).json({ message: 'Çalışan, hizmet, tarih ve saat zorunlu.' });
  }

  try {
    await pool.query(
    `INSERT INTO appointments (user_id, employee, service, date, time)
     VALUES ($1,$2,$3,$4,$5)`,
    [user_id, employee, service, date, time]
  );
    res.status(201).json({ message: 'Randevu başarıyla oluşturuldu!' });
  } catch (err) {
    console.error('Randevu Hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
});

 app.get('/api/reviews', verifyToken, async (req, res) => {
   try {
     const result = await pool.query(
      `SELECT id, service, comment, created_at
       FROM reviews
       WHERE user_id=$1
       ORDER BY created_at DESC`,
       [req.user.id]
     );
     res.json(result.rows);
   } catch (err) {
     console.error(err);
     res.status(500).json({ message: 'Sunucu hatası.' });
   }
 });

 // — REVIEW EKLE
 app.post('/api/reviews', verifyToken, async (req, res) => {
   const { service, comment } = req.body;
   if (!service || !comment) {
     return res.status(400).json({ message: 'Hizmet ve yorum gerekli.' });
   }
   try {
     await pool.query(
       `INSERT INTO reviews (user_id, service, comment)
        VALUES ($1, $2, $3)`,
       [req.user.id, service, comment]
     );
     res.status(201).json({ message: 'Yorum eklendi.' });
   } catch (err) {
     console.error(err);
     res.status(500).json({ message: 'Sunucu hatası.' });
   }
 });


// Çalışan için randevuları getir
app.get('/api/appointments/employee', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'employee') {
      return res.status(403).json({ message: 'Yalnızca çalışan erişebilir.' });
    }
    const empName = req.user.name;  
    const result = await pool.query(
      `SELECT 
         a.id,
         a.service,
         a.date,
         a.time,
         u.name AS client_name
       FROM appointments a
       JOIN users u ON a.user_id = u.id
       WHERE a.employee = $1
       ORDER BY a.date DESC`,
      [empName]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
});
module.exports = app;
