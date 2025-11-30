const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['employee', 'manager'], default: 'employee' },
  department: { type: String, default: 'General' },
  createdAt: { type: Date, default: Date.now }
});

// Register model name exactly as 'User' (capital U)
module.exports = mongoose.model('User', UserSchema);
