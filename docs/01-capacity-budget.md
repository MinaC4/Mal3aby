# 01 — Capacity Budget (measured)

## Measured cluster headroom (2026-09-18)
| Node | Allocatable CPU | Allocatable Mem | Used CPU | Used Mem | Mem headroom |
|---|---|---|---|---|---|
| mina | 8 | 15,532,344Ki (~14.8Gi) | 1,271m (15%) | 11,928Mi (78%) | ~3.5Gi |
| worker-1 | 4 | 5,859,372Ki (~5.6Gi) | 222m (5%) | 3,219Mi (56%) | ~2.5Gi |
| worker-2 | 3 | 3,906,248Ki (~3.7Gi) | 288m (9%) | 1,905Mi (49%) | ~1.8Gi |
| **Total** | **15** | **~24Gi** | **~1.8** | **~17Gi** | **~7.8Gi** |

Memory is the binding constraint (mina already 78%); CPU is abundant. Design goal per operator:
**minimum footprint, maximum quality** → 1 replica per env, small requests, reuse everything.

## Planned steady-state footprint (3 envs: dev/staging/prod)
Sizing mirrors the proven `eshtry-mny/mongodb-0` (100m/256Mi req, 500m/512Mi lim).

| Workload | Replicas | CPU req | Mem req | CPU lim | Mem lim | Est. mem (req) |
|---|---|---|---|---|---|---|
| api | 3 (1/env) | 50m | 64Mi | 250m | 256Mi | 192Mi |
| frontend-user | 3 | 10m | 32Mi | 100m | 64Mi | 96Mi |
| frontend-admin | 3 | 10m | 32Mi | 100m | 64Mi | 96Mi |
| mongodb StatefulSet | 3 (1/env) | 100m | 128Mi | 500m | 512Mi | 384Mi |
| **Subtotal app** | 12 pods | **510m** | — | 2.55 | — | **~768Mi** |

Notes:
- Mongo per env keeps isolation; if even that is too much, consolidation to a single shared
  `malaby-data` Mongo is the fallback (saves ~256Mi) at the cost of env isolation — operator decides.
- If staging/prod are not needed immediately, run **dev only first** and promote later (saves ~512Mi).

## Net-new security component
| Component | Footprint | Notes |
|---|---|---|
| Falco (eBPF, DaemonSet) | ~100m / 256Mi **per node** → 300m / 768Mi total | only heavy install; gated on approval |
| ZAP (DAST) | ephemeral Job only | 0 steady-state |
| Trivy/Syft/Semgrep/gitleaks | ephemeral Jenkins pods | 0 steady-state |
| Kyverno / ESO / Trivy Operator / Argo CD / Prometheus / Loki | already running | reuse, +0 |

## Verdict
- **Without Falco**: ~768Mi requested vs ~7.8Gi free → comfortably inside budget.
- **With Falco**: ~1.5Gi requested → still inside budget, but Falco will schedule on the tighter
  workers; set explicit small limits and a `CriticalAddonsOnly`/priorityClass if needed.
- Recommendations: 1 replica/env, no HPA, pin workloads to workers where possible, and keep CI/scan
  workloads ephemeral. No component is cut that affects security (operator directive is satisfied by
  reusing existing security stack instead of multiplying it).
