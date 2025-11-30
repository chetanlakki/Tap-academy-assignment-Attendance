import React, { useEffect, useState } from 'react';
import { post, get } from '../api';
import { useStore } from '../store';
import { showToast } from '../utils/toast';

export default function MarkAttendance() {
  const token = useStore(s => s.token);
  const [today, setToday] = useState(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    try {
      const res = await get('/api/attendance/today', token);
      setToday(res || null);
    } catch (err) {
      console.error('today status error', err);
    }
  }

  useEffect(() => { load(); }, [token]);

  async function doCheckin() {
    setLoading(true);
    try {
      const res = await post('/api/attendance/checkin', {}, token);
      if (res && res._id) {
        showToast('Checked in successfully', 'success');
        setToday(res);
      } else {
        showToast(res.error || 'Checkin failed', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Checkin failed (network)', 'error');
    } finally { setLoading(false); }
  }

  async function doCheckout() {
    setLoading(true);
    try {
      const res = await post('/api/attendance/checkout', {}, token);
      if (res && res._id) {
        showToast('Checked out successfully', 'success');
        setToday(res);
      } else {
        showToast(res.error || 'Checkout failed', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Checkout failed (network)', 'error');
    } finally { setLoading(false); }
  }

  return (
    <div className="card">
      <h3>Mark Attendance</h3>
      <div style={{marginTop:8}}>
        <div style={{marginBottom:10}}>
          <strong>Today's status:</strong> {today ? (today.checkOutTime ? 'Checked out' : 'Checked in') : 'Not checked in'}
        </div>

        <div style={{display:'flex', gap:10}}>
          <button className="btn" onClick={doCheckin} disabled={loading || (today && !today.checkOutTime)}>
            Check In
          </button>

          <button className="btn" onClick={doCheckout} disabled={loading || !today || today.checkOutTime}>
            Check Out
          </button>
        </div>
      </div>
    </div>
  );
}
