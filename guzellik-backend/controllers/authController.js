// controllers/authController.js

const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// — Kayıt (Register)
const register = async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  try {
    // Kullanıcı zaten var mı kontrol et
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Bu e-posta zaten kayıtlı.' });
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni kullanıcıyı kaydet (ilk 100 puan bonusu istersen burada ekleyebilirsin)
    const newUser = await pool.query(
      `INSERT INTO users (name, email, password, phone, role, points)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, email, hashedPassword, phone, role || 'user', 100]
    );

    // JWT Token oluştur
    const token = jwt.sign(
      { id: newUser.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: 'Kayıt başarılı!',
      user: newUser.rows[0],
      token,
    });
  } catch (err) {
    console.error('Kayıt hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

// — Giriş (Login)
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Kullanıcıyı veritabanında bul
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    const user = userResult.rows[0];

    if (!user) {
      return res.status(400).json({ message: 'E-posta bulunamadı.' });
    }

    // Şifreyi kontrol et
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Şifre hatalı.' });
    }

    // JWT Token oluştur
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Giriş başarılı!',
      user,
      token,
    });
  } catch (err) {
    console.error('Giriş hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

// — Profil (Profile)
const profile = async (req, res) => {
  try {
    // verifyToken ile req.user.id geldiğinden eminiz
    const result = await pool.query(
      `SELECT id, name, email, phone, role, points, created_at
         FROM users
        WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Profile hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

module.exports = {
  register,
  login,
  profile,   
};