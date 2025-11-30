import React, { useEffect, useState } from 'react';
import { get } from '../api';
import { useStore } from '../store';

export default function MyHistory() {
  const { token } = useStore();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await get('/api/attendance/my-history', token);
      setRows(res || []);
    }
    load();
  }, [token]);

  return (
    <div className="card">
      <h3>My Attendance History</h3>
      <table className="table">
        <thead>
          <tr><th>Date</th><th>CheckIn</th><th>CheckOut</th><th>Status</th><th>Hours</th></tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r._id}>
              <td>{r.date}</td>
              <td>{r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString() : '—'}</td>
              <td>{r.checkOutTime ? new Date(r.checkOutTime).toLocaleTimeString() : '—'}</td>
              <td>
                <span className={`badge ${r.status}`}>
                  {r.status === 'present' ? 'Present' : r.status === 'late' ? 'Late' : r.status === 'absent' ? 'Absent' : 'Half-day'}
                </span>
              </td>
              <td>{r.totalHours || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
