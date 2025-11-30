// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, employeeId, department, role } = req.body;
    if (!name || !email || !password || !employeeId) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const exists = await User.findOne({ $or: [{ email }, { employeeId }] });
    if (exists) return res.status(400).json({ error: 'User exists' });

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashed,
      employeeId,
      department,
      role: role || 'employee'
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        employeeId: user.employeeId,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { emailOrId, password } = req.body;
    if (!emailOrId || !password) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const user = await User.findOne({
      $or: [{ email: emailOrId }, { employeeId: emailOrId }]
    });

    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        employeeId: user.employeeId,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /me
const auth = require('../middleware/auth');
router.get('/me', auth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
