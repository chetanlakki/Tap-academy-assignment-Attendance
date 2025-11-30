import React, { useState } from 'react';
import { useStore } from '../store';
import { showToast } from '../utils/toast';

export default function Reports() {
  const token = useStore(state => state.token);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [loading, setLoading] = useState(false);

  function buildQs() {
    const qs = [];
    if (start) qs.push(`start=${start}`);
    if (end) qs.push(`end=${end}`);
    if (employeeId) qs.push(`employeeId=${encodeURIComponent(employeeId)}`);
    return qs.length ? '?' + qs.join('&') : '';
  }

  async function exportCsv() {
    if (!token) {
      showToast('Not authenticated', 'error');
      return;
    }
    setLoading(true);
    try {
      const qs = buildQs();
      const base = process.env.REACT_APP_SERVER || 'http://localhost:5000';
      const url = `${base}/api/attendance/export${qs}`;
      const res = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const text = await res.text();
        showToast('Export failed: ' + (text || res.status), 'error');
        setLoading(false);
        return;
      }

      const blob = await res.blob();
      let filename = `attendance_${start || 'all'}_${end || 'all'}.csv`;
      const cd = res.headers.get('content-disposition');
      if (cd) {
        const m = /filename=([^;]+)/.exec(cd);
        if (m && m[1]) filename = m[1].replace(/"/g, '');
      }

      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);

      showToast('CSV exported — check downloads', 'success');
    } catch (err) {
      console.error('Export CSV error', err);
      showToast('Export failed (network)', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card reports-card">
      <h3>Reports</h3>

      <div style={{marginTop:8}}>
        <label>Start</label>
        <input type="date" value={start} onChange={e => setStart(e.target.value)} />
      </div>

      <div style={{marginTop:8}}>
        <label>End</label>
        <input type="date" value={end} onChange={e => setEnd(e.target.value)} />
      </div>

      <div style={{marginTop:8}}>
        <label>EmployeeId (optional)</label>
        <input placeholder="EMP321" value={employeeId} onChange={e => setEmployeeId(e.target.value)} />
      </div>

      <div style={{marginTop:12}}>
        <button className="btn" onClick={exportCsv} disabled={loading}>
          {loading ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>

      <div className="note" style={{marginTop:10}}>CSV will be downloaded (auth included).</div>
    </div>
  );
}
