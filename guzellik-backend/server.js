// server.js
require('dotenv').config();
const app = require('./app');
const { createUserTable } = require('./models/userModel');
const { createAppointmentTable } = require('./models/appointmentModel');
const { createFavoriteTable } = require('./models/favoriteModel');

async function init() {
  await createUserTable();
  await createAppointmentTable();
  await createFavoriteTable();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Sunucu ${PORT} portunda!`));
}

init();
