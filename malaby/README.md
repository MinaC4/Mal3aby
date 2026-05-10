# ملعبي (Malaby) — Football Pitch Booking Platform

A full-stack web application for booking football pitches online. Users can browse pitches, select time slots, and submit bookings. Admins review and confirm bookings via a dedicated dashboard.

---

## Features

**User App**
- Browse and search football pitches by name, location, and price
- View pitch details, images, and pricing
- Select available time slots (only confirmed bookings block slots)
- Submit a booking request and upload payment screenshot

**Admin Dashboard**
- View all pending, confirmed, cancelled, and completed bookings
- Confirm or cancel bookings (confirming a slot makes it unavailable to new bookings)
- Manage pitches (add, edit, activate/deactivate)
- Real-time notifications for new bookings and payments

**Booking Logic**
- A `pending` booking does **not** block a time slot — multiple users can request the same slot
- Only after an admin **confirms** a booking does the slot become unavailable to others
- Admins cannot confirm a booking that overlaps with an already-confirmed booking

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express, MongoDB Atlas (Mongoose) |
| User Frontend | React, Vite, TypeScript, Tailwind CSS |
| Admin Dashboard | React, Vite, TypeScript, Tailwind CSS, shadcn/ui |
| Deployment | Replit (single Express server serves all three) |
| Containerization | Docker, Docker Compose, Nginx |

---

## Project Structure

```
malaby/
├── backend/                  # Express API server
│   ├── config/db.js          # MongoDB connection
│   ├── middleware/           # Error handler
│   ├── models/               # Mongoose models (Booking, Pitch, Notification)
│   ├── routes/               # API routes (pitches, bookings, notifications)
│   ├── seed.js               # Database seeder (sample pitches)
│   ├── clean.js              # Database cleaner (removes all data)
│   ├── server.js             # Entry point
│   └── Dockerfile
├── frontend-user/            # React user app (port 3000 in Docker / root in Replit)
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Route pages
│   │   ├── hooks/            # useApi, custom hooks
│   │   └── types/            # TypeScript interfaces
│   ├── nginx.conf            # Nginx config for Docker (proxies /api to backend)
│   └── Dockerfile
├── frontend-admin/           # React admin dashboard (port 3001 in Docker / /admin in Replit)
│   ├── src/
│   │   ├── components/       # Navbar, Sidebar
│   │   ├── contexts/         # AuthContext (login state)
│   │   ├── pages/            # Dashboard, Bookings, Notifications, Login
│   │   ├── hooks/            # useApi, useAuth
│   │   └── types/            # TypeScript interfaces
│   ├── nginx.conf            # Nginx config for Docker (proxies /api to backend)
│   └── Dockerfile
├── docs/
│   └── API_DOCUMENTATION.md  # Full API reference
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB Atlas URI (or local MongoDB)

### Environment Variables

Copy `.env.example` to `.env` inside the `malaby/` folder and fill in your values:

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/malaby?retryWrites=true&w=majority
PORT=8000
NODE_ENV=development
CORS_ORIGIN=*
```

### Run in Development

```bash
# Backend (port 8000)
cd malaby/backend && npm install && npm run dev

# User frontend (port 5000)
cd malaby/frontend-user && npm install && npm run dev

# Admin dashboard (port 3001)
cd malaby/frontend-admin && npm install && npm run dev
```

### Seed Sample Data

```bash
cd malaby/backend
node seed.js    # Add sample pitches
node clean.js   # Remove all data
```

---

## Docker Deployment

### Requirements
- Docker and Docker Compose
- A `.env` file in `malaby/` with `MONGODB_URI` set

### Start all services

```bash
cd malaby
docker compose up --build -d
```

| Service | URL |
|---|---|
| User App | http://localhost:3000 |
| Admin Dashboard | http://localhost:3001 |
| Backend API | http://localhost:5000 |
| Health Check | http://localhost:5000/health |

### Stop all services

```bash
docker compose down
```

> **Note:** The Docker admin dashboard is built with `base: '/'` and served standalone by Nginx on port 3001. The Nginx configs in both frontends proxy `/api` requests to the backend container.

---

## Replit Deployment

On Replit, a single Express server serves everything on one port:

| Path | Content |
|---|---|
| `/` | User frontend |
| `/admin` | Admin dashboard |
| `/api/*` | Backend API |
| `/health` | Health check |

Build command: `cd malaby/frontend-user && npm run build && cd ../frontend-admin && npm run build`  
Run command: `cd malaby/backend && node server.js`

---

## API Overview

Full documentation: [`docs/API_DOCUMENTATION.md`](docs/API_DOCUMENTATION.md)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/pitches` | List all active pitches |
| GET | `/api/pitches/:id` | Get pitch details |
| GET | `/api/bookings/availability` | Get available slots (only confirmed block slots) |
| POST | `/api/bookings` | Create a new booking (pending) |
| GET | `/api/bookings` | List all bookings (admin) |
| PUT | `/api/bookings/:id/status` | Update booking status (admin) |
| PUT | `/api/bookings/:id/payment` | Upload payment screenshot |
| GET | `/api/notifications` | List admin notifications |

---

## Admin Access

Default credentials (hardcoded for demo — change before production):

| Field | Value |
|---|---|
| Username | `admin` |
| Password | `admin123` |

---

## Booking Status Flow

```
[User submits] → pending
                    ↓
         [Admin reviews on dashboard]
                    ↓
         confirmed ──────── cancelled
                    ↓
                completed (after booking date)
```

- `pending` → slot is still visible and bookable by other users
- `confirmed` → slot is blocked; no other booking can overlap
- `cancelled` → slot is released back as available
