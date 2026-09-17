# Phase 1 Report — Infrastructure Discovery (read-only)

Status: **COMPLETE** (one sanctioned write: `malaby-preflight`, cleaned up and verified gone).
Date: 2026-09-18.

## Commands run
- Mandatory preflight: `kubectl config current-context` = `default`; server `v1.36.2+k3s1`; nodes=3.
- Read-only sweep: `get nodes/ns/pods/svc/ingress/ingressclass/sc/pv/pvc/crd/deploy/sts/ds`,
  `get networkpolicies/clusterpolicies/secretstores/…`, `helm list -A`, `kubectl auth can-i --list`,
  `kubectl top nodes/pods`, node allocatable json, pod requests, k3s node args, CNI interfaces.
- Exports to `docs/evidence/pre-engagement/` (git-ignored): all/crds/cluster-rbac/webhooks/helm/netpol/policy-secrets.
- Egress test (sanctioned): `kubectl create ns malaby-preflight` → `kubectl run preflight busybox` →
  `kubectl exec … nslookup/nc` → `kubectl delete ns malaby-preflight` → `get ns` = NotFound.

## Real results
```
EGRESS OK   registry-1.docker.io:443
EGRESS OK   harbor.192.168.1.8.nip.io:443
EGRESS OK   github.com:443
DNS cluster 10.43.0.1 ; DNS external 32.199.74.36
```
- k3s NetworkPolicy controller **not disabled** (`node-args: ["server"]`); `boutique-*` run default-deny.
- Vault: `/v1/sys/health` → `initialized:true, sealed:false` (operator's "offline" was inaccurate).
- ESO present but its `vault` store = `InvalidProviderConfig`.
- Falco and cert-manager absent. policy-reporter Helm release failed.

## Deliverables
| File | Status |
|---|---|
| `docs/01-agent-capabilities.md` | ✅ |
| `docs/01-infrastructure-inventory.md` | ✅ |
| `docs/01-capability-matrix.md` | ✅ |
| `docs/01-capacity-budget.md` | ✅ |
| `docs/adr/ADR-0001-platform-choices.md` | ✅ |
| `docs/evidence/pre-engagement/*` | ✅ (git-ignored) |

## Definition of Done
- [x] Every command a read verb except the announced, proven-cleaned-up preflight
- [x] Section 0 largely resolved (blockers tracked in ISSUES.md)
- [x] Agent execution model decided (local kubectl/helm; CI/scan in Jenkins pod agents)
- [x] MongoDB Atlas egress question: **moot** (in-cluster Mongo chosen) — registry/github egress proven
- [x] Data-layer decision made and documented (ADR-0001 D5)
- [x] NetworkPolicy enforcement answered (present; empirical proof planned Phase 10)
- [x] Capacity verdict numeric (`01-capacity-budget.md`)
- [x] Restore point exists (pre-engagement export)

## Resource impact
- Steady-state created: **0** (preflight deleted). Estimate in `01-capacity-budget.md` (~768Mi app).

## Next phase
Phase 2 (Git strategy + pre-commit + `.dockerignore` fix) — can start on the GitHub branch now; it is
local/repo-only and does not need a Vault token. Recommended to proceed while I-1/I-2/I-3 remain open.
