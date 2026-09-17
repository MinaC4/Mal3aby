# 01 — Infrastructure Inventory (read-only discovery)

All facts below were gathered with **read verbs only**, except the sanctioned, announced, and
proven-cleaned-up `malaby-preflight` egress test (see §8 / CHANGE_LOG).

## 1. Cluster
- k3s `v1.36.2+k3s1`, containerd `2.3.2-k3s2`, context `default`, cluster-admin for the agent.
- Nodes: `mina` 192.168.1.8 (control-plane, 8 CPU / ~14.8Gi), `worker-1` 10.1.211.122 (4 CPU / ~5.6Gi),
  `worker-2` 10.1.211.202 (3 CPU / ~3.7Gi). Total allocatable ≈ **15 CPU / ~24Gi**.
- CNI: flannel (vxlan); k3s server args = `["server"]` → NetworkPolicy controller **not disabled**;
  `boutique-*` namespaces run `default-deny` policies → enforcement present (empirical proof in Phase 10).

## 2. Platform components (existing — reuse, never modify)
| Component | Namespace | Version | Surface |
|---|---|---|---|
| Argo CD (authoritative GitOps) | `argocd` | v3.4.5 | NodePort 30085 |
| Devtron (present, secondary) | `devtroncd` | 2.2.0 | NodePort 31018 |
| Jenkins | `jenkins` | 2.568.1 | NodePort 30081 |
| Harbor | `harbor` | 2.15.1 | `harbor.192.168.1.8.nip.io`, NP 30082 |
| Gitea (NOT used — GitHub chosen) | `gitea` | 1.27.0 | NP 30080 |
| Vault | `vault` | 2.0.3 | NP 30086; **unsealed, initialized** |
| External Secrets Operator | `external-secrets` | v2.9.0 | store `vault` = InvalidProviderConfig |
| Kyverno | `kyverno` | v1.18.2 | policies exist only for `boutique-*` |
| Trivy Operator | `trivy-system` | 0.34.0 | running |
| kube-prometheus-stack | `monitoring` | v0.92.1 | Grafana NP 30084 |
| MinIO / OTel / Rollouts | `observability` | — | — |
| Backstage | `backstage` | — | `backstage.192.168.1.8.nip.io` |
| Velero | `velero` | 1.18.1 | backups |
| Falco | — | **ABSENT** | only net-new security install planned |
| cert-manager | — | **ABSENT** | TLS handled by Traefik/self-signed |
| policy-reporter | `kyverno` | release **failed** | do not rely on it |

## 3. Ingress / TLS / storage
- IngressClass: `traefik` (default). Hostname pattern in use: `<name>.192.168.1.8.nip.io`.
- TLS: no cert-manager; operator uses default/self-signed. Plan: HTTP for homelab or self-signed; ADR-0001.
- StorageClass: `local-path` (default, `WaitForFirstConsumer`, Delete reclaim). 27 PVs exist.
- No default StorageClass collision; no changes planned.

## 4. Existing workloads that must NOT be touched
`boutique-{ci,dev,staging,prod,security}`, `eshtry-mny`, `eshtry-mny-tests`, `hephastos`, `devtron*`,
`semaphore`, `sonarqube`, `monitoring`, `observability`, `backstage`, `tools`, `velero`, `harbor`,
`jenkins`, `vault`, `kyverno`, `argocd`, `argo`, `gitea`, `external-secrets`, `trivy-system`, `kubernetes-dashboard`.
Reference for in-cluster Mongo sizing: `eshtry-mny/mongodb-0` requests `100m/256Mi`, limits `500m/512Mi`.

## 5. Secrets / policy / RBAC state
- ESO installed but its Vault store cannot build a client; we will add **new** `SecretStore`s inside
  `malaby-*` and an additive Vault mount/role (no edits to shared stores). Blocked on a Vault token.
- No Pod Security Admission labels on any namespace today → `malaby-*` will set `baseline` enforce /
  `restricted` audit+warn.
- Kyverno ClusterPolicies are global but only target `boutique-*`; new policies will be scoped by
  `namespaceSelector` to `malaby-*` only.

## 6. Namespaces (present) — names only
`argo argocd backstage boutique-ci boutique-dev boutique-prod boutique-security boutique-staging default
devtron-cd devtron-ci devtron-demo devtroncd eshtry-mny eshtry-mny-tests external-secrets gitea harbor
hephastos jenkins kube-node-lease kube-public kube-system kubernetes-dashboard kyverno monitoring
observability semaphore sonarqube tools trivy-system vault velero`

## 7. Pre-engagement export (rule 1.11)
Written locally to `docs/evidence/pre-engagement/` (git-ignored, contains topology/secret refs):
`all.yaml` (3.6M), `crds.yaml` (16M), `cluster-rbac.yaml` (255K), `webhooks.yaml` (45K),
`helm-releases.yaml`, `namespaces.txt`, `networkpolicies.yaml` (100K), `policy-secrets.yaml` (68K).
Stateful backup remains the operator's action (`pre_engagement_backup`).

## 8. Egress test (sanctioned write, cleaned up)
Namespace `malaby-preflight` created → busybox pod → results:
```
DNS cluster:  10.43.0.1
DNS external: 32.199.74.36 (registry-1.docker.io)
EGRESS OK   registry-1.docker.io:443
EGRESS OK   harbor.192.168.1.8.nip.io:443
EGRESS OK   github.com:443
```
Namespace deleted; `kubectl get ns malaby-preflight` → **NotFound**. Cluster egress is stable.
MongoDB Atlas is **not needed** (in-cluster Mongo chosen), so `api` egress can stay intra-cluster.
