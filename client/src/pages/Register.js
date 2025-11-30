import React, { useState } from 'react';
import { post } from '../api';
import { useStore } from '../store';

export default function Register() {
  const [name, setName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setAuth = useStore(s => s.setAuth);

  async function submit(e) {
    e.preventDefault();
    if (!name || !employeeId || !email || !password) return alert('Fill all fields');
    const res = await post('/api/auth/register', { name, email, password, employeeId, role: 'employee' });
    if (res.token) setAuth(res.token, res.user);
    else alert(res.error || 'Register failed');
  }

  return (
    <form onSubmit={submit} className="card-body">
      <label>Full name</label>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" type="text" />

      <label>EmployeeId (e.g., EMP101)</label>
      <input value={employeeId} onChange={e => setEmployeeId(e.target.value)} placeholder="EMP101" type="text" />

      <label>Email</label>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="text"/>

      <label>Password</label>
      <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" />

      <div style={{marginTop:8}}>
        <button className="btn" type="submit">Register</button>
      </div>
    </form>
  );
}
