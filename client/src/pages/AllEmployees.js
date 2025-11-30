import React, { useEffect, useState } from 'react';
import { get } from '../api';
import { useStore } from '../store';

export default function AllEmployees() {
  const { token } = useStore();
  const [rows, setRows] = useState([]);
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);

  async function load(qDate = '') {
    setLoading(true);
    try {
      const qs = qDate ? `?date=${qDate}` : '';
      const res = await get('/api/attendance/all' + qs, token);
      if (res && Array.isArray(res)) setRows(res);
      else setRows([]);
    } catch (e) {
      console.error('Load all employees error', e);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [token]);

  return (
    <div className="card">
      <h3>All Employees Attendance</h3>

      <div style={{marginBottom:12}}>
        <label>Filter by date</label>
        <input type="date" value={date} onChange={e => { setDate(e.target.value); load(e.target.value); }} />
        <div style={{marginTop:10}}>
          <button className="btn" onClick={() => { setDate(''); load(); }}>Reset</button>
        </div>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th className="col-emp">EmpId</th>
              <th>Name</th>
              <th style={{width:120}}>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th style={{width:120}}>Status</th>
              <th style={{width:80}}>Hours</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7">Loading...</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan="7">No attendance records found.</td></tr>
            ) : rows.map(r => (
              <tr key={r._id}>
                <td className="col-emp">{r.userId?.employeeId || '—'}</td>
                <td>{r.userId?.name || '—'}</td>
                <td>{r.date}</td>
                <td>{r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString() : '—'}</td>
                <td>{r.checkOutTime ? new Date(r.checkOutTime).toLocaleTimeString() : '—'}</td>
                <td>
                  <span className={`badge ${r.status || 'present'}`}>
                    {r.status === 'present' ? 'Present' : r.status === 'late' ? 'Late' : r.status === 'absent' ? 'Absent' : 'Half-day'}
                  </span>
                </td>
                <td>{r.totalHours != null ? r.totalHours : 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
