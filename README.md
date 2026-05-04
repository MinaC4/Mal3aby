# Mal3aby - ملعبي

<div align="center">

![Logo](https://img.shields.io/badge/Malaby-10b981?style=for-the-badge&logo=football)

**Smart Football Pitch Booking Platform**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://mongodb.com)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)](https://docker.com)

</div>

---

##  Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Requirements](#-requirements)
- [Run with Docker](#-run-with-docker)
- [Local Development](#-local-development)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Admin Dashboard Login](#-admin-dashboard-login)
- [Support](#-support)

---

##  Overview

**Mal3aby** is a smart platform that brings football pitch owners together, allowing users to:

-  Browse pitches with photos, prices, and locations
-  Smart booking system with automatic conflict prevention
-  Real-time notifications for booking confirmations
-  Comprehensive admin dashboard for managing bookings

---

##  Features

###  For Users
- Browse pitches with high-quality photos
- Advanced filtering and search
- Smart booking with day and time selection
- Automatic time conflict prevention
- Payment via Vodafone Cash or InstaPay

###  For Admins (Pitch Owners)
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

| Layer | Technology | Description |
|-------|------------|-------------|
| Frontend User | React 18 + Vite + TypeScript + Tailwind CSS | User Interface |
| Frontend Admin | React 18 + Vite + TypeScript + Tailwind CSS | Admin Dashboard |
| Backend | Node.js + Express + MongoDB (Mongoose) | API |
| Database | MongoDB Atlas | Cloud Database |
| DevOps | Docker + Docker Compose | Containerization |

---

##  Requirements

- **Docker** + **Docker Compose**
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
# Edit the .env file with your favorite editor
nano .env
```

Make sure to add your **MongoDB URI**:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/malaby?retryWrites=true&w=majority
```

### 3. Build and Run Services

```bash
# Build all services
docker-compose up --build

# Or run in background
docker-compose up --build -d
```

### 4. Access the Applications

| Service | URL | Description |
|---------|-----|-------------|
| User App | http://localhost:3000 | User Interface |
| Admin Dashboard | http://localhost:3001 | Admin Panel |
| API | http://localhost:5000/api | REST API |

### 5. Manage Services

```bash
# Stop services
docker-compose down

# Rebuild
docker-compose up --build

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f api
```

### 6. Seed Data (Optional)

```bash
# Run seed inside the container
docker-compose exec api node seed.js
```

---

##  Local Development (Without Docker)

### Backend

```bash
cd backend
npm install
npm run seed    # Seed sample data (optional)
npm start       # Production mode
# or
npm run dev     # Development mode (with nodemon)
```

### Frontend User

```bash
cd frontend-user
npm install
npm run dev     # Runs on http://localhost:3000
```

### Frontend Admin

```bash
cd frontend-admin
npm install
npm run dev     # Runs on http://localhost:3001
```

---

## ⚙ Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | Required |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | API port | `5000` |
| `CORS_ORIGIN` | Allowed origins | `*` |
| `ADMIN_USERNAME` | Admin username | `admin` |
| `ADMIN_PASSWORD` | Admin password | `admin123` |

---

## 🔌 API Documentation

### Endpoints

#### Pitches

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/pitches` | Get all pitches |
| `GET` | `/api/pitches/:id` | Get specific pitch |
| `GET` | `/api/pitches/:id/slots?date=YYYY-MM-DD` | Get available time slots |

#### Bookings

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/bookings` | Get all bookings |
| `POST` | `/api/bookings` | Create new booking |
| `GET` | `/api/bookings/:id` | Get specific booking |
| `PUT` | `/api/bookings/:id/status` | Update booking status |
| `PUT` | `/api/bookings/:id/payment` | Upload payment screenshot |
| `DELETE` | `/api/bookings/:id` | Delete booking |

#### Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/notifications` | Get all notifications |
| `PUT` | `/api/notifications/:id/read` | Mark as read |
| `PUT` | `/api/notifications/read-all` | Mark all as read |
| `DELETE` | `/api/notifications/:id` | Delete notification |
| `GET` | `/api/notifications/stats/unread` | Get unread count |

### Health Check

```bash
GET /health
```

---

## 📁 Project Structure

```
malaby/
├── docker-compose.yml          # Docker Compose configuration
├── .env                        # Environment variables
├── .dockerignore               # Docker ignore rules
├── README.md                   # This file
├── docs/
│   └── API_DOCUMENTATION.md    # Detailed API docs
│
├── backend/                    # Backend API Service
│   ├── Dockerfile
│   ├── server.js               # Entry point
│   ├── package.json
│   ├── seed.js                 # Seed data
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── models/
│   │   ├── Pitch.js            # Pitch model
│   │   ├── Booking.js          # Booking model
│   │   └── Notification.js     # Notification model
│   ├── routes/
│   │   ├── pitches.js          # Pitch routes
│   │   ├── bookings.js         # Booking routes
│   │   └── notifications.js    # Notification routes
│   └── middleware/
│       └── errorHandler.js     # Error handling
│
├── frontend-user/              # User Frontend Service
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css
│       ├── lib/
│       │   └── utils.ts
│       ├── types/
│       │   └── index.ts
│       ├── hooks/
│       │   └── useApi.ts
│       ├── components/
│       │   ├── Navbar.tsx
│       │   ├── Footer.tsx
│       │   ├── PitchCard.tsx
│       │   └── BookingForm.tsx
│       └── pages/
│           ├── HomePage.tsx
│           ├── PitchesPage.tsx
│           ├── PitchDetailPage.tsx
│           ├── BookingPage.tsx
│           └── BookingSuccessPage.tsx
│
└── frontend-admin/             # Admin Dashboard Service
    ├── Dockerfile
    ├── nginx.conf
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── tsconfig.json
    ├── index.html
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── index.css
        ├── lib/
        │   └── utils.ts
        ├── types/
        │   └── index.ts
        ├── hooks/
        │   ├── useApi.ts
        │   └── useAuth.ts
        ├── components/
        │   ├── Sidebar.tsx
        │   └── Navbar.tsx
        └── pages/
            ├── LoginPage.tsx
            ├── DashboardPage.tsx
            ├── BookingsPage.tsx
            └── NotificationsPage.tsx
```

---

