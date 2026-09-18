# Phase 5 Report — Critical Application Security Remediation

Status: **COMPLETE**. Date: 2026-09-18.

## Delivered
- Real JWT auth + `requireAdmin` on every admin route; bcrypt password hash + JWT secret from Vault via ESO.
- Regex escaping, payment-URL validation, explicit CORS allowlist, `helmet`, rate limiting.
- Admin UI now performs a real login and sends `Authorization` on every call; no credentials in code.
- User app sourcemaps disabled.
- `npm test` for the backend: **11 tests, all passing**.
- Re-ran the Phase 4 exploit: unauthenticated admin calls now return **401**; a legitimate login returns a
  token and the same calls then succeed; the public booking flow still returns **201**.

## Evidence
- `docs/evidence/phase5-auth-fix.txt` (real transcripts).
- `docs/05-security-remediation.md` (change catalogue).
- Tests: `malaby/backend/tests/*.test.js`.

## Created / changed objects
- New images (digests pinned in `gitops/base/`): api `sha256:a18ca59f…`, frontend-admin `sha256:985f15ea…`,
  frontend-user `sha256:639e2bc3…`.
- Vault `malaby/data/dev/api` gained `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`; `CORS_ORIGIN` now an allowlist.
- ExternalSecret `api-secrets-eso` extended with the two new keys.

## Definition of Done
- [x] Phase 4 exploit no longer works — proven (401), not asserted
- [x] Legitimate admin login works end to end (JWT → 200)
- [x] `npm test` exists and passes (11/11)
- [x] No hardcoded credential remains (removed client-side check and constant)
- [x] Timezone/overlap corollary fix retained (F19-adjacent)

## Notes / deviations
- The Phase 4 exception EXC-0001 is **closed** (not merely expired) in `security/exceptions.yaml`.
- The admin password is still stored as plaintext in Vault for operator retrieval; the app consumes only
  its bcrypt hash. Documented as an accepted homelab convenience.
- Signing keys for GPG/cosign remain an open operator decision (ISSUES I-3/I-12); cosign is Phase 7.
