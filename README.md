# Management System

A full-stack Alumni Management System designed to manage and display alumni data, student profiles, and placement statistics. Built using the MERN stack, this portal streamlines the interaction between students and admins for profile verification, data updates, and insights into placement records.

![MERN Stack](https://img.shields.io/badge/MERN-Stack-blue?style=flat)

## ✨ Features

### 👥 Authentication
- Secure login system for Students and Admins
- Email verification

### 📊 Scorecard Dashboard
- View academic details: CGPA, Branch, Batch
- Advanced filters:
  - CGPA range
  - Branch-wise sorting
  - Batch-wise filtering

### 🎓 Alumni Information
- Verified alumni profiles with placement packages
- Filters:
  - Package range
  - Branch
  - Batch

### ✏️ Profile Updates
- Students request edits
- Admin approval workflow
- Feedback system for rejected requests

### 📋 Admin Panel
- Approve/reject profile updates
- Manage placement records
- Monitor student/alumni data

### 🔒 Access Control
- Role-based views (Student/Admin)
- JWT-based session management

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Security**: JWT Authentication

### Database
- **DBMS**: MongoDB
- **ORM**: Mongoose

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas URI
- npm/yarn


## Setup Instructions

```bash
# Clone the repo
git clone https://github.com/SharmaAyush1009/ManagementSystem.git
cd ManagementSystem

#Backend Setup
cd backend
npm install

# Create .env file with:
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
node server.js

#Frontend Setup
cd frontend
npm install

# Start the server
npm start
```
