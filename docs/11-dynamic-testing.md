# 11 — Dynamic Testing (smoke, DAST, load)

## Smoke test — ✅ PASS (6/6)
`tests/smoke/smoke.yaml` (Job in `malaby-dev`, annotated `argocd.argoproj.io/hook: PostSync`).
Evidence: `docs/evidence/phase11-smoke.txt`.
```
PASS health 200 + db connected
PASS public pitches list (count=4)
PASS create booking 201
PASS admin list WITHOUT token -> 401
PASS admin login -> token
PASS admin list WITH token -> 200 (count=5)
SMOKE PASS (6/6)
```
A NetworkPolicy allows the smoke pod egress/ingress to the api only.

## DAST (OWASP ZAP) — NOT EXECUTED
Job authored at `tests/dast/zap-job.yaml` (baseline scan of the user host + an explicit
`GET /api/bookings → 401` check). The `ghcr.io/zaproxy/zaproxy:stable` image was still pulling
(~8 min, `ContainerCreating`) when the session ended; the job was removed.
See `docs/evidence/phase11-dast-NOTEXECUTED.txt`. The **admin-endpoint rejection** required by the
acceptance criteria is nevertheless proven twice: Phase 5 transcript and the smoke test's 401 check.

## Load test — baseline recorded
`tests/load/load.js` (200 requests, concurrency 10) against `GET /api/pitches` via the public ingress.
Evidence: `docs/evidence/phase11-load.txt`.
```
{"requests":200,"errors":0,"rps":7.1,"p50":1400.8,"p95":1758.9,"p99":2224.5}
```
Interpretation: latency is high for this small query because requests traverse
Traefik → frontend nginx → api → Mongo while the node is running the full CI/Falco/scanner load, and
the `api` pod is CPU-limited to 250m. Recommendation: raise `api` CPU limit to ~500m and re-measure;
this is a homelab "loaded node" baseline, not a production number.
