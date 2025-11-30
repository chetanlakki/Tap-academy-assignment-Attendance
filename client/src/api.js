const SERVER = process.env.REACT_APP_SERVER || 'http://localhost:5000';

export async function post(path, data, token) {
  const res = await fetch(`${SERVER}${path}`, {
    method: 'POST',
    headers: { 'Content-Type':'application/json', ...(token? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function get(path, token) {
  const res = await fetch(`${SERVER}${path}`, {
    method: 'GET',
    headers: { ...(token? { Authorization: `Bearer ${token}` } : {}) }
  });
  return res.json();
}
