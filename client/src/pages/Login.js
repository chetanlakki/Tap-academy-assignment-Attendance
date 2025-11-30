import React, { useState } from 'react';
import { post } from '../api';
import { useStore } from '../store';

export default function Login() {
  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');
  const setAuth = useStore(s => s.setAuth);

  async function submit(e) {
    e.preventDefault();
    if (!emailOrId || !password) return alert('Fill both fields');
    const res = await post('/api/auth/login', { emailOrId, password });
    if (res.token) {
      setAuth(res.token, res.user);
    } else {
      alert(res.error || 'Login failed');
    }
  }

  return (
    <form onSubmit={submit} className="card-body">
      <label htmlFor="emailOrId">Email or EmployeeId</label>
      <input
        id="emailOrId"
        type="text"
        placeholder="you@example.com or EMP101"
        value={emailOrId}
        onChange={e => setEmailOrId(e.target.value)}
        autoComplete="username"
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        placeholder="Your password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        autoComplete="current-password"
      />

      <div style={{marginTop:8}}>
        <button className="btn" type="submit">Login</button>
      </div>
    </form>
  );
}
