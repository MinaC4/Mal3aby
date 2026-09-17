# 01 — Capability Matrix

Legend: **present** = installed and usable · **partial** = exists but needs additive config ·
**absent** = must be installed · **reuse** = do not install a second copy.

| Capability | State | Component | Action for Malaby |
|---|---|---|---|
| Container registry | present | Harbor 2.15.1 (`harbor.…nip.io`) | `reuse`; create project `malaby` (approval) |
| SBOM storage | partial | Jenkins artifacts + Harbor | generate Syft, attach as cosign attestation |
| Image signing | present (tool) / partial (infra) | cosign on agent | keypair; Vault stores private key; pubkey in ConfigMap |
| Policy engine | present | Kyverno v1.18.2 | `reuse`; add `malaby-*` scoped policies, Audit→Enforce |
| GitOps controller | present | Argo CD v3.4.5 | `reuse`; add `malaby-*` Applications only |
| Secrets manager | present | Vault 2.0.3 (unsealed) | `reuse`; additive mount `malaby/` + k8s auth role |
| Secret distribution | partial | ESO v2.9.0 | `reuse`; new `SecretStore`s inside `malaby-*` |
| Runtime security | absent | — | install **Falco** (only net-new security workload) |
| Log aggregation | present | Loki (observability stack) | `reuse`; additive scrape only |
| Metrics | present | kube-prometheus-stack | `reuse`; ServiceMonitor/PodMonitor in `malaby-*` |
| Dashboards | present | Grafana | `reuse`; new folder `Malaby DevSecOps` only |
| DAST runner | absent | — | ephemeral ZAP Job (no steady-state cost) |
| SCA / image scan | present | Trivy 0.72.0 local + Trivy Operator | run in CI; operator already scans |
| SBOM generator | absent (agent) | — | Syft in Jenkins `security` pod / local if approved |
| SAST | absent (agent) | — | Semgrep in Jenkins `security` pod |
| Secret scanning | absent (agent) | — | gitleaks in Jenkins `security` pod + pre-commit |
| CI engine | present | Jenkins 2.568.1 (Kubernetes plugin) | `reuse`; new jobs only |
| Pod registry cred | present | Harbor robot accounts | create push (CI) + pull (cluster) robots |
| Dev portal | present | Backstage | additive `catalog-info.yaml` (approval if config edit needed) |
| Ingress | present | Traefik v3.7.1 | `reuse`; `malaby-*` Ingresses |
| TLS issuance | absent | — | no cert-manager; use self-signed/HTTP (ADR-0001) |

## Net-new installs requested (minimum set)
1. **Falco** — runtime detection; DaemonSet on 3 nodes (~768Mi total limits, see capacity budget).
2. Harbor project `malaby`; Vault mount `malaby/` — configuration, not new software.
Everything else is **reuse**. No second Argo CD/ESO/Kyverno/Trivy/Jenkins will be installed (rule 1.12).
