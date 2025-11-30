// client/src/pages/EmployeeDashboard.js
import React, { useEffect, useState } from 'react';
import MarkAttendance from './MarkAttendance';
import MyHistory from './MyHistory';
import { useStore } from '../store';
import { get } from '../api';

function formatHours(h) {
  if (h == null) return '0';
  // show one decimal for fractions, else integer
  return Number.isInteger(h) ? String(h) : h.toFixed(1);
}

/* Simple SVG mini bar chart (last 7 days) */
function MiniBarChart({ data = [] }) {
  const w = 220;
  const h = 60;
  const max = Math.max(...data, 1);
  const cols = data.length || 1;
  const gap = 6;
  const colWidth = Math.max(6, Math.floor((w - (cols + 1) * gap) / Math.max(1, cols)));

  return (
    <svg width={w} height={h} style={{display:'block'}}>
      <rect width={w} height={h} rx={6} fill="transparent" />
      {data.map((v, i) => {
        const bw = colWidth;
        const x = gap + i * (bw + gap);
        const barH = Math.round((v / max) * (h - 14));
        const y = h - barH - 6;
        return <rect key={i} x={x} y={y} width={bw} height={barH} rx={3} fill="#6f7766" opacity={0.9} />;
      })}
    </svg>
  );
}

/* Tiny pie chart */
function MiniPie({ values = [] , colors = [] , size = 80 }) {
  const total = values.reduce((s, n) => s + (n || 0), 0) || 1;
  let angle = -90;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;
  function polarToCartesian(cx, cy, r, angleDeg) {
    const a = (angleDeg - 90) * Math.PI / 180.0;
    return { x: cx + (r * Math.cos(a)), y: cy + (r * Math.sin(a)) };
  }

  const arcs = values.map((v, i) => {
    const portion = v / total;
    const sweep = portion * 360;
    const start = angle;
    const end = angle + sweep;
    const startP = polarToCartesian(cx, cy, r, end);
    const endP = polarToCartesian(cx, cy, r, start);
    const large = sweep > 180 ? 1 : 0;
    const path = `M ${cx} ${cy} L ${startP.x} ${startP.y} A ${r} ${r} 0 ${large} 0 ${endP.x} ${endP.y} Z`;
    angle += sweep;
    return { path, color: colors[i] || '#c6ccb9' };
  });

  return (
    <svg width={size} height={size}>
      {arcs.map((a, idx) => <path key={idx} d={a.path} fill={a.color} />)}
      <circle cx={cx} cy={cy} r={r - 14} fill="transparent" />
    </svg>
  );
}

export default function EmployeeDashboard() {
  const { user, logout } = useStore();
  const [summary, setSummary] = useState({ present:0, absent:0, late:0, halfDay:0, totalHours: 0 });
  const [trend, setTrend] = useState([0,0,0,0,0,0,0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const s = await get('/api/attendance/my-summary', token) || { present:0, absent:0, late:0, halfDay:0, totalHours:0 };
        if (!mounted) return;
        setSummary(s);

        // load history to compute a last-7-days present trend
        const h = await get('/api/attendance/my-history', token) || [];
        if (!mounted) return;
        const last7 = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          last7.push(d.toISOString().slice(0,10));
        }
        const counts = last7.map(day => h.filter(x => x.date === day && x.status === 'present').length);
        setTrend(counts);
      } catch (err) {
        console.error('Employee dashboard load error', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [user]);

  return (
    <div className="container">
      <div className="header" style={{alignItems:'center'}}>
        <div className="logo">
          <div className="mark">CL</div>
          <div style={{marginLeft:8}}>
            <h1 style={{marginBottom:4}}>Employee Dashboard</h1>
            <div style={{fontSize:13, color:'#666'}}>Welcome, {user?.name}</div>
          </div>
        </div>

        <div style={{textAlign:'right'}}>
          <div style={{marginBottom:8, color:'#666'}}>ID: {user?.employeeId}</div>
          <button className="btn" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="grid" style={{alignItems:'start'}}>

        {/* Left column: summary + charts */}
        <div>
          <div className="card" style={{marginBottom:12}}>
            <h3 style={{marginBottom:12}}>Monthly Summary</h3>

            {loading ? (
              <div style={{padding:20}}>Loading summary...</div>
            ) : (
              <div style={{display:'flex', gap:12, alignItems:'stretch', justifyContent:'space-between', flexWrap:'wrap'}}>
                <div className="summary-card" style={{flex:'1 1 140px', minWidth:120}}>
                  <h4 style={{fontSize:24, color:'#222'}}>{summary.present}</h4>
                  <p>Present</p>
                </div>

                <div className="summary-card" style={{flex:'1 1 140px', minWidth:120}}>
                  <h4 style={{fontSize:24, color:'#222'}}>{summary.absent}</h4>
                  <p>Absent</p>
                </div>

                <div className="summary-card" style={{flex:'1 1 140px', minWidth:120}}>
                  <h4 style={{fontSize:24, color:'#222'}}>{summary.late}</h4>
                  <p>Late</p>
                </div>

                <div className="summary-card" style={{flex:'1 1 160px', minWidth:160}}>
                  <h4 style={{fontSize:24, color:'#222'}}>{formatHours(summary.totalHours)}</h4>
                  <p>Total hours</p>
                </div>
              </div>
            )}
          </div>

          <div className="card" style={{display:'flex', gap:12, alignItems:'center', justifyContent:'space-between'}}>
            <div style={{flex:'1 1 auto'}}>
              <h3 style={{marginTop:0, marginBottom:10}}>This week's attendance</h3>
              <MiniBarChart data={trend} />
              <div style={{fontSize:12, color:'#666', marginTop:8}}>Bars = number of days you were present (last 7 days)</div>
            </div>

            <div style={{width:120, textAlign:'center'}}>
              <h3 style={{margin:0, marginBottom:6, fontSize:14}}>Status split</h3>
              <MiniPie
                values={[summary.present, summary.absent, summary.late]}
                colors={['#dff3e9','#ffe6e6','#fff7d9']}
                size={100}
              />
              <div style={{fontSize:12, color:'#666', marginTop:8}}>
                <div><span style={{display:'inline-block', width:10, height:10, background:'#dff3e9', borderRadius:3, marginRight:8}}/>Present</div>
                <div><span style={{display:'inline-block', width:10, height:10, background:'#ffe6e6', borderRadius:3, marginRight:8}}/>Absent</div>
                <div><span style={{display:'inline-block', width:10, height:10, background:'#fff7d9', borderRadius:3, marginRight:8}}/>Late</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: quick actions + history */}
        <div style={{minWidth:320}}>
          <MarkAttendance />
          <div style={{height:12}} />
          <MyHistory />
        </div>
      </div>

      <div className="app-footer">Built by Chetan — Employee Attendance System</div>
    </div>
  );
}
