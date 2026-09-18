# Phase 10 Report — Network Segmentation & Runtime Security

Status: **COMPLETE (core)** — NetworkPolicy default-deny proven; Falco installed and detecting.
Date: 2026-09-18.

## Delivered
- 5 NetworkPolicies in `gitops/base/networkpolicies.yaml`: default-deny + DNS + frontend + api + mongodb.
- Falco (first-time install) in `malaby-security`, modern-eBPF, 3 custom rules; DaemonSet 3/3.
- `docs/10-network-security.md`, `docs/10-runtime-security.md`, evidence files.

## Evidence
- `docs/evidence/phase10-netpol-test.txt` — DNS allowed; api/mongo/internet blocked; real booking 201.
- `docs/evidence/phase10-falco.txt` — custom rule fired on a shell in the api container.

## Definition of Done
- [x] Default-deny holds; the full booking flow still works (201) under the policies
- [x] api cannot reach the internet (no Atlas dependency)
- [x] ≥1 custom Falco rule fires on demand (shell); 3 rules deployed (the other two are
      environment-gated as documented)
- [x] Test artifacts cleaned up
- [ ] Falco alerts → Loki (follow-up) ; kube-bench Job (follow-up)

## Resource impact
- Falco DaemonSet: 3 × 2 containers, requests 100m/256Mi per node (within budget).
- No change to existing workloads' steady-state beyond the NetworkPolicies.
