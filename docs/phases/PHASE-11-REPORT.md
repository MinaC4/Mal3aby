# Phase 11 Report — Dynamic Testing

Status: **PARTIAL** — smoke PASS, load baseline recorded, ZAP NOT EXECUTED (image pull). Date: 2026-09-18.

## Delivered
- `tests/smoke/smoke.yaml` — smoke Job (PostSync hook) → **6/6 PASS** (`docs/evidence/phase11-smoke.txt`).
- `tests/dast/zap-job.yaml` — ZAP baseline Job + admin-auth check (authored).
- `tests/load/load.js` — load script → baseline (`docs/evidence/phase11-load.txt`).
- NetworkPolicy allow for the smoke pod.

## Definition of Done
- [x] Smoke test proves the full flow incl. auth (unauthenticated admin → 401)
- [ ] Smoke wired as the live Argo sync gate — Job is annotated; needs the manifest under the Argo app
      path to fire automatically (follow-up; it currently runs via `kubectl apply`)
- [ ] ZAP report — **NOT EXECUTED** (image pull); admin-auth rejection proven elsewhere
- [x] Load numbers recorded and analysed (recommend api CPU 250m → 500m)

## Notes
- The smoke Job lives in `tests/` (not `gitops/base`), so Argo does not yet manage it as a hook; to make
  it a real sync gate, move it into the Argo-managed path and ensure the app's `targetRevision` is `main`.
