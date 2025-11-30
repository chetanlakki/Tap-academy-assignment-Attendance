import React from 'react';
import AllEmployees from './AllEmployees';
import Reports from './Reports';
import { useStore } from '../store';

export default function ManagerDashboard() {
  const { user, logout } = useStore();
  return (
    <div className="container">
      <div className="header">
        <div className="logo">
          <div className="mark">CL</div>
          <div>
            <h1>Manager Dashboard</h1>
            <div style={{fontSize:13, color:'#666'}}>Hello, {user?.name}</div>
          </div>
        </div>

        <div style={{textAlign:'right'}}>
          <div style={{marginBottom:8, color:'#666'}}>{user?.employeeId}</div>
          <button className="btn" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="grid">
        <div>
          <AllEmployees />
        </div>

        <div>
          <Reports />
        </div>
      </div>

      <div className="app-footer">Built by Chetan — Employee Attendance System</div>
    </div>
  );
}
