# Review Remediation (Claude report, 21 Sep 2026)

Every finding from the external review, verified against the code and the live cluster, then fixed
(or explicitly deferred with reason). Legend: **FIXED** (with evidence) · **DEFERRED** (needs operator
action) · **ACCEPTED** (design trade-off).

| # | Finding | Status | What was done / evidence |
|---|---|---|---|
| M-01 | `/availability` DoS via negative `duration` | **FIXED** | `routes/bookings.js` now validates `duration` 1–4, `date` YYYY-MM-DD, `pitchId` ObjectId. Live: `duration=-1000000 → 400`, `duration=2 → 200`. Unit test `tests/validation.test.js`. |
| M-02 | Public `PUT /:id/payment` resets status | **FIXED** | Endpoint now only touches `pending` bookings and never changes `status`. Live: payment on a confirmed booking → `409`. |
| M-03 | `trust proxy=1` behind two proxies | **FIXED** | `server.js` → `trust proxy = 2` (Traefik + nginx), so the real client IP is used by the rate limiter. |
| M-04 | DB double-booking index silently absent (`$ne` filter) | **FIXED** | Confirmed absent via `getIndexes()`. Replaced with `isBlocking` field + partial unique index `{pitch,bookingDate,timeSlot}` where `isBlocking:true` (equality — supported). Live `getIndexes()` shows the index. |
| M-05 | CI security checks non-blocking | **FIXED (code)** | Jenkinsfile: semgrep fails on `--error`; trivy fs/image `--exit-code 1 --severity CRITICAL --ignore-unfixed`. A CI run is needed to confirm green. |
| M-06 | GitOps update stage was a broken scaffold | **FIXED (honest)** | Stage 12 no longer calls a non-existent shell command; it states that promotion is a reviewed digest-pinning PR. Documented in `docs/08-gitops.md`. |
| M-07 | CI tools on floating tags; Kaniko archived | **FIXED** | Pinned: gitleaks v8.28.0, semgrep 1.95.0, trivy 0.57.1, syft v1.18.0-debug, kaniko v1.23.2-debug, cosign `sha256-…` tag. |
| M-08 | Kyverno registry prefix loophole + no initContainers | **FIXED** | `malaby-restrict-registry` now matches `mongo:`/`mongo@` exactly (not the `mongo` prefix) and covers `initContainers`. |
| M-09 | `ADMIN_PASSWORD` in pod env; bootstrap missing hash | **FIXED** | Removed `ADMIN_PASSWORD` from the ExternalSecret; `vault-bootstrap.sh` now writes `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH` (bcrypt) and a per-env `CORS_ORIGIN`. |
| M-10 | Weak trust roots (Jenkins/Harbor creds, Vault dev-mode) | **DEFERRED** | Operator-owned; flagged in ISSUES I-6/I-11. Cosign key rotated after a Vault dev-mode loss (see below). |
| M-11 | Jenkins agent SA over-privileged + token mounted | **FIXED** | All `ci/agents/pod-*.yaml` now set `automountServiceAccountToken: false`. |
| M-12 | Single admin, JWT in localStorage, no audit, no login-failure metric | **PARTIAL** | Login-failure counter + audit log remain follow-ups (tracked). |
| M-13 | No MongoDB backup | **FIXED** | New `gitops/base/mongodb-backup.yaml` — daily `mongodump` CronJob to a 1Gi PVC with 7-day retention. |
| M-14 | Node 20 EOL; unused `multer`/`uuid` | **FIXED** | Removed unused `multer` and `uuid` (verified not imported). Node 22 upgrade is a follow-up. |
| M-15 | HTTP-only (no TLS) | **ACCEPTED + documented** | Added to README "Honest limitations"; TLS needs cert-manager (operator). |
| M-16 | Thin tests | **IMPROVED** | Added `tests/validation.test.js` (duration/date). Integration tests for routes remain a follow-up. |
| M-17 | Alert uses cumulative counter; scope | **FIXED** | `MalabyKyvernoPolicyFailures` now uses `increase(...[15m])` scoped to `namespace="malaby-dev"`. |
| M-18 | Misc (metric cardinality, SIGTERM, pagination) | **PARTIAL** | Route label fixed to `unmatched`; SIGTERM graceful shutdown added. Pagination/CAPTCHA/PDB remain follow-ups. |
| M-19 | Unexplained p50=1.4s; CPU 250m/500m contradiction | **FIXED (doc)** | `docs/METRICS.md` corrected (limit is 500m) with a re-measure plan. |

## Verification (live)
- `getIndexes()` → `pitch_1_bookingDate_1_timeSlot_1` unique, partial `{isBlocking:true}`.
- `duration=-1000000 → 400`; `duration=2 → 200`.
- payment on confirmed booking → `409`.
- Smoke test **6/6 PASS** on the remediated image.
- `npm test` → **13/13**.
- All three deployed images re-signed and verified against the published `security/cosign.pub`.

## Note — Vault dev-mode incident during remediation
Vault (dev-mode) lost the `malaby/` mount again; the cosign private key was gone. Recovery: recreated the
mount and **restored the current API/Mongo secret values from Kubernetes** (so Mongo did not break),
generated a new cosign keypair (Vault + Jenkins credentials + `security/cosign.pub`), and re-signed the
three deployed images. This reinforces M-10: Vault must move to persistent storage (operator).

## Still requiring a CI run / operator
- M-05: run `malaby-ci` on `main` to confirm the tightened gates are green and re-sign the CI images.
- M-10/M-15: Vault persistence + TLS (cert-manager) are operator/infrastructure changes.
