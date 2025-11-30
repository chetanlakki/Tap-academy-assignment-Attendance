Employee Attendance System — MERN Stack

A simple and clean attendance-tracking system built for employees and managers. Employees can mark their daily attendance, while managers can view team statistics, filter records, and export attendance reports.

This project was built in a few hours as part of a technical assignment, keeping the codebase minimal, readable, and easy to extend.

🚀 Live Demo

Frontend: https://your-frontend-url-here

Backend API: https://your-backend-url-here

(Replace these two links with your Render deployment URLs)

📌 Features
Employee

Register / Login

Mark Check-In and Check-Out

View monthly summary:

Present

Absent

Late

Total hours worked

Attendance history

Dashboard with a quick overview chart + last 7 days summary

Manager

Login

View all employee attendance

Filter by date, employee, or status

Team summary panel

Export to CSV

Dashboard with:

Total Employees

Today's Present / Absent

Department-wise attendance

Weekly attendance trend

🧱 Tech Stack
Frontend

React (CRA)

Zustand (state management)

Recharts (dashboard charts)

Custom CSS (no UI frameworks used)

Backend

Node.js + Express

JWT authentication

MongoDB Atlas + Mongoose

CSV export

📁 Project Structure
attendance-project/
│
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/          # Login, Dashboard, Manager views, etc.
│   │   ├── components/
│   │   ├── store.js        # Zustand state manager
│   │   ├── App.js
│   │   └── styles.css
│   └── package.json
│
├── server/                 # Backend API
│   ├── models/             # Mongoose schemas
│   │   ├── User.js
│   │   └── Attendance.js
│   ├── routes/             # Auth + Attendance routes
│   │   ├── auth.js
│   │   └── attendance.js
│   ├── seed.js             # Adds sample employees + attendance
│   ├── server.js           # Main API
│   └── package.json
│
├── .env.example            # Example environment file
└── README.md               # Project documentation

🔧 Setup Instructions
1. Clone the repository
git clone https://github.com/your-username/your-repo-name.git
cd attendance-project

2. Backend Setup
cd server
npm install


Create .env file inside server/:

PORT=5000
MONGODB_URI=your_mongo_atlas_uri
JWT_SECRET=your_secret_key


Run backend:

npm run dev


Seed sample users & attendance:

npm run seed

3. Frontend Setup
cd client
npm install
npm start


Create .env inside client/:

REACT_APP_SERVER=http://localhost:5000

🌐 Deployment Notes
Frontend (Render Static Site)

Build command:

npm run build


Publish directory:

build

Backend (Render Web Service)

Environment:

PORT=5000
MONGODB_URI=your atlas uri
JWT_SECRET=your secret


Start command:

node server.js

👥 Sample Credentials (Seed Data)
Manager
Email: geetha.lakkireddy@example.com
Password: Password123

Employees
bhargav.kamati@example.com / Password123
praneetha.k@example.com / Password123
chetan.lakkireddy@example.com / Password123

📸 Screenshots (Add these manually)

You should upload screenshots of:

Login Page

Employee Dashboard

Manager Dashboard

All Attendance Table

Attendance History Calendar

CSV Export

Example section format:

### Login Page
![Login](./screenshots/login.png)

### Employee Dashboard
![Dashboard](./screenshots/employee-dashboard.png)


Create a screenshots/ folder in your repo and add images.

🧪 API Endpoints
Auth

POST /api/auth/register

POST /api/auth/login

GET /api/auth/me

Employee Attendance

POST /api/attendance/checkin

POST /api/attendance/checkout

GET /api/attendance/my-history

GET /api/attendance/my-summary

Manager

GET /api/attendance/all

GET /api/attendance/export

✨ What This Project Demonstrates

Clean backend architecture

JWT authentication

Zustand global state

Reusable UI pattern

Simple but effective attendance logic

CSV export generation

Render deployment workflow

This is a lightweight but complete prototype that can be extended into a real HR attendance system.

📜 License

This project is for educational and evaluation purposes.
