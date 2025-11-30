1)# Employee Attendance System

Simple attendance app for Employees and Managers — built with React (client), Node + Express (server) and MongoDB.

This repo contains:
- `server/` — Express API (auth, attendance, manager endpoints, CSV export, seed script)
- `client/` — React frontend (Login/Register, Employee dashboard, Manager dashboard)

---

## Quick TL;DR (for the impatient)
1. Start MongoDB (Atlas preferred).  
2. Configure `server/.env` from `.env.example`.  
3. `cd server && npm install && npm run dev`  
4. `cd client && npm install && npm start`  
5. Open `http://localhost:3000`. Use seeded manager credentials printed by the seed script.

---

## Local setup — step by step

### Prerequisites
- Node.js 16+ and npm
- MongoDB Atlas (recommended) or local MongoDB
- Git and a GitHub account

### 1 Clone repo
```bash
git clone <your-repo-url>
cd attendance-project

2) Backend setup
cd server
npm install


Create server/.env using server/.env.example (copy paste and fill values):

PORT=5000
MONGODB_URI=mongodb+srv://<db_user>:<db_password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-long-secret


Seed the DB (creates manager + sample employees + attendance):

node seed.js
# note printed manager credentials (email / password)


Start backend server (dev):

npm run dev
# expected: "MongoDB connected" and "Server running at port 5000"

3) Frontend setup

Open a new terminal:

cd client
npm install
# set server base (dev uses http://localhost:5000 by default)
npm start


Open http://localhost:3000.

How to run (summary)

Backend: cd server && npm run dev

Frontend: cd client && npm start

Seed: cd server && node seed.js

Environment variables

server/.env (example)

PORT=5000
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<a-random-secret>


client:

REACT_APP_SERVER (only needed if frontend should point to deployed backend; dev defaults to http://localhost:5000)

Seed data (what it creates)

The seed script creates:

1 manager (email printed in console)

3 employees (with employeeId)

Several attendance entries across recent dates so manager views show data and CSV exports work.

Run node seed.js from server/ to apply.

Troubleshooting tips

CORS issues: ensure server uses cors() or accepts your frontend origin.

JWT errors: check JWT_SECRET consistency if you re-seed.

Mongo connection: verify Atlas user + IP access list.