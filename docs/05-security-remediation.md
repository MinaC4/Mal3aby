# 05 — Application Security Remediation

Closes finding **F1** (and companions F2/F3/F4/F5/F6/F13) from the threat model. Date: 2026-09-18.

## What changed (backend)
| Control | Implementation |
|---|---|
| Server-side auth | `POST /api/auth/login` verifies `ADMIN_USERNAME` + **bcrypt** `ADMIN_PASSWORD_HASH` (both from Vault via ESO) and issues a JWT signed with `JWT_SECRET` (Vault) |
| AuthZ middleware | `middleware/requireAdmin.js` — `401` when the `Authorization: Bearer` header is absent, `403` when the token is invalid/expired or lacks `role=admin`. Applied to every admin route (`GET/PUT/DELETE /api/bookings*`, **all** `/api/notifications*`) |
| Regex injection (F3) | `routes/pitches.js` escapes user input (`escapeRegex`) and caps length at 100 chars |
| Payment URL (F4) | `PUT /:id/payment` rejects anything that is not a valid `http(s)` URL (`validateHttpUrl`) |
| CORS (F2) | `CORS_ORIGIN` is now an explicit comma-separated allowlist (Vault `malaby/data/dev/api`) instead of `*` |
| Headers (F6) | `helmet()` on the API process |
| Rate limiting (F5) | `express-rate-limit`: broad on `/api`, stricter on writes and login |
| Readiness | `/health` reports DB state; new `/ready` returns `503` when Mongo is not connected; readiness probe now targets `/ready` |

## What changed (frontend-admin)
- `AuthContext` no longer contains any credential. It calls `apiLogin`, stores **only the JWT** (`localStorage`), and clears it on logout.
- `useApi` attaches `Authorization: Bearer …` to every admin request; a `401/403` clears the token and emits `malaby:unauthorized`, which returns the UI to the login screen.
- The login screen no longer displays demo credentials.
- `LoginPage` awaits the real login endpoint (no fake `setTimeout`).

## What changed (frontend-user)
- Production sourcemaps disabled (`vite.config.ts: sourcemap: false`).

## Tests (`malaby/backend`, `npm test`)
11 tests, all passing (`node --test`):
- `tests/time.test.js` — 12h/24h parsing, overlap logic, UTC day ranges
- `tests/security.test.js` — `escapeRegex`, `validateHttpUrl` (rejects `javascript:`/`ftp:`/malformed)
- `tests/requireAdmin.test.js` — 401 no token, 403 invalid, 403 wrong role, 200 valid + `req.admin`

## Before → After (real transcripts: `docs/evidence/phase5-auth-fix.txt`)
| Call (no credentials) | Phase 4 | Phase 5 |
|---|---|---|
| `GET /api/bookings` | **200** (all PII) | **401** |
| `GET /api/notifications` | **200** | **401** |
| `PUT /api/bookings/:id/status` | **200** (state change) | **401** |
| `DELETE /api/notifications/:id` | **200** (deleted) | **401** |
| `POST /api/bookings` (public) | 201 | 201 (unchanged) |
| `POST /api/auth/login` wrong password | n/a | **401** |
| `POST /api/auth/login` correct | n/a | **200 + JWT** |
| `GET /api/bookings` with token | n/a | **200** |
| `PUT /:id/status` with token | n/a | **200** |
| `GET /api/pitches?search=.*` | unescaped | 200, escaped |
| `PUT /:id/payment` invalid URL | accepted | **400** |

## Credential handling
- The admin password was generated in Phase 3 and lives only in Vault (`malaby/data/dev/api`,
  `ADMIN_PASSWORD`); the app uses only the bcrypt hash (`ADMIN_PASSWORD_HASH`). To retrieve it for login:
  `vault kv get malaby/dev/api` (operator only). No credential exists in Git or in the JS bundle.
- The old client-side check and the `admin/admin123` constant are gone from the codebase
  (`grep -rIn "admin123" malaby` now matches only the README/API docs, fixed in Phase 14 docs pass).

## Not done here (later phases)
Image signing/SBOM (7), GitOps (8), Kyverno enforcement of non-root/readOnlyRootFilesystem (9),
NetworkPolicy default-deny (10), DAST re-verification (11). Repository/CI wiring of `npm test` is Phase 6.
