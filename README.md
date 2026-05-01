# NextStep@IET Project

NextStep@IET is a full-stack, role-based web application built to digitize and streamline the scholarship and student support process in college.
It replaces manual workflows (calls, WhatsApp, physical verification) with a centralized and efficient system for students, faculty, and DSW admins.

## Problem Statement

In my college, scholarship processes like:

Document submission,
Verification,
Query handling

were done manually, leading to:

Communication delays,
Lack of transparency,
High workload on volunteers

## Project Structure

- `backend/` - Express server, MongoDB models, authentication, document uploads, placements, and user management.
- `frontend/` - React application using Vite, Tailwind CSS, and pages for students, teachers, admins, and placement features.

## 👥 User Roles
👨‍🎓 `Student`
Upload documents
Track application status
Raise support tickets
View attendance

🧑‍🏫 `Faculty`
Mark student attendance

🛠️ `Admin (DSW)`
Verify documents
Manage tickets
Post announcements

## Prerequisites

- Node.js 18+
- npm
- MongoDB instance or MongoDB URL

## Backend Setup

1. Open a terminal and navigate to `backend/`:
   ```bash
   cd backend
   npm install
   ```
2. Create a `.env` file and set your values:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
3. Start the backend server:
   ```bash
   npm start
   ```

## Frontend Setup

1. Open a terminal and navigate to `frontend/`:
   ```bash
   cd frontend
   npm install
   ```
2. Start the frontend development server:
   ```bash
   npm run dev
   ```
3. Open the local URL shown in the terminal.

## Helpful Commands

- `cd backend && npm install && npm start`
- `cd frontend && npm install && npm run dev`

## Contact

For questions or help, add additional project-specific instructions here.
