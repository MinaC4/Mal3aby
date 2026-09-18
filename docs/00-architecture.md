# 00 — Architecture (current state + target shape)

## 1. Component diagram (today)
```
                         Internet
                            │
             ┌──────────────┴───────────────┐
             │                              │
   browser ──┤  frontend-user (nginx:80)    │
   (public)  │    /api/* proxy → api:5000   │
             └──────────────┬───────────────┘
                            │
             ┌──────────────┴───────────────┐        SAME Express app,
   browser ──┤  frontend-admin (nginx:80)   │        SAME routes, NO auth
   (admin)   │    /api/* proxy → api:5000   │        boundary between them
             └──────────────┬───────────────┘
                            ▼
                   ┌──────────────────┐
                   │ api (Express)    │ :5000
                   │ /api/pitches     │
                   │ /api/bookings    │
                   │ /api/notifications
                   └────────┬─────────┘
                            │ TLS outbound (public internet)
                            ▼
                   ┌──────────────────┐
                   │ MongoDB          │  (Atlas today; target: in-cluster StatefulSet)
                   └──────────────────┘
```

## 2. Request flow — public booking
1. `frontend-user` → `GET /api/pitches` (`HomePage.tsx:55`, `PitchesPage.tsx:8`) → api → Mongo.
2. `PitchDetailPage` → `GET /api/pitches/:id` and `TimeSlotPicker` → `GET /api/bookings/availability`
   (`TimeSlotPicker.tsx:45`).
3. `BookingForm` → `POST /api/bookings` (`BookingForm.tsx:41`) with express-validator checks
   (`routes/bookings.js:119-126`); overlap checked against confirmed bookings only; a `Notification` is created.
4. Customer pays externally and calls `PUT /api/bookings/:id/payment` with a free-text URL.

## 3. Request flow — admin confirming a booking
1. Admin opens `frontend-admin`, "logs in" via `AuthContext.login()` — a local string compare only.
2. `DashboardPage`/`BookingsPage` → `GET /api/bookings`, `GET /api/notifications`,
   `GET /api/notifications/stats/unread`.
3. `BookingsPage.handleStatusUpdate` → `PUT /api/bookings/:id/status {status}` (`BookingsPage.tsx:26`).
4. `NotificationsPage` → `PUT /notifications/:id/read`, `DELETE /notifications/:id`.
Every step in (2)-(4) is callable by anyone; the browser UI is the only thing hiding it.

## 4. Trust boundaries
| # | Boundary | Crosses | Enforcement today |
|---|----------|---------|-------------------|
| TB1 | Internet → SPAs | public HTTP | none (TLS/ingress not our layer yet) |
| TB2 | SPA → api | `/api/*` proxy | **none** |
| TB3 | api → Mongo | network + credentials | DB credentials in a plaintext `.env` |
| TB4 | Admin UI ↔ backend | same routes as public | **client-side only** (the core flaw) |
| TB5 | Build → image | `COPY . .` | `.dockerignore` incomplete for `.env` (latent) |

## 5. Secrets — today vs target
| Secret | Today | Target |
|---|---|---|
| `MONGODB_URI` | `.env` plaintext; passed as container env | Vault `malaby/data/<env>/api` → ESO → k8s Secret |
| JWT signing key | does not exist | Vault → ESO |
| Admin password | hardcoded `admin123` in JS bundle | bcrypt hash in Vault → ESO |
| Harbor/Jenkins/ArgoCD creds | operator-held | Jenkins Credentials (never in Git) |

## 6. Target k8s shape (dev/staging/prod, one namespace each)
- 3 Deployments + Services per env: `api`, `frontend-user`, `frontend-admin`.
- Frontend nginx `proxy_pass http://<api-svc>.<ns>.svc.cluster.local:5000/api/` — env-independent image.
- Same frontend image promotable across envs because `VITE_API_URL` stays unset → relative `/api`
  (already the code default, `useApi.ts:3`). This is the ADR that makes "build once, promote everywhere" true.
- MongoDB: `StatefulSet` + `local-path` PVC in dev (decision A: in-cluster, per operator).
- Ingress: Traefik, `malaby-<env>.<ip>.nip.io` and `malaby-admin-<env>.<ip>.nip.io`.

## 7. Decisions pending (see STATE.md / ADR-0001)
- GitOps topology: GitHub repo(s) + long-lived feature branch (operator directive).
- Secrets backend: Vault is **up and unsealed**; needs a token + additive mount to wire ESO.
- Repo layout: single GitHub repo with GitOps dirs vs. separate repos — to confirm.
