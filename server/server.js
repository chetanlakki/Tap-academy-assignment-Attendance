// server.js — safe version that verifies model registration
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- register models first (this must run before routes use populate)
try {
  require('./models/User');
  require('./models/Attendance');
  console.log('Model files required.');
} catch (e) {
  console.error('Error requiring model files:', e);
}

// show what mongoose has registered (for debugging)
console.log('Registered mongoose models before connect:', mongoose.modelNames());

// now connect to DB and then mount routes
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');

    // show registered models after connect
    console.log('Registered mongoose models after connect:', mongoose.modelNames());

    // require routes AFTER models registered
    const authRoutes = require('./routes/auth');
    const attendanceRoutes = require('./routes/attendance');

    // quick root route
    app.get('/', (req, res) => res.json({ message: 'Attendance API running' }));

    // mount
    app.use('/api/auth', authRoutes);
    app.use('/api/attendance', attendanceRoutes);

    app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
