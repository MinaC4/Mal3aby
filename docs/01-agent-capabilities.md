# 01 — Agent Capabilities (local toolchain)

Host: operator workstation, user `mina`, workdir `/home/mina/Mal3aby`. OS linux. Local cluster access
via `kubectl` context `default` (cluster-admin). `gh` authenticated as `Hephast0s`.

| Tool | Present | Version | Use in this engagement |
|---|---|---|---|
| kubectl | ✅ | v1.36.2+k3s1 | all cluster ops |
| helm | ✅ | v3.14.0 | inspect/install own releases only |
| git | ✅ | 2.53.0 | GitHub branch workflow |
| docker | ✅ | 29.1.3 | local image builds/tests only (never on Jenkins) |
| cosign | ✅ | present | sign/verify (Phase 7) |
| grype | ✅ | present | SCA fallback |
| trivy | ✅ | 0.72.0 | fs/image/config scanning |
| jq / yq | ✅ | present | output parsing |
| node / npm | ✅ | present | local app tests |
| python3 | ✅ | present | YAML validation, scripting |
| gh | ✅ | present | GitHub PR/branch ops |
| kustomize | ❌ | — | optional; can render via `kubectl kustomize` (built-in) |
| syft | ❌ | — | SBOM — install locally OR run in Jenkins `security` pod |
| gitleaks | ❌ | — | secret scan — install locally OR Jenkins pod |
| semgrep | ❌ | — | SAST — install locally OR Jenkins pod |
| hadolint | ❌ | — | Dockerfile lint — install locally OR Jenkins pod |
| yamllint / shellcheck | ❌ | — | lint — install locally OR Jenkins pod |
| nerdctl | ❌ | — | not needed; docker present |

## Execution model decision
- **Cluster ops**: local `kubectl`/`helm` (already cluster-admin).
- **Scanning/building**: the *authoritative* runs happen on **Jenkins Kubernetes pod agents** (Phase 6),
  which is where `syft/gitleaks/semgrep/hadolint/buildkit` will be provisioned as ephemeral containers.
  This keeps the agent machine clean and makes the pipeline the source of truth.
- **Local missing tools**: install **only if** `may_install_local_tools: yes`; otherwise rely on in-cluster
  Jobs/Pod agents. No tool is faked or skipped silently (`NOT EXECUTED` rule applies).

## Resource discipline (operator directive: minimum resources, maximum quality)
- Prefer existing cluster components over new installs: Kyverno, ESO, Trivy-Operator, Argo CD, Jenkins,
  Harbor, Vault, Prometheus/Grafana/Loki are already running — **reuse, do not duplicate** (rule 1.12).
- Only net-new heavy component planned is **Falco** (3-node DaemonSet) — costed in `01-capacity-budget.md`
  and gated on operator approval.
- Ephemeral CI/build/scan pods carry no steady-state cost.
