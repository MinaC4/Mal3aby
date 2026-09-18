# Bugfix report — admin & user frontends (+ supporting backend)

Full line-by-line audit of `frontend-admin/src/**` and `frontend-user/src/**`, plus the backend
time logic they depend on. Date: 2026-09-18.

## Critical (functional, data-affecting)

| # | Where | Bug | Fix |
|---|---|---|---|
| B1 | `backend/routes/bookings.js` | Double-booking allowed: overlap check matched `bookingDate` with **exact equality**, but seeded bookings store a full timestamp (`...T23:25:35Z`), so the same calendar day never matched → a second booking in the same slot succeeded | Match the whole UTC day (`utcDayRange`) in POST create and PUT confirm |
| B2 | `backend/routes/bookings.js`, `routes/pitches.js` | `addHoursToTime`/`timeToMinutes` split on `:` and `Number()`s the remainder → legacy `"06:00 PM"` produced `NaN`, silently disabling overlap detection | Shared `backend/utils/time.js` parses both `HH:MM` and `HH:MM AM/PM` |
| B3 | `backend/routes/*` | Day ranges built with `setHours()` on a UTC-parsed date → timezone off-by-one; the admin date filter even reused one Date object for both bounds | `utcDayRange()` builds explicit UTC bounds (accepts Date or string) |

## Admin dashboard

| # | Bug | Fix |
|---|---|---|
| A1 | Blank white screen in production (router `basename` hardcoded `/admin`) | `basename={import.meta.env.BASE_URL}` |
| A2 | Admin assets 404 → HTML (wrong Vite base) | Dockerfile now declares/forwards `VITE_BASE_URL`; base `/` |
| A3 | Login screen printed the demo credential `admin/admin123` | Removed the block |
| A4 | Duplicate dead auth hook `hooks/useAuth.ts` with hardcoded creds | Deleted |
| A5 | Fake operational trends `+12%` / `+8%` on the dashboard | Removed (real values only) |
| A6 | "Cancel" action offered on **completed** bookings | Restricted to pending/confirmed |
| A7 | Mobile sidebar toggle used the dashboard icon instead of a menu icon | Use `Menu` |
| A8 | Garbled time display for legacy 12h bookings | Robust `formatTime12Hour`/`formatTimeRange` |
| A9 | Admin build ran `npx vite build` (skipped typecheck) | Now `npm run build` (tsc enforced) |

## User app

| # | Bug | Fix |
|---|---|---|
| U1 | Quick-booking accepted an arbitrary `<input type="time">` value that is not a real slot, and navigated with no date | Date-only quick booking; time is chosen from real slots; date required |
| U2 | Success page showed raw 24h time | `formatTime12Hour` |
| U3 | Date `min` used `toISOString()` (UTC) → off-by-one near midnight | `todayLocalISO()` |
| U4 | Broken image when a pitch has no images | Fallback image |
| U5 | `TimeSlotPicker` hardcoded `/api`; no request cancellation on rapid changes | `API_BASE_URL` + `AbortController` |
| U6 | Home stats were fictional (`50+`, `10K+`, `5K+`, `+12%`) | Derived from real data: pitch count, city count, average rating, starting price |
| U7 | Dead identity `formatTime` util | Removed |

## Verification (real)
```
node: addHoursToTime('06:00 PM',1) -> 19:00 ; timeToMinutes('06:00 PM') -> 1080

API double-book (previously 201):
  POST /api/bookings {"timeSlot":"18:00", same pitch/date as a confirmed legacy booking}
  -> {"success":false,"message":"This time slot is already booked (06:00 PM - 20:00). ..."}

API availability same day:
  18:00 isAvailable=false (conflictsWith 06:00 PM–20:00)
  19:00 isAvailable=false
  20:00 isAvailable=true

Builds: backend node --check OK; both frontends `tsc` OK; images rebuilt/pushed/rolled out.
Visual: admin login page renders with NO credentials shown; user home renders.
```
> Note: headless screenshots of pages whose content is wrapped in entry animations capture the
> first animation frame (opacity 0), so some screenshots look empty; static pages render normally.
> This is a screenshot-timing artifact, not a runtime bug.

## Deliberately NOT in this batch (Phase 5 security scope)
Server-side auth (`requireAdmin` + JWT), removing the client-side auth entirely, regex escaping,
rate limiting, `helmet`, payment-URL validation, sourcemap removal. These are the mandated Phase 5
changes and are tracked separately.
