# 04 — Baseline Deployment (dev) — control group

Deployed **before** any application security fix, so the vulnerability can be exploited for real
and later proven fixed. Date: 2026-09-18.

## What was deployed
- Namespace `malaby-dev` (PSA `enforce: baseline`, `audit/warn: restricted`).
- `mongodb` StatefulSet (mongo:7.0) + headless Service + init ConfigMap, `local-path` PVC 2Gi,
  root + app-user credentials from `mongodb-secrets-eso` (ESO-managed).
- `api` Deployment + Service (:5000), image `192.168.1.8:30082/malaby/api:baseline`.
- `frontend-user` and `frontend-admin` Deployments + Services (:80), images from Harbor `malaby`.
- Ingress `malaby-dev` (Traefik): `malaby-dev.192.168.1.8.nip.io` → frontend-user,
  `malaby-admin-dev.192.168.1.8.nip.io` → frontend-admin.

## Key design note (no app config change needed)
The frontends' `nginx.conf` proxies `/api/` to `http://api:5000/api/`. Because the Kubernetes Service
is named **`api` in the same namespace**, that exact Docker-Compose hostname resolves via cluster DNS.
**No frontend/nginx source change was required** — the three baseline images are byte-for-byte the
unmodified application. This is a real deviation from the engagement's assumption that `nginx.conf`
must change; the Service-name convention makes it unnecessary.

## Deploy commands
```bash
docker build -t localhost:30082/malaby/api:baseline malaby/backend
docker build -t localhost:30082/malaby/frontend-user:baseline malaby/frontend-user
docker build --build-arg VITE_BASE_URL=/ -t localhost:30082/malaby/frontend-admin:baseline malaby/frontend-admin
docker push localhost:30082/malaby/{api,frontend-user,frontend-admin}:baseline
kubectl apply -f gitops/base/mongodb.yaml
kubectl wait --for=condition=Ready pod/mongodb-0 -n malaby-dev --timeout=150s
kubectl apply -f gitops/base/api.yaml -f gitops/base/frontend-user.yaml -f gitops/base/frontend-admin.yaml -f gitops/base/ingress.yaml
kubectl exec -n malaby-dev deploy/api -- node seed.js
```

## State (evidence)
`kubectl get all -n malaby-dev` → all 4 pods `1/1 Running`; deployments available; ingress present.
api logs: `MongoDB Connected: mongodb.malaby-dev.svc.cluster.local / Database: malaby`.

## Smoke test (real) — docs/evidence/phase4-smoke.txt
- `POST /api/bookings` via the **public** host → `201`, id `6aac77049a2dfece2e4c161d`, status `pending`.
- Same booking retrieved via the **admin** host (unauthenticated) → present (`Smoke Tester`).
- Both frontends return `200`, both hostnames resolve through Traefik.

## EXPLOIT — unauthenticated admin access (docs/evidence/phase4-unauth-exploit.txt)
From a shell that never opened the admin UI and sent no cookie/Authorization header:
| Action | Result |
|---|---|
| `GET /api/bookings` | `200`, all 3 bookings with PII (name/email/phone) |
| `GET /api/notifications` | `200` |
| `PUT /api/bookings/:id/status {"status":"confirmed"}` | `200`, booking confirmed |
| `GET /api/bookings/:id` read-back | mutation persisted |
| `DELETE /api/notifications/:id` | `200`, deleted |

This is a real transcript, not a description. It is the load-bearing evidence of the engagement.

## Resource usage vs budget
| Pod | Request (cpu/mem) | Actual (cpu/mem) |
|---|---|---|
| api | 50m / 64Mi | 46m / 47Mi |
| frontend-user | 10m / 32Mi | 1m / 11Mi |
| frontend-admin | 10m / 32Mi | 1m / 7Mi |
| mongodb | 100m / 256Mi | 5m / 92Mi |
| **total** | **170m / 384Mi** | **~53m / 157Mi** |

Well inside the capacity budget (~7.8Gi free). Actual memory is ~157Mi, far below the 768Mi estimate.

## Accepted risk
`security/exceptions.yaml` EXC-0001 — time-boxed to the start of Phase 5.
