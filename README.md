# College Connect - Digital Student Welfare Portal

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB
- npm or yarn

### Installation

1. **Backend Setup:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

##  Features

- **Student Dashboard:** Grievances, Scholarships, Announcements
- **Admin Dashboard:** Manage grievances, scholarships, announcements
- **Teacher Dashboard:** Attendance management, student oversight
- **File Upload:** Document vault for scholarship applications
- **Real-time Updates:** Live grievance status tracking

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS, Vite
- **Backend:** Node.js, Express, MongoDB
- **Authentication:** JWT-based sessions
- **File Storage:** Local file system with static serving

## 📁 Project Structure

```
college-connect/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── uploads/          # File storage
│   ├── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── api/
│   └── vite.config.js
└── README.md
```

## 🔧 Development Commands

```bash
# Backend
npm run dev      # Start with nodemon
npm start        # Production start

# Frontend
npm run dev      # Development server
npm run build    # Production build
```

## 🌐 Access URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:7000
- **File Uploads:** http://localhost:7000/uploads/

---

**Institution:** Institute of Engineering and Technology, Lucknow
**Module:** Digital Student Welfare (DSW)