// add_sample.js
// usage: node add_sample.js
// Adds sample attendance records for the 25th of the current month
require('dotenv').config();
const mongoose = require('mongoose');
const Attendance = require('./models/Attendance');
const User = require('./models/User');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');

  // build date for 25th of current month
  const d = new Date();
  const year = d.getFullYear();
  const month = d.getMonth(); // 0-based
  const day = 25;
  const dateObj = new Date(year, month, day);
  const dateStr = dateObj.toISOString().slice(0,10);
  console.log('Target date:', dateStr);

  // find all employees (not managers)
  const employees = await User.find({ role: 'employee' }).limit(20);
  if (!employees.length) {
    console.log('No employees found. Create some users first.');
    process.exit(0);
  }

  for (let i = 0; i < employees.length; i++) {
    const u = employees[i];

    // avoid duplicates
    const exists = await Attendance.findOne({ userId: u._id, date: dateStr });
    if (exists) {
      console.log(`Attendance exists for ${u.employeeId} (${u.name})`);
      continue;
    }

    // randomize status a bit
    const rand = Math.random();
    const status = rand > 0.85 ? 'late' : 'present';
    const checkIn = new Date(year, month, day, 9 + Math.floor(Math.random() * 2), Math.floor(Math.random()*60));
    const checkOut = new Date(checkIn.getTime() + (7.5 + Math.random() * 1.5) * 60 * 60 * 1000);

    await Attendance.create({
      userId: u._id,
      date: dateStr,
      checkInTime: checkIn.toISOString(),
      checkOutTime: checkOut.toISOString(),
      status,
      totalHours: Math.round(((checkOut - checkIn) / (1000*60*60)) * 100) / 100
    });

    console.log(`Created for ${u.employeeId} (${u.name})`);
  }

  console.log('Done adding sample attendance for', dateStr);
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
