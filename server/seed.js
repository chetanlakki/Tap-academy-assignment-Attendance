// seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Attendance = require('./models/Attendance');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected for seeding');

  // clear old data
  await User.deleteMany({});
  await Attendance.deleteMany({});

  const pass = await bcrypt.hash('Password123', 10);

  // === YOUR UNIQUE USERS ===

  const manager = new User({
    name: 'Geetha Lakkireddy',
    email: 'geetha.lakkireddy@example.com',
    employeeId: 'MGR777',     // unique
    password: pass,
    role: 'manager',
    department: 'Engineering'
  });

  const emp1 = new User({
    name: 'Bhargav Kamati',
    email: 'bhargav.kamati@example.com',
    employeeId: 'EMP321',     // unique
    password: pass,
    role: 'employee',
    department: 'Development'
  });

  const emp2 = new User({
    name: 'Praneetha Kothamanasu',
    email: 'praneetha.k@example.com',
    employeeId: 'EMP654',     // unique
    password: pass,
    role: 'employee',
    department: 'Design'
  });

  await manager.save();
  await emp1.save();
  await emp2.save();

  // sample attendance for last 5 days
  const days = [0,1,2,3,4].map(i => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().slice(0,10);
  });

  for (const date of days) {
    await Attendance.create({
      userId: emp1._id,
      date,
      checkInTime: new Date().toISOString(),
      checkOutTime: new Date().toISOString(),
      status: 'present',
      totalHours: 8
    });

    await Attendance.create({
      userId: emp2._id,
      date,
      checkInTime: new Date().toISOString(),
      checkOutTime: new Date().toISOString(),
      status: (Math.random() > 0.8) ? 'late' : 'present',
      totalHours: 7.5
    });
  }

  console.log('Seed done. Manager credentials: geetha.lakkireddy@example.com / Password123');
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
