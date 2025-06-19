// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Token gerekli' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'gizliKeyBalim123');
    req.user = decoded;  // { id, name, phone, email, iat, exp }
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Geçersiz token' });
  }
};

module.exports = { verifyToken };
