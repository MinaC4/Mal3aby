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
| 10 | 2026-09-18 | Harbor | project `malaby` (+ images api/frontend-user/frontend-admin `:baseline`) | `POST /api/v2.0/projects` ; `docker push localhost:30082/malaby/…` | Harbor UI/API delete project `malaby` |
| 11 | 2026-09-18 | k8s | `gitops/base/` workloads: mongodb StatefulSet+svc+cm+PVC, api deploy+svc, frontend-user/admin deploy+svc, Ingress `malaby-dev` | `kubectl apply -f gitops/base/` | `kubectl delete -f gitops/base/` ; or `kubectl delete ns malaby-dev` |
| 12 | 2026-09-18 | Harbor/k8s | rebuilt images `api`,`frontend-user`,`frontend-admin` — current api digest `sha256:8c6af7c0…`, user `sha256:edffd680…`, admin `sha256:bfb32e13…` | `docker build/push` ; `kubectl apply -f gitops/base/` | `kubectl rollout undo deploy/<svc> -n malaby-dev` |
| 13 | 2026-09-18 | Vault | `malaby/data/dev/api` + `ADMIN_USERNAME`,`ADMIN_PASSWORD_HASH`; `CORS_ORIGIN` allowlist | `vault kv patch` (via `ci/scripts/vault-bootstrap.sh` on re-run) | `vault kv metadata delete malaby/dev/api` |
| 14 | 2026-09-18 | Harbor/k8s | Phase-5 images — api `sha256:a18ca59f…`, frontend-admin `sha256:985f15ea…`, frontend-user `sha256:639e2bc3…` | `docker build/push` ; `kubectl apply -f gitops/base/` | `kubectl rollout undo deploy/<svc> -n malaby-dev` |
| 15 | 2026-09-18 | k8s | ns `malaby-ci`, SA `jenkins-agent`, Role/RoleBinding `jenkins-agent` | `kubectl apply -f ci/agents/{namespace,rbac}.yaml` | `kubectl delete ns malaby-ci` |
| 16 | 2026-09-18 | k8s | secret `harbor-push` in `malaby-ci` (docker config for Kaniko) | `kubectl create secret generic harbor-push -n malaby-ci --from-file=config.json=...` | `kubectl delete secret harbor-push -n malaby-ci` |
| 17 | 2026-09-18 | Jenkins | (operator-authorized) recreated `pod/jenkins-0` to clear the init `cp` loop — no config change | `kubectl delete pod jenkins-0 -n jenkins` | n/a (STS recreates) |
| 18 | 2026-09-18 | Jenkins | new job `malaby-ci` (Pipeline from GitHub), throwaway `malaby-ci-selftest` (deleted), credential `harbor-push` | Jenkins API `createItem` / `createCredentials` | `curl -X POST /job/<name>/doDelete` ; delete credential |
| 19 | 2026-09-18 | Vault | `malaby/data/dev/cosign` (cosign private/public key + password, base64) | `POST /v1/malaby/data/dev/cosign` | `vault kv metadata delete malaby/dev/cosign` |
| 20 | 2026-09-18 | Jenkins | credentials `malaby-cosign-key` (file), `malaby-cosign-pub` (file), `malaby-cosign-password` (string) | Jenkins API `createCredentials` | delete those credential IDs |
| 21 | 2026-09-18 | k8s | reset `mongodb` StatefulSet + PVC `data-mongodb-0` (Vault restart changed creds) | `kubectl delete -f gitops/base/mongodb.yaml ; kubectl delete pvc data-mongodb-0 -n malaby-dev ; kubectl apply -f gitops/base/mongodb.yaml` | n/a (dev data) |
| 22 | 2026-09-18 | (repo) | `security/cosign.pub` published for Kyverno/verification | file add | `git rm security/cosign.pub` |
| 23 | 2026-09-18 | Harbor | robots `robot$malaby+malaby-ci-push` (pull+push), `robot$malaby+malaby-cluster-pull` (pull) | `POST /api/v2.0/robots` | delete robot via `DELETE /api/v2.0/robots/{id}` |
| 24 | 2026-09-18 | Argo CD | `AppProject/malaby`, `Application/malaby-dev` (automated+prune+selfHeal) | `kubectl apply -f gitops/apps/` | `kubectl delete application -n argocd malaby-dev` ; `kubectl delete appproject -n argocd malaby` |
| 25 | 2026-09-18 | (repo) | pinned all three workloads to signed CI image digests | `gitops/base/*.yaml` | git revert |
| 26 | 2026-09-18 | Kyverno | 9 `malaby-*` ClusterPolicies (scoped to `malaby-dev`) | `kubectl apply -f gitops/policies/` | `kubectl delete -f gitops/policies/` |
| 27 | 2026-09-18 | k8s | workloads: `automountServiceAccountToken: false`, mongo pinned by digest | `gitops/base/*.yaml` via Argo | git revert |
| 28 | 2026-09-18 | k8s | 5 NetworkPolicies in `malaby-dev` (default-deny + allows) | `kubectl apply -f gitops/base/networkpolicies.yaml` (via Argo) | delete via Argo / `git revert` |
| 29 | 2026-09-18 | Helm/k8s | **Falco** (first install) in new ns `malaby-security`, modern-eBPF, 3 custom rules | `helm upgrade --install falco falcosecurity/falco -n malaby-security -f …` | `helm uninstall falco -n malaby-security` ; `kubectl delete ns malaby-security` |
| 30 | 2026-09-18 | k8s | smoke Job `malaby-smoke` + netpol allow (smoke→api); ZAP Job authored (removed) | `kubectl apply -f tests/smoke/smoke.yaml` | `kubectl delete job malaby-smoke -n malaby-dev` |
| — | - | - | _Merged feature/devsecops-foundation → main_ | - | - |
