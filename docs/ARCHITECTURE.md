# Malaby — Architecture

## Runtime
```
internet → Traefik (kube-system)
  ├─ malaby-dev.<nip>.io        → frontend-user (nginx:80)  ─┐ /api/* proxy
  └─ malaby-admin-dev.<nip>.io  → frontend-admin (nginx:80) ─┤
                                                             ▼
                                                    api (Express :5000)
                                                             │ TLS-free, intra-cluster
                                                             ▼
                                                    mongodb (StatefulSet :27017, PVC)
```
- No internet egress from the app (Mongo is in-cluster) — enforced by NetworkPolicy.
- The frontends proxy `/api` to the `api` Service; the same image is promotable across environments.

## Delivery
```
git push → Jenkins (K8s pod agents in malaby-ci)
   gitleaks → lint → npm test → semgrep → trivy fs
   → Kaniko build+push (Harbor malaby) → syft SBOM → trivy image
   → cosign sign + attest + verify
   → (main) commit digest pins
        │
        ▼
Argo CD (Application malaby-dev) → malaby-dev
   automated sync + prune + self-heal
        │
        ▼
Kyverno admission (labels/resources/probes/digest/registry/no-SA-token)  +  Falco runtime
```
- Secrets: Vault → External Secrets Operator → Kubernetes Secrets (`*-eso`).
- Observability: api `/metrics` → Prometheus → Grafana (5 dashboards) + alerts.

## Repository layout
`malaby/` app source · `gitops/` deployment state (base, apps, policies, secrets) ·
`ci/` pipeline + agent templates · `tests/` smoke/load/dast · `security/` policies/keys ·
`docs/` analysis, ADRs, runbooks, evidence.
