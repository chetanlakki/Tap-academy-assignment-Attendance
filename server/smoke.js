// smoke.js — quick automated API smoke test
// Usage: node smoke.js
// Make sure your server is running (npm run dev) before running this.

const SERVER = process.env.SMOKE_SERVER || 'http://localhost:5000';

// seeded manager credentials (from your seed)
const MANAGER = {
  emailOrId: 'geetha.lakkireddy@example.com',
  password: 'Password123'
};

function safeLog(title, data) {
  console.log('--- ' + title + ' ---');
  if (typeof data === 'string') return console.log(data);
  try {
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.log(data);
  }
}

async function req(path, opts = {}) {
  const url = SERVER + path;
  try {
    const res = await fetch(url, opts);
    const text = await res.text();
    let body;
    try { body = JSON.parse(text); }
    catch (e) { body = text; }
    return { ok: res.ok, status: res.status, body, headers: res.headers };
  } catch (err) {
    return { ok: false, status: 0, error: String(err) };
  }
}

async function main() {
  console.log('Smoke test starting against', SERVER);
  console.log('Note: this will try to register a temporary user and run employee + manager flows.\n');

  // 1) Register a new unique user (employee)
  const unique = Date.now().toString().slice(-6);
  const testUser = {
    name: `SmokeUser ${unique}`,
    email: `smoke.${unique}@example.com`,
    password: 'Password123',
    employeeId: `EMP${unique}`,
    department: 'QA',
    role: 'employee'
  };

  safeLog('Register - payload', testUser);
  const r1 = await req('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testUser)
  });
  safeLog('Register - response', r1);

  // If register failed because user exists, attempt login next.
  // 2) Login as the test employee
  const loginPayload = { emailOrId: testUser.email, password: testUser.password };
  safeLog('Login (employee) - payload', loginPayload);
  const r2 = await req('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loginPayload)
  });
  safeLog('Login (employee) - response', r2);
  if (!r2.ok) {
    console.log('Employee login failed — aborting employee flow. Paste response above.');
  } else {
    const employeeToken = r2.body.token;
    // 3) Checkin
    safeLog('Checkin - calling POST /api/attendance/checkin', '');
    const r3 = await req('/api/attendance/checkin', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${employeeToken}`, 'Content-Type': 'application/json' }
    });
    safeLog('Checkin - response', r3);

    // 4) My history
    safeLog('My history - GET /api/attendance/my-history', '');
    const r4 = await req('/api/attendance/my-history', {
      headers: { 'Authorization': `Bearer ${employeeToken}` }
    });
    safeLog('My history - response', r4);

    // 5) Checkout
    safeLog('Checkout - POST /api/attendance/checkout', '');
    const r5 = await req('/api/attendance/checkout', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${employeeToken}`, 'Content-Type': 'application/json' }
    });
    safeLog('Checkout - response', r5);

    // 6) My summary (this month)
    safeLog('My summary - GET /api/attendance/my-summary', '');
    const r6 = await req('/api/attendance/my-summary', {
      headers: { 'Authorization': `Bearer ${employeeToken}` }
    });
    safeLog('My summary - response', r6);
  }

  // Manager flow
  safeLog('Manager login payload', MANAGER);
  const mgrLogin = await req('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(MANAGER)
  });
  safeLog('Manager login response', mgrLogin);
  if (!mgrLogin.ok) {
    console.log('Manager login failed — cannot run manager endpoints. Check manager credentials and seed.');
    return;
  }
  const mgrToken = mgrLogin.body.token;

  // Manager: all attendance
  safeLog('Manager - GET /api/attendance/all', '');
  const mgrAll = await req('/api/attendance/all', { headers: { 'Authorization': `Bearer ${mgrToken}` } });
  safeLog('Manager - /all response (first 5 items)', Array.isArray(mgrAll.body) ? mgrAll.body.slice(0,5) : mgrAll);

  // Manager: export CSV (last 7 days)
  const now = new Date();
  const end = now.toISOString().slice(0,10);
  const past = new Date(); past.setDate(now.getDate() - 7);
  const start = past.toISOString().slice(0,10);
  const csvPath = `/api/attendance/export?start=${start}&end=${end}`;
  safeLog('Manager - GET /api/attendance/export - qs', { start, end });
  const mgrCsv = await req(csvPath, { headers: { 'Authorization': `Bearer ${mgrToken}` } });
  safeLog('Manager - export response (truncated)', typeof mgrCsv.body === 'string' ? mgrCsv.body.slice(0,400) : mgrCsv);

  console.log('\nSmoke test finished. If any step returned non-OK (ok: false or status >= 400), paste the full responses here and I will debug further.');
}

main().catch(err => {
  console.error('Smoke script error', err);
});
