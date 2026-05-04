
# Mal3aby - ملعبي

<div align="center">
  <img src="https://img.shields.io/badge/Mal3aby-10b981?style=for-the-badge&logo=football" alt="Logo" />
  <h3><strong>Smart Football Pitch Booking Platform</strong></h3>

![Home Page](https://github.com/user-attachments/assets/42a67b7b-d501-43e5-b277-77a220f208ad)


  [![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
  [![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js)](https://nodejs.org)
  [![Express](https://img.shields.io/badge/Express-4-000000?logo=express)](https://expressjs.com)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://mongodb.com)
  [![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)](https://docker.com)
</div>

---

## Table of Contents
- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Requirements](#-requirements)
- [Run with Docker](#-run-with-docker)
- [Local Development](#-local-development)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Project UI](#-project-ui)

---

##  Overview

**Mal3aby** is a smart platform that connects football pitch owners with players, offering:

- Browse pitches with photos, prices, and locations
- Smart booking system with automatic conflict prevention
- Real-time notifications
- Comprehensive admin dashboard for pitch owners

---

##  Features

### For Users
- Browse pitches with high-quality photos
- Advanced filtering and search
- Smart booking with day and time selection
- Automatic time conflict prevention
- Payment via Vodafone Cash or InstaPay

### For Admins (Pitch Owners)
- Comprehensive dashboard
- View all bookings with customer details
- Real-time notifications for new bookings
- Manage booking statuses (confirm/cancel)
- View payment transfer screenshots

---

##  Tech Stack

### Architecture: Microservices

```
┌─────────────────────┐
│   Frontend User     │  ← React + Vite (Port 3000)
│   (User App)        │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│   Frontend Admin    │  ← React + Vite (Port 3001)
│   (Dashboard)       │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│   Backend API       │  ← Node.js + Express (Port 5000)
│   (REST API)        │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│   MongoDB Atlas     │  ← Cloud Database
│   (Database)        │
└─────────────────────┘
```

### Technologies Used

| Layer              | Technology                        | Description                  |
|--------------------|-----------------------------------|------------------------------|
| Frontend (User)    | React 18 + Vite + TypeScript + Tailwind CSS | User Interface          |
| Frontend (Admin)   | React 18 + Vite + TypeScript + Tailwind CSS | Admin Dashboard         |
| Backend            | Node.js + Express + Mongoose      | REST API                     |
| Database           | MongoDB Atlas                     | Cloud Database               |
| DevOps             | Docker + Docker Compose           | Containerization             |

---

##  Requirements
- **Docker** + **Docker Compose** (Recommended)
- Or **Node.js 20+** + **npm**
- Internet connection (for MongoDB Atlas)

---

##  Run with Docker

### 1. Clone the Repository
```bash
git clone <repository-url>
cd malaby
```

### 2. Set Up Environment Variables
```bash
nano .env
```

**`.env` example:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/malaby?retryWrites=true&w=majority
NODE_ENV=production
PORT=5000
```

### 3. Build and Run
```bash
# Build and run
docker-compose up --build

# Run in background
docker-compose up --build -d
```

### 4. Access Applications

| Service           | URL                    | Description         |
|-------------------|------------------------|---------------------|
| User App          | http://localhost:3000  | User Interface      |
| Admin Dashboard   | http://localhost:3001  | Admin Panel         |
| API               | http://localhost:5000  | REST API            |

---

##  Local Development

### Backend
```bash
cd backend
npm install
npm run seed          # Optional
npm run dev           # Development
```

### Frontend User
```bash
cd frontend-user
npm install
npm run dev
```

### Frontend Admin
```bash
cd frontend-admin
npm install
npm run dev
```

---

##  Environment Variables

| Variable           | Description                        | Default      |
|--------------------|------------------------------------|--------------|
| `MONGODB_URI`      | MongoDB Atlas connection string    | Required     |
| `NODE_ENV`         | Environment mode                   | `production` |
| `PORT`             | API port                           | `5000`       |
| `CORS_ORIGIN`      | Allowed origins                    | `*`          |
| `ADMIN_USERNAME`   | Admin username                     | `admin`      |
| `ADMIN_PASSWORD`   | Admin password                     | `admin123`   |

---

##  API Documentation

### Pitches
- `GET /api/pitches`
- `GET /api/pitches/:id`
- `GET /api/pitches/:id/slots?date=YYYY-MM-DD`

### Bookings
- `GET /api/bookings`
- `POST /api/bookings`
- `PUT /api/bookings/:id/status`
- `PUT /api/bookings/:id/payment`

### Notifications
- `GET /api/notifications`
- `PUT /api/notifications/:id/read`
- `PUT /api/notifications/read-all`

**Health Check:** `GET /health`

---

##  Project Structure

```bash
malaby/
├── docker-compose.yml
├── .env
├── backend/
│   ├── server.js
│   ├── models/
│   ├── routes/
│   └── ...
├── frontend-user/
├── frontend-admin/
└── README.md
```

---

##  Project UI


### Pitches Page
![Pitches](https://github.com/user-attachments/assets/ae76da3e-9ef7-416b-b223-37e84e506b21)

### Booking Page
![Booking](https://github.com/user-attachments/assets/24c9845b-088f-47c1-981e-08cf12534211)

### Admin Dashboard
![Admin Dashboard 1](https://github.com/user-attachments/assets/c2da0968-a450-4814-9d43-5e10f0ac8b76)
![Admin Dashboard 2](https://github.com/user-attachments/assets/63427b3a-e742-4689-8279-53b8baef92a5)
```
