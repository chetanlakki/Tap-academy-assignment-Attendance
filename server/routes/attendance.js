// routes/attendance.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Attendance = require('../models/Attendance');
const User = require('../models/User');

// helper: YYYY-MM-DD
function todayStr() {
  const d = new Date();
  return d.toISOString().slice(0,10);
}

// POST /api/attendance/checkin
router.post('/checkin', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const date = todayStr();
    let att = await Attendance.findOne({ userId, date });
    const now = new Date().toISOString();

    if (att) {
      if (att.checkInTime) return res.status(400).json({ error: 'Already checked in' });
      att.checkInTime = now;
      const time = new Date().toTimeString().slice(0,5);
      att.status = (time > '09:30') ? 'late' : 'present';
      await att.save();
      return res.json(att);
    }

    att = new Attendance({ userId, date, checkInTime: now, status: 'present' });
    await att.save();
    res.status(201).json(att);
  } catch (err) {
    console.error('Checkin error', err);
    res.status(500).json({ error: 'Server' });
  }
});

// POST /api/attendance/checkout
router.post('/checkout', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const date = todayStr();
    let att = await Attendance.findOne({ userId, date });
    if (!att || !att.checkInTime) return res.status(400).json({ error: 'No check-in found' });
    if (att.checkOutTime) return res.status(400).json({ error: 'Already checked out' });

    const now = new Date();
    att.checkOutTime = now.toISOString();
    const start = new Date(att.checkInTime);
    const diff = (now - start) / (1000 * 60 * 60); // hours
    att.totalHours = Math.round(diff * 100) / 100;
    await att.save();
    res.json(att);
  } catch (err) {
    console.error('Checkout error', err);
    res.status(500).json({ error: 'Server' });
  }
});

// GET /api/attendance/my-history
router.get('/my-history', auth, async (req, res) => {
  try {
    const items = await Attendance.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(items);
  } catch (err) {
    console.error('My history error', err);
    res.status(500).json({ error: 'Server' });
  }
});

// GET /api/attendance/my-summary
router.get('/my-summary', auth, async (req, res) => {
  try {
    const uid = req.user._id;
    const start = new Date();
    start.setDate(1);
    const startStr = start.toISOString().slice(0,10);
    const items = await Attendance.find({ userId: uid, date: { $gte: startStr }});
    const summary = { present:0, absent:0, late:0, halfDay:0, totalHours:0 };
    items.forEach(i => {
      if (i.status === 'present') summary.present++;
      if (i.status === 'absent') summary.absent++;
      if (i.status === 'late') summary.late++;
      if (i.status === 'half-day') summary.halfDay++;
      summary.totalHours += i.totalHours || 0;
    });
    summary.totalHours = Math.round(summary.totalHours * 100) / 100;
    res.json(summary);
  } catch (err) {
    console.error('My summary error', err);
    res.status(500).json({ error: 'Server' });
  }
});

// GET /api/attendance/today
router.get('/today', auth, async (req, res) => {
  try {
    const date = todayStr();
    const att = await Attendance.findOne({ userId: req.user._id, date });
    res.json(att);
  } catch (err) {
    console.error('Today error', err);
    res.status(500).json({ error: 'Server' });
  }
});

/* Manager endpoints */

// GET /api/attendance/all
router.get('/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'manager') return res.status(403).json({ error: 'Forbidden' });
    const filter = {};
    if (req.query.date) filter.date = req.query.date;
    if (req.query.employeeId) {
      const u = await User.findOne({ employeeId: req.query.employeeId });
      if (!u) return res.json([]);
      filter.userId = u._id;
    }
    if (req.query.status) filter.status = req.query.status;
    const items = await Attendance.find(filter).populate('userId', 'name employeeId department').sort({ date: -1 });
    res.json(items);
  } catch (err) {
    console.error('All employees error', err);
    res.status(500).json({ error: 'Server' });
  }
});

// GET /api/attendance/employee/:id
router.get('/employee/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'manager') return res.status(403).json({ error: 'Forbidden' });
    const items = await Attendance.find({ userId: req.params.id }).sort({ date: -1 });
    res.json(items);
  } catch (err) {
    console.error('Employee error', err);
    res.status(500).json({ error: 'Server' });
  }
});

// GET /api/attendance/summary
router.get('/summary', auth, async (req, res) => {
  try {
    if (req.user.role !== 'manager') return res.status(403).json({ error: 'Forbidden' });
    const date = req.query.date || todayStr();
    const items = await Attendance.find({ date }).populate('userId', 'name employeeId');
    const totalEmployees = await User.countDocuments({ role: 'employee' });
    const present = items.filter(i => i.checkInTime).length;
    const late = items.filter(i => i.status === 'late').length;
    const absent = totalEmployees - present;
    res.json({ date, totalEmployees, present, absent, late, items });
  } catch (err) {
    console.error('Summary error', err);
    res.status(500).json({ error: 'Server' });
  }
});

// GET /api/attendance/export
router.get('/export', auth, async (req, res) => {
  try {
    if (req.user.role !== 'manager') return res.status(403).json({ error: 'Forbidden' });
    const { start, end, employeeId } = req.query;
    const filter = {};
    if (start && end) filter.date = { $gte: start, $lte: end };
    if (employeeId) {
      const u = await User.findOne({ employeeId });
      if (!u) return res.status(404).json({ error: 'Employee not found' });
      filter.userId = u._id;
    }
    const items = await Attendance.find(filter).populate('userId', 'name employeeId department').sort({ date: 1 });

    // build CSV manually
    const header = ['EmployeeId','Name','Date','CheckIn','CheckOut','Status','Hours'];
    const rows = items.map(i => {
      const uid = i.userId || {};
      return [
        uid.employeeId || '',
        uid.name || '',
        i.date || '',
        i.checkInTime || '',
        i.checkOutTime || '',
        i.status || '',
        i.totalHours != null ? String(i.totalHours) : ''
      ];
    });

    // helper escape CSV value
    function esc(v) {
      if (v === null || v === undefined) return '';
      const s = String(v);
      if (s.includes(',') || s.includes('"') || s.includes('\n')) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    }

    const csvLines = [
      header.join(',')
    ].concat(rows.map(r => r.map(esc).join(',')));

    const csv = csvLines.join('\n');

    res.setHeader('Content-disposition', `attachment; filename=attendance_${start || 'all'}_${end || 'all'}.csv`);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.status(200).send(csv);
  } catch (err) {
    console.error('Export error', err);
    res.status(500).json({ error: 'Server' });
  }
});

// GET /api/attendance/today-status
router.get('/today-status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'manager') return res.status(403).json({ error: 'Forbidden' });
    const date = todayStr();
    const items = await Attendance.find({ date }).populate('userId', 'name employeeId');
    res.json(items);
  } catch (err) {
    console.error('Today-status error', err);
    res.status(500).json({ error: 'Server' });
  }
});

module.exports = router;
