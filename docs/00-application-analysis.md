# 00 — Application Analysis (Malaby / ملعبي)

Read-only analysis. Sources cited by `path:line`. Verified 2026-09-18 against working tree.

## 1. Purpose
Football-pitch booking system. Public visitors browse pitches and create bookings; an admin
dashboard lists/confirm/cancels bookings and reads notifications. Three deployable units:
`api`, `frontend-user`, `frontend-admin`. No Redis/queue/gRPC; all traffic is JSON over HTTP.

## 2. Service: api (backend)
- Runtime: Node.js 20, Express 4, Mongoose 8 (`malaby/backend/package.json`).
- Entrypoint: `server.js`. Loads `../.env` explicitly (`server.js:8`), calls `connectDB()` (`:10`).
- Port: `process.env.PORT || 8000` (`server.js:89`); Dockerfile `EXPOSE 5000`; compose sets `PORT=5000`.
  **Port contract is inconsistent** (default 8000 vs image 5000). Must standardize in Phase 4.
- Serves: `/health`, `/api`, and mounts `routes/{pitches,bookings,notifications}` (`server.js:42-44`).
- In production also serves both SPA `dist/` trees on the **same process** (`server.js:62-77`).
  We deliberately keep the three services separate on k8s (ADR Phase 4).
- State: stateless process; all state in MongoDB.
- Failure mode: `connectDB()` swallows connection errors and does **not** exit (`config/db.js:12-16`).
  A pod can pass `/health` with no DB. Readiness design must account for this (Phase 4/5).
- Tests: none. `package.json` scripts = start/dev/seed only.

## 3. Service: frontend-user
- React 18 + Vite 5 + TS 5 + Tailwind. Multi-stage Docker: `node:20-alpine` builder → `nginx:alpine`
  (`frontend-user/Dockerfile:2,19`). Build `npm run build`; port 80.
- Nginx proxies `/api/` → `http://api:5000/api/` (Compose DNS name; `nginx.conf:14`). This is the
  config that must become a k8s Service DNS name in Phase 4.
- API base: `import.meta.env.VITE_API_URL || '/api'` (`src/hooks/useApi.ts:3`) — build-time var.
- One direct `fetch('/api/bookings/availability?...')` bypasses the helper (`components/TimeSlotPicker.tsx:45`),
  hardcoding the relative path. Harmless same-origin but inconsistent.
- Build emits **sourcemaps** (`vite.config.ts:25`) — info disclosure (finding F13).

## 4. Service: frontend-admin
- Same stack, plus shadcn-style components + Recharts. Docker build runs `npx vite build`, `base` overridden
  to `/` via `VITE_BASE_URL` (`vite.config.ts:8`; compose `docker-compose.yml:47`). Port 80.
- Nginx proxy identical (`frontend-admin/nginx.conf:14`).
- `sourcemap: false` (`vite.config.ts:31`) — correct.
- Calls the **same backend `/api`**. The only thing separating admin from public is which SPA is opened.

## 5. Data model (`models/`)
- `Pitch`: name, description, images[], pricePerHour, location, amenities[], weekly `availability[day].slots[time,available]`, rating, isActive.
- `Booking`: pitch(ref), customer{Name,Email,Phone}, bookingDate, timeSlot(string), duration(1-4), totalPrice, paymentScreenshot, paymentMethod enum, status enum, notes, `isBlocking` (true for confirmed/completed). **The original partial unique index used `$ne` in `partialFilterExpression`, which MongoDB does not support, so it silently failed to build** (verified with `getIndexes()`). Replaced by a partial unique index on `{pitch,bookingDate,timeSlot}` with `partialFilterExpression: { isBlocking: true }` (equality — supported) — the real DB-level double-booking guard.
- `Notification`: booking(ref), title, message, type enum, read, readAt.
- `seed.js`/`clean.js` are dev-only; seed uses `dotenv.config()` default path (inconsistent with server).

## 6. Access control reality (the core finding F1)
- **Backend has zero authentication/authorization middleware.** No session, token, API-key, or role check on any route.
- Admin-marked routes enforced nowhere: `GET /api/bookings`, `GET /api/bookings/:id`, `PUT/:id/status`,
  `DELETE/:id` (`routes/bookings.js:206,238,261,376`); all of `routes/notifications.js`.
- Only "auth" is client-side: `frontend-admin/src/contexts/AuthContext.tsx`.
  Hardcoded `ADMIN_USERNAME='admin'`, `ADMIN_PASSWORD='admin123'` (`:13-14`), boolean in `localStorage`.
- The credential is duplicated in **four** places: `AuthContext.tsx:14`, `hooks/useAuth.ts:9`,
  `pages/LoginPage.tsx:115` (renders it on screen), and `README.md:220`.
- The password ships inside the public JS bundle. Any `curl` reaches the admin API with no browser.

## 7. Other verified gaps (feed threat model)
- `routes/pitches.js:16,22`: user `search`/`location` interpolated straight into `$regex` — ReDoS + unintended match.
- `routes/bookings.js:336-347`: `PUT /:id/payment` takes arbitrary `paymentScreenshotUrl`; admin renders it as `<img src>` (stored-XSS/SSRF-adjacent).
- `server.js:22` CORS `origin: '*'` by default.
- No `helmet`, no rate limiting.
- `.dockerignore`: `malaby/.dockerignore:15` has `!.env`, but compose build contexts are `./backend`,
  `./frontend-user`, `./frontend-admin` — so the root file is unused. The **real** exposure is
  `malaby/backend/.dockerignore` not excluding `.env` while `backend/Dockerfile:14` runs `COPY . .`.
  No `.env` is present locally today (latent, not active).
- Base images `node:20-alpine`, `nginx:alpine` unpinned (no digests).
- Nginx containers run as root; no securityContext anywhere.
- No resource requests/limits/probes (no k8s manifests exist at all).
- time-slot format mismatch: seed/UI use `"08:00 AM"`; `routes/bookings.js:10-33` parse 24h `"HH:MM"`,
  so `addHoursToTime`/`timeToMinutes` produce `NaN` for PM strings → overlap checks can misbehave.
  (Business-logic bug; recorded, not silently changed — out of remediation scope unless it breaks gating.)

## 8. Build/Deliverable reality
- No Kustomize/Helm/manifests anywhere. `docker-compose.yml` is the only topology document.
- No `npm test` in any service. `frontend-*/dist/` are checked-in build artifacts — not source of truth.
- Root `package.json` orchestrates start/build across sub-projects.
