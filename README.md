# ملعبي (Mal3aby) — Football Pitch Booking Platform

<div align="center">

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://mongodb.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

**A full-stack football pitch booking platform with real-time availability, an admin dashboard, and a modern glassmorphism UI.**

</div>

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [API Reference](#api-reference)
- [Data Models](#data-models)
- [Booking Flow](#booking-flow)
- [Project Structure](#project-structure)
- [Development Setup](#development-setup)
- [Production Deployment](#production-deployment)
- [Design System](#design-system)

---

## Overview

**Mal3aby (ملعبي)** connects football pitch owners with players through a streamlined booking experience. Users browse pitches, see real-time slot availability, and complete bookings online. Admins manage everything through a dedicated dashboard.

The platform has three services that work together:

| Service | Purpose | Port (dev) | URL (prod) |
|---|---|---|---|
| User Frontend | Customer-facing booking app | 5000 | `/` |
| Admin Dashboard | Pitch management & bookings | 3001 | `/admin` |
| Backend API | REST API + MongoDB | 8000 | `/api` |

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    PRODUCTION (port 5000)                 │
│                                                          │
│   /          → User Frontend (React static build)        │
│   /admin     → Admin Dashboard (React static build)      │
│   /api       → REST API (Express routes)                 │
│   /health    → Health check endpoint                     │
│                                                          │
│                  [ Node.js / Express ]                   │
│                        │                                 │
│               [ MongoDB Atlas ]                          │
└──────────────────────────────────────────────────────────┘

DEVELOPMENT:
  frontend-user  → localhost:5000  (Vite dev server, proxies /api → 8000)
  frontend-admin → localhost:3001  (Vite dev server, proxies /api → 8000)
  backend        → localhost:8000  (nodemon)
```

---

## Features

### User App (`/`)
- **Homepage** — Hero image section, platform stats (sparkline widgets), featured pitches
- **Pitches listing** — Browse all active pitches with search and filtering
- **Pitch detail page** — Image gallery with thumbnails, amenities, pricing, quick-booking widget
- **Real-time availability picker** — Visual time slot grid showing available (green) vs booked (red) slots; clicking a booked slot shows which time range is already taken
- **Booking form** — Full form (name, email, phone, date, duration, time slot, payment method, notes)
- **Booking success page** — Booking summary with payment instructions
- **Dark mode** — True-black glassmorphism design with toggle in navbar

### Admin Dashboard (`/admin`)
- **Login page** — Credentials: `admin` / `admin123`
- **Dashboard** — Total bookings, revenue, active pitches, pending count
- **Bookings management** — Table with search/filter, confirm/cancel actions, detail modal with payment screenshot
- **Notifications** — Real-time list of new bookings, confirmations, payment receipts
- **Sidebar logout** — Works correctly across all components (shared `AuthContext`)

---

## Tech Stack

| Layer | Technology |
|---|---|
| User & Admin Frontend | React 18 · TypeScript · Vite · Tailwind CSS · React Router v6 · Lucide Icons |
| Backend | Node.js · Express.js · Mongoose · express-validator |
| Database | MongoDB Atlas |
| Deployment | Replit Autoscale (single process, multi-port in dev) |

---

## API Reference

**Base URL (dev):** `http://localhost:8000/api`
**Base URL (prod):** `https://your-app.replit.app/api`

### Pitches

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/pitches` | List all active pitches |
| `GET` | `/pitches/:id` | Get single pitch details |
| `POST` | `/pitches` | Create pitch |
| `PUT` | `/pitches/:id` | Update pitch |
| `DELETE` | `/pitches/:id` | Delete pitch |

### Bookings

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/bookings` | List all bookings (admin) |
| `GET` | `/bookings/availability` | **Real-time slot availability** |
| `POST` | `/bookings` | Create new booking |
| `GET` | `/bookings/:id` | Get single booking |
| `PUT` | `/bookings/:id/status` | Update booking status |
| `PUT` | `/bookings/:id/payment` | Upload payment screenshot URL |
| `DELETE` | `/bookings/:id` | Delete booking |

#### `GET /bookings/availability`

Returns hourly time slots for a given pitch and date, marking each as available or booked.

**Query Parameters:**

| Param | Type | Required | Description |
|---|---|---|---|
| `pitchId` | string | ✅ | MongoDB ObjectId of the pitch |
| `date` | string | ✅ | Date in `YYYY-MM-DD` format |
| `duration` | number | — | Requested duration in hours (default: 1) |

**Example Request:**
```
GET /api/bookings/availability?pitchId=69fcfbad70b945fb2759c016&date=2026-05-10&duration=2
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "slots": [
      {
        "time": "06:00",
        "endTime": "08:00",
        "isAvailable": true,
        "conflictsWith": []
      },
      {
        "time": "14:00",
        "endTime": "16:00",
        "isAvailable": false,
        "conflictsWith": [
          { "from": "13:00", "to": "15:00" }
        ]
      }
    ],
    "bookedRanges": [
      { "from": "13:00", "to": "15:00" }
    ],
    "date": "2026-05-10"
  }
}
```

**Slot generation rules:**
- Slots run from `06:00` to `(24 - duration):00` so no slot ends past midnight
- A slot is unavailable if booking it (for the requested duration) would **overlap** with any existing non-cancelled booking
- Overlap logic: `startA < endB AND endA > startB`

### Notifications

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/notifications` | List all notifications |
| `GET` | `/notifications/stats/unread` | Unread count |
| `PUT` | `/notifications/:id/read` | Mark as read |
| `DELETE` | `/notifications/:id` | Delete notification |

**Health Check:** `GET /health`

---

## Data Models

### Pitch

```javascript
{
  name: String,                    // required
  description: String,             // required
  images: [String],                // array of image URLs
  pricePerHour: Number,            // required, min 0
  location: String,                // required
  amenities: [String],             // e.g. ['إضاءة', 'مياه', 'دش']
  availability: [{
    day: String,                   // 'Saturday' | 'Sunday' | ... | 'Friday'
    slots: [{ time: String, available: Boolean }]
  }],
  rating: Number,                  // 0–5, default 0
  isActive: Boolean                // default true
}
```

### Booking

```javascript
{
  pitch: ObjectId,                 // ref: Pitch
  customerName: String,            // required
  customerEmail: String,           // required, lowercase
  customerPhone: String,           // required
  bookingDate: Date,               // required
  timeSlot: String,                // 'HH:MM' e.g. '14:00'
  duration: Number,                // 1–4 hours, default 1
  totalPrice: Number,              // pricePerHour × duration
  paymentMethod: String,           // 'vodafone_cash' | 'instapay' | 'cash'
  paymentScreenshot: String,       // URL after upload
  status: String,                  // 'pending' | 'confirmed' | 'cancelled' | 'completed'
  notes: String                    // optional
}
```

Indexes:
- Partial unique index on `(pitch, bookingDate, timeSlot, status)` — excludes cancelled bookings
- Regular index on `(pitch, bookingDate, status)` for fast availability queries

### Notification

```javascript
{
  booking: ObjectId,               // ref: Booking
  title: String,
  message: String,
  type: String,                    // 'new_booking' | 'booking_confirmed' | 'booking_cancelled' | 'payment_received'
  read: Boolean,                   // default false
  readAt: Date
}
```

---

## Booking Flow

```
Homepage
  └─► Browse Pitches (/pitches)
        └─► Pitch Detail (/pitches/:id)
              ├─ View image gallery, amenities, price
              ├─ Quick booking widget (pick date + time)
              └─► Booking Page (/booking/:pitchId)
                    ├─ Fill: name, email, phone
                    ├─ Pick: date, duration
                    ├─ [API] GET /bookings/availability
                    │         ↓ returns slot grid
                    ├─ Pick: available time slot (green ✓)
                    │   OR   blocked slot (red ✗) → shows conflict info in Arabic
                    ├─ Pick: payment method
                    ├─ [API] POST /bookings
                    └─► Booking Success (/booking-success)
                          └─ User sends payment transfer + screenshot
```

---

## Admin Workflow

```
/admin (Login page)
  └─► Dashboard
        ├─ Stats: total bookings, revenue, pitches, pending
        ├─► Bookings Tab
        │     ├─ Search / filter by status
        │     ├─ View booking detail modal (customer info, payment screenshot)
        │     ├─ Confirm booking → [API] PUT /bookings/:id/status
        │     └─ Cancel booking → [API] PUT /bookings/:id/status
        └─► Notifications Tab
              ├─ New booking alerts
              ├─ Payment receipt notifications
              ├─ Mark as read / Delete
              └─ Unread badge shown in navbar
```

---

## Project Structure

```
malaby/
├── README.md
│
├── backend/
│   ├── server.js                      # Express app entry, static file serving in prod
│   ├── seed.js                        # Database seeder (4 sample pitches)
│   ├── config/
│   │   └── db.js                      # MongoDB Atlas connection via Mongoose
│   ├── middleware/
│   │   └── errorHandler.js            # Global Express error handler
│   ├── models/
│   │   ├── Pitch.js                   # Pitch schema + timeSlot subdocuments
│   │   ├── Booking.js                 # Booking schema + partial unique index
│   │   └── Notification.js            # Notification schema
│   └── routes/
│       ├── pitches.js                 # CRUD for pitches
│       ├── bookings.js                # Bookings + /availability endpoint + overlap detection
│       └── notifications.js           # Notifications CRUD + unread stats
│
├── frontend-user/
│   └── src/
│       ├── components/
│       │   ├── Navbar.tsx             # Navigation + dark mode toggle
│       │   ├── Footer.tsx             # Site footer
│       │   ├── PitchCard.tsx          # Pitch card in listing
│       │   ├── BookingForm.tsx        # Full booking form (uses TimeSlotPicker)
│       │   └── TimeSlotPicker.tsx     # Visual availability grid component
│       ├── pages/
│       │   ├── HomePage.tsx           # Hero + stats widgets + featured pitches
│       │   ├── PitchesPage.tsx        # All pitches listing with search
│       │   ├── PitchDetailPage.tsx    # Single pitch detail + quick booking
│       │   ├── BookingPage.tsx        # Full booking page wrapper
│       │   └── BookingSuccessPage.tsx # Post-booking confirmation
│       ├── hooks/
│       │   └── useApi.ts              # Generic fetch hook + apiPost/apiPut/apiDelete helpers
│       ├── lib/
│       │   └── theme.tsx              # ThemeContext — dark mode state + localStorage
│       ├── types/
│       │   └── index.ts               # TypeScript interfaces: Pitch, Booking, Notification, etc.
│       └── utils/
│           └── timeFormat.ts          # formatTimeRange, formatTime12Hour helpers
│
└── frontend-admin/
    └── src/
        ├── components/
        │   ├── Sidebar.tsx            # Nav sidebar with logout button
        │   └── Navbar.tsx             # Top bar with date + notification badge
        ├── contexts/
        │   └── AuthContext.tsx        # React Context for shared auth state (login/logout)
        ├── pages/
        │   ├── LoginPage.tsx          # Admin login form
        │   ├── DashboardPage.tsx      # Stats cards overview
        │   ├── BookingsPage.tsx       # Bookings table with filter + detail modal
        │   └── NotificationsPage.tsx  # Notifications list
        └── hooks/
            └── useApi.ts              # Admin fetch hook (same /api pattern)
```

---

## Development Setup

### Prerequisites
- Node.js 18+
- npm
- MongoDB Atlas account (or local MongoDB)

### 1. Install dependencies

```bash
cd malaby/backend       && npm install
cd malaby/frontend-user  && npm install
cd malaby/frontend-admin && npm install
```

### 2. Set environment variable

The `MONGODB_URI` secret must be set in your environment:
```
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/malaby
```

### 3. Seed the database (optional)

```bash
cd malaby/backend
node seed.js
```

Creates 4 sample pitches: ملعب النجوم, ملعب القمة, ملعب الذهب, ملعب البطل.

### 4. Start all three services

```bash
# Terminal 1
cd malaby/backend && npm run dev          # port 8000

# Terminal 2
cd malaby/frontend-user && npm run dev    # port 5000

# Terminal 3
cd malaby/frontend-admin && npm run dev   # port 3001
```

### Admin credentials
```
Username: admin
Password: admin123
```

---

## Production Deployment

Configured for **Replit Autoscale**.

### Build command
```bash
cd malaby/frontend-user && npm run build && cd ../frontend-admin && npm run build
```

### Run command
```bash
cd malaby/backend && NODE_ENV=production node server.js
```

In production, the single Express server on **port 5000** serves:
- `GET /admin/*` → `frontend-admin/dist/index.html` (SPA fallback)
- `GET /api/*` → Express REST routes
- `GET /*` → `frontend-user/dist/index.html` (SPA fallback)

The admin dashboard React Router uses `basename="/admin"` in production (`import.meta.env.PROD`).

---

## Design System

### Color Palette (User Frontend)

| Token | Value | Usage |
|---|---|---|
| `emerald-500` | `#10b981` | Primary actions, accents, selected states |
| `dark-950` | `#000000` | True black background (dark mode) |
| `dark-900` | `#0a0a0a` | Page background (dark mode) |
| `dark-800` | `#111111` | Card background (dark mode) |
| `dark-700` | `#1a1a1a` | Secondary surfaces (dark mode) |
| `dark-600` | `#242424` | Borders, dividers (dark mode) |

### Glassmorphism Cards

```css
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
}
```

### Animations

| Class | Effect |
|---|---|
| `animate-fade-in` | Opacity 0→1 (0.5s) |
| `animate-fade-in-up` | Opacity + translateY (0.5s) |
| `animate-float` | Gentle up/down bob (3s loop) |
| `animate-shimmer` | Skeleton loading shimmer |

### TimeSlotPicker States

| State | Color | Meaning |
|---|---|---|
| Available | Emerald border + bg | Slot is free for the selected duration |
| Booked | Red border + bg | Slot overlaps with existing booking |
| Selected | Solid emerald | User's chosen slot |

---

## Key Implementation Details

### Overlap Detection Algorithm

Used in both booking creation (`POST /bookings`) and availability calculation (`GET /bookings/availability`):

```javascript
function hasTimeOverlap(start1, duration1, start2, duration2) {
  const end1 = addHoursToTime(start1, duration1);
  const end2 = addHoursToTime(start2, duration2);

  const start1Min = timeToMinutes(start1);
  const end1Min   = timeToMinutes(end1);
  const start2Min = timeToMinutes(start2);
  const end2Min   = timeToMinutes(end2);

  // Overlap if: start1 < end2 AND end1 > start2
  return (start1Min < end2Min && end1Min > start2Min);
}
```

This correctly handles all cases:
- Exact same time slot
- One booking fully inside another
- Partial overlaps at start or end
- Cancelled bookings are excluded from all checks

### Auth Context Pattern

The admin dashboard uses React Context to share auth state across all components. Previously, each component called `useAuth()` independently which caused the logout in `Sidebar` not to reflect in `App`. Fix:

```tsx
// main.tsx — single AuthProvider wraps entire app
<BrowserRouter basename={...}>
  <AuthProvider>
    <App />
  </AuthProvider>
</BrowserRouter>

// AuthContext.tsx — single source of truth for isAuthenticated
const AuthContext = createContext<AuthContextValue | null>(null);
export function useAuth() {
  return useContext(AuthContext)!;
}
```

### API Proxy (Development)

Both Vite dev servers proxy `/api` to the backend to avoid CORS issues:

```typescript
// vite.config.ts (both frontends)
server: {
  proxy: {
    '/api': { target: 'http://localhost:8000', changeOrigin: true }
  }
}
```

Both frontends hardcode `const API_BASE_URL = '/api'` — no environment variables needed.
