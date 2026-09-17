# CHANGE LOG

Every object created on the cluster or in the platform, with the exact create and remove command.
Rule: additive-only; `malaby-*` scope only. Nothing outside this project is modified.

| # | Date | System | Object | Create command | Remove command |
|---|------|--------|--------|----------------|----------------|
| 1 | 2026-09-18 | (local repo) | `docs/`, `ci/services.yaml` | created files (no cluster) | `rm -rf docs ci` |
| 2 | 2026-09-18 | k8s | namespace `malaby-preflight` + pod `preflight` (egress test) | `kubectl create ns malaby-preflight` ; `kubectl run preflight --image=busybox:1.36 -n malaby-preflight` | **DONE:** `kubectl delete ns malaby-preflight` → verified NotFound |
| 3 | 2026-09-18 | (local repo) | pre-commit toolchain, `ci/scripts/*`, `docs/02-*`, `.github/`, `SECURITY.md`, `CONTRIBUTING.md`, dockerignore fixes | file adds | `git rm` those paths (feature branch only) |
| 4 | 2026-09-18 | Vault | KV v2 mount `malaby/` | `vault secrets enable -path=malaby kv-v2` (or POST sys/mounts/malaby) | `vault secrets disable malaby` |
| 5 | 2026-09-18 | Vault | policies `malaby-read-dev` (broad `malaby-read` created then deleted) | `PUT sys/policies/acl/malaby-read-dev` | `DELETE sys/policies/acl/malaby-read-dev` |
| 6 | 2026-09-18 | Vault | kubernetes auth + config | `POST sys/auth/kubernetes`; `POST auth/kubernetes/config` | `vault auth disable kubernetes` |
| 7 | 2026-09-18 | Vault | role `malaby-dev` | `PUT auth/kubernetes/role/malaby-dev` | `DELETE auth/kubernetes/role/malaby-dev` |
| 8 | 2026-09-18 | Vault | secrets `malaby/data/dev/{api,mongodb}` | `ci/scripts/vault-bootstrap.sh` | `vault kv metadata delete malaby/dev/api` (and mongodb) |
| 9 | 2026-09-18 | k8s | ns `malaby-dev`, SA `eso-vault`, SecretStore `vault`, ExternalSecrets `api-secrets-eso`,`mongodb-secrets-eso` | `kubectl apply -f gitops/secrets/dev/` | `kubectl delete ns malaby-dev` |
| — | - | - | _app workloads begin in Phase 4_ | - | - |
