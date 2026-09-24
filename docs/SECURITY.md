# SECURITY — Control Catalogue

Each control maps to a threat-model finding (`docs/00-threat-model.md`) and a verification method.

| # | Control | Threat | Verification |
|---|---|---|---|
| C1 | Server-side JWT auth + `requireAdmin` on all admin routes | F1 | `docs/evidence/phase5-auth-fix.txt` (401 unauth, 200 with token) |
| C2 | bcrypt password hash + JWT secret in Vault (never in Git/bundle) | F1/F7 | `grep admin123` clean; gitleaks 0; Vault `malaby/data/dev/api` |
| C3 | Regex escaping + length cap in pitch search | F3 | `backend/tests/security.test.js`; `?search=.*` → 200 safe |
| C4 | Payment URL scheme validation | F4 | test + `PUT /:id/payment` invalid URL → 400 |
| C5 | Rate limiting (login/write/api) + `trust proxy: 2` (Traefik + nginx) | F5 | middleware; real client IP via X-Forwarded-For |
| C6 | helmet security headers on the API | F6 | `server.js`; headers present |
| C7 | Per-env CORS allowlist | F2 | Vault `CORS_ORIGIN`; `server.js` parses list |
| C8 | Vault → ESO secret delivery, `-eso` naming | F7 | `docs/03-secrets-management.md` (refresh + cross-env denial) |
| C9 | `.dockerignore` excludes `.env*` | F8 | real build shows no `.env` in image (`docs/phases/PHASE-2-REPORT.md`) |
| C10 | Images digest-pinned; SBOM; cosign sign/attest; verify in CI | F10/F18 | `docs/evidence/phase6-ci-success.txt` |
| C11 | Kyverno admission: labels/resources/probes/digest/registry/no-SA-token | F11/F14 | `docs/evidence/phase9-enforcement.txt` |
| C12 | Default-deny NetworkPolicy; no internet egress for api | F15/F20 | `docs/evidence/phase10-netpol-test.txt` |
| C13 | Falco runtime detection (shell/outbound/SA-token rules) | F17 | `docs/evidence/phase10-falco.txt` |
| C14 | Readiness reflects DB (`/ready`), health reports DB | F16 | `server.js`; probes target `/ready` |
| C15 | Dual-booking: partial unique index on `{pitch,bookingDate,timeSlot}` where `isBlocking:true` (equality filter) + whole-day overlap | correctness | `getIndexes()` + `docs/BUGFIXES.md` B1 |
| C16 | CI gates: gitleaks, lint, tests, SAST, SCA, SBOM, image scan, verify | F12/F18 | `docs/07-security-policy.md` |

## Known gaps (honest)
- Kyverno `malaby-restricted` is **Enforce** (non-root nginx/mongo/api + readOnlyRootFS). Only
  `malaby-verify-images` runs in **Audit** (Kyverno cannot verify over HTTP Harbor). See ISSUES I-17.
- Commits are **unsigned** (no GPG key yet, I-3).
- Vault is **dev-mode** (ephemeral); bootstrap is idempotent.
- ZAP DAST not executed (image pull); load baseline is a loaded-homelab number.
- Platform creds (Jenkins/Harbor) are weak/shared (operator-owned, flagged not changed).
