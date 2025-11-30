<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&color=0:4e54c8,100:8f94fb&height=120&section=header&text=Employee%20Attendance%20System&fontSize=40&fontColor=ffffff&animation=fadeIn" />
</p>
<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/State-Zustand-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Auth-JWT-yellow?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Database-MongoDB-success?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Deployment-Render-purple?style=for-the-badge" />
</p>

<p align="center">
  <img src="https://img.shields.io/github/languages/top/chetanlakki/Tap-academy-assignment?style=flat-square" />
  <img src="https://img.shields.io/github/repo-size/chetanlakki/Tap-academy-assignment?style=flat-square" />
  <img src="https://img.shields.io/github/last-commit/chetanlakki/Tap-academy-assignment?style=flat-square" />
</p>

Developer Portfolio Style (rich layout, emojis, clean boxes, headings, looks premium)

👉 This one looks GREAT on GitHub.

🚀 Employee Attendance System
A clean, fast, fully functional MERN attendance tracker for employees & managers
<p align="center"> <img src="https://img.shields.io/badge/MERN-Stack-green?style=for-the-badge" /> <img src="https://img.shields.io/badge/React-Zustand-blue?style=for-the-badge" /> <img src="https://img.shields.io/badge/Node.js-Express-lightgrey?style=for-the-badge" /> <img src="https://img.shields.io/badge/MongoDB-Atlas-success?style=for-the-badge" /> </p>
📌 Overview

This project is a minimal, production-ready MERN Attendance System with two roles:

Employee → Check in, check out, view history, track monthly stats

Manager → View all employee attendance, filter, export CSV, analyze team data

I focused heavily on clean code, predictable architecture, and a smooth user flow, keeping the UI simple but professional.

⭐ Live Demo

Frontend → https://your-frontend-url

Backend API → https://your-backend-url

🧠 Core Features
👨‍💼 Employee

Login / Register

Mark attendance (Check-In / Check-Out)

Monthly summary (Present, Absent, Late, Total Hours)

History table

Dashboard charts

Real-time check-in status

🧑‍🔧 Manager

Login

View all employees

Filter by date, status, employee

Team summary panel

CSV Export

Attendance trends + department stats

🏗 Tech Stack
Frontend

React

Zustand (state management)

Recharts (graphs)

Custom CSS

Backend

Node.js + Express

JWT Authentication

MongoDB Atlas

Mongoose

CSV generator

📁 Project Structure
attendance-project/
│
├── client/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── store.js
│   │   ├── App.js
│   │   └── styles.css
│   └── package.json
│
├── server/
│   ├── models/
│   ├── routes/
│   ├── seed.js
│   ├── server.js
│   └── package.json
│
└── README.md

⚙️ Setup Instructions
🟦 Backend Setup
cd server
npm install


Create .env:

PORT=5000
MONGODB_URI=your_mongo_uri
JWT_SECRET=your_secret


Run backend:

npm run dev


Seed sample users:

npm run seed

🟩 Frontend Setup
cd client
npm install
npm start


Add .env:

REACT_APP_SERVER=http://localhost:5000

🌐 Deployment
Frontend (Render Static Site)

Build:

npm run build


Publish directory:

build

Backend (Render Web Service)

Start command:

node server.js

🧪 API Endpoints (Technical Summary)
Auth

POST /api/auth/register
POST /api/auth/login
GET /api/auth/me

Attendance

Employees:

POST /api/attendance/checkin
POST /api/attendance/checkout
GET /api/attendance/my-history
GET /api/attendance/my-summary


Manager:

GET /api/attendance/all
GET /api/attendance/export

👨‍💻 Sample Credentials (Generated Using seed.js)
Manager
geetha.lakkireddy@example.com
Password123

Employees
bhargav.kamati@example.com / Password123
praneetha.k@example.com / Password123
chetan.lakkireddy@example.com / Password123

📸 Screenshots

![Login Page](<img width="1920" height="1080" alt="Screenshot 2025-11-30 163141" src="https://github.com/user-attachments/assets/018619a4-d1bb-4e19-99fb-e551dbf5e01c" />
)
![Employee Dashboard](<img width="1920" height="1080" alt="Screenshot 2025-11-30 163153" src="https://github.com/user-attachments/assets/71c346f8-94f1-480a-8c9c-5364912b6565" />
)
![Manager Dashboard](<img width="1920" height="1080" alt="Screenshot 2025-11-30 163224" src="https://github.com/user-attachments/assets/431f6282-5d7d-4dd7-9d7f-635259f3866c" />
)

🧩 Why This Project Works

Clean folder structure

Predictable state handling

No unnecessary dependencies

Code is readable by juniors & seniors

Ready to extend (pagination, roles, OTP login, etc.)

📜 License

This project is for educational / demo purposes.
