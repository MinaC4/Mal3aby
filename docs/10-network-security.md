# 10 — Network Security (NetworkPolicy)

`malaby-dev` runs **default-deny** for both Ingress and Egress, with least-privilege allows.
Because MongoDB is in-cluster, the `api` needs **no internet egress at all** — the more securable
outcome bought by the Phase 1 data-layer decision (ADR-0001 D5).

## Allowed-flow matrix
| Source | Destination | Port | Policy |
|---|---|---|---|
| any malaby pod | kube-dns (kube-system) | 53 UDP/TCP | `malaby-allow-dns` |
| Traefik (kube-system, `app.kubernetes.io/name=traefik`) | frontends | 80 | `malaby-frontend` |
| frontend-user / frontend-admin | api | 5000 | `malaby-frontend` (egress) / `malaby-api` (ingress) |
| api | mongodb | 27017 | `malaby-api` (egress) / `malaby-mongodb` (ingress) |
| `api` | **internet** | — | **denied** (no rule) |

## Test evidence — `docs/evidence/phase10-netpol-test.txt`
From an unlabeled test pod inside `malaby-dev`:
| Target | Result |
|---|---|
| DNS `kubernetes.default` / kube-dns :53 | **allowed** (resolves; TCP 53 OPEN) |
| `api:5000` (not a frontend) | **blocked** (ECONNREFUSED) |
| `mongodb:27017` (not the api) | **blocked** |
| `1.1.1.1:443` (internet) | **blocked** |
| Real booking `POST /api/bookings` via the user host | **201** (allowed path intact) |

The test pod was deleted after the run; no leakage.

## Notes
- `malaby-generate-default-deny` (Kyverno) can auto-create a default-deny NetworkPolicy for any future
  namespace carrying `malaby.io/netpol: "true"`; `malaby-dev` uses the explicit policies above.
- No FQDN-based egress policy is needed (no Atlas dependency).
