# ZenTrack

A full-stack habit tracking app built with **Vue.js**, **Node.js**, **Express**, and **MongoDB**.  
Users can create habits, track daily progress, and view analytics on their dashboard.

---

## Features
- Google Authentication (OAuth)
- Create, edit, and delete habits
- Daily entries tracking
- Personalized dashboard with streaks and stats
- Responsive design using TailwindCSS

---

## Tech Stack
**Frontend:** Vue 3 (Vite) + TailwindCSS  
**Backend:** Node.js + Express + MongoDB + Passport.js  
**Database:** MongoDB Atlas (or local MongoDB)

---

## ⚙️ Setup Instructions

git clone https://github.com/Mj-2514/zenTrack.git

cd zenTrack


Backend Setup

cd backend

npm install

node server.js

Create a .env file inside /backend:

PORT= Your_port

MONGO_URI=Your_mongoURI

GOOGLE_CLIENT_ID=Your_client_id

GOOGLE_CLIENT_SECRET=Your_client_secret

SESSION_SECRET=Your_session_secret


Frontend Setup

cd zentrack

npm install

npm run dev



