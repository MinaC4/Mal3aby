# CHANGE LOG

Every object created on the cluster or in the platform, with the exact create and remove command.
Rule: additive-only; `malaby-*` scope only. Nothing outside this project is modified.

| # | Date | System | Object | Create command | Remove command |
|---|------|--------|--------|----------------|----------------|
| 1 | 2026-09-18 | (local repo) | `docs/`, `ci/services.yaml` | created files (no cluster) | `rm -rf docs ci` |
| 2 | 2026-09-18 | k8s | namespace `malaby-preflight` + pod `preflight` (egress test) | `kubectl create ns malaby-preflight` ; `kubectl run preflight --image=busybox:1.36 -n malaby-preflight` | **DONE:** `kubectl delete ns malaby-preflight` → verified NotFound |
| 3 | 2026-09-18 | (local repo) | pre-commit toolchain, `ci/scripts/*`, `docs/02-*`, `.github/`, `SECURITY.md`, `CONTRIBUTING.md`, dockerignore fixes | file adds | `git rm` those paths (feature branch only) |
| — | - | - | _cluster changes begin in Phase 4_ | - | - |
