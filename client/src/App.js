import React, { useEffect } from 'react';
import { useStore } from './store';
import Login from './pages/Login';
import Register from './pages/Register';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import './styles.css';

function App() {
  const { token, setAuth, user } = useStore();

  useEffect(() => {
    const t = localStorage.getItem('token');
    const u = localStorage.getItem('user');
    if (t && u) setAuth(t, JSON.parse(u));
  }, [setAuth]);

  if (!token) {
  return (
    <div className="container">

      <header className="header">
        <div className="logo">
          <div className="mark">CL</div>
          <div>
            <h1>Attendance App</h1>
            <div style={{fontSize:13, color:'#666'}}>Employee & Manager Attendance System</div>
          </div>
        </div>
      </header>

      <div className="landing">

        {/* LOGIN + REGISTER SIDE BY SIDE */}
        <div className="landing-row">

          {/* Login card */}
          <div className="auth-card">
            <h3 style={{marginTop:0}}>Login</h3>
            <Login />
          </div>

          {/* Register card */}
          <div className="auth-card">
            <h3 style={{marginTop:0}}>Register (Employee)</h3>
            <Register />
          </div>
        </div>

        {/* ABOUT SECTION FULL WIDTH */}
        <div className="about-card">
          <h3 style={{marginTop:0}}>About</h3>
          <p style={{margin:0, color:'#666'}}>
            This system allows employees to check in/out, view attendance history, and track monthly summaries. 
            Managers can oversee team attendance, export reports, and view analytics.
          </p>
        </div>

      </div>

      <div className="app-footer">
        Built by Chetan — Employee Attendance System
      </div>

    </div>
  );
}


  // show appropriate dashboard
  const u = JSON.parse(localStorage.getItem('user') || '{}');
  if (u.role === 'manager') return <ManagerDashboard />;
  return <EmployeeDashboard />;
}

export default App;
