# Phase 4 Report — Baseline Deployment (dev)

Status: **COMPLETE**. Date: 2026-09-18.

## What ran
- Built and pushed 3 images from **unmodified** source to Harbor project `malaby`:
  - api `sha256:b9590956…`, frontend-user `sha256:741ec6f4…`, frontend-admin `sha256:bb0b0540…`
- Created Harbor project `malaby` (set public for baseline pull; pull-robot planned Phase 7).
- Applied `gitops/base/{mongodb,api,frontend-user,frontend-admin,ingress}.yaml` into `malaby-dev`.
- Seeded 4 pitches / 3 bookings / 3 notifications.

## Evidence
- All pods `1/1 Running`; deployments available; ingress routes both hosts (`200`).
- api connected to in-cluster MongoDB.
- Smoke: public `POST /api/bookings` → 201; visible on the admin host unauthenticated.
- **Exploit:** `docs/evidence/phase4-unauth-exploit.txt` — list PII, read notifications, confirm a
  booking, and delete a notification, all with **no credentials**.
- Resources: ~53m CPU / ~157Mi actual vs ~7.8Gi free.

## Definition of Done
- [x] All three Deployments Ready
- [x] Booking via frontend-user visible in frontend-admin
- [x] Unauthenticated exploit proven with real curl output
- [x] Nothing outside `malaby-dev` touched (Harbor project `malaby` is new)
- [x] Time-boxed exception EXC-0001 recorded

## Deviations / notes
- **No nginx.conf change needed**: naming the Service `api` makes the Compose hostname resolve in k8s,
  keeping the baseline images unmodified.
- Harbor project made public for baseline pulls (nodes have no imagePullSecret); tightened in Phase 7.
- Phase 3 already created the namespace; Phase 4 added workloads.
- `mongo:7.0` is pulled from docker.io (matches the existing `eshtry-mny` pattern); mirroring/pinning to
  Harbor is Phase 7/9 work.

## Next
Phase 5 — real server-side auth (`requireAdmin` + JWT), regex/rate-limit/helmet fixes, tests; then
re-run this exact exploit to prove `401`/`403` and a legitimate login succeeding.
