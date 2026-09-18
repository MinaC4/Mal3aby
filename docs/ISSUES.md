# ISSUES

| ID | Status | Issue | Impact | Owner |
|---|---|---|---|---|
| I-1 | RESOLVED | Vault reached via dev-mode root token `root`; additive `malaby/` mount + k8s auth + ESO SecretStore in `malaby-dev` now `Valid/Ready` | Phase 3 complete; Phase 4/5 unblocked | agent |
| I-2 | RESOLVED | Data layer = **in-cluster MongoDB** (operator directive). ADR-0001 D5. Remaining sub-question: dev-only initially vs per-env — defaults to dev-only to minimize resources | Shapes Phase 4/8/10 | operator (minor) |
| I-3 | PARTIAL | Resolved: `admin_auth_strategy`=JWT (implemented), admin password generated+hashed in Vault. Still open: `gpg_signing_owner`/key, permissions (`may_install_falco`, `may_run_zap_jobs`, `may_install_buildkit_or_kaniko`, `may_install_local_tools`), `jenkins_may_install_plugins`, `approval_phrase` | Needed for Phases 6–9 | operator |
| I-12 | OPEN | No GPG/cosign key yet; commits unsigned and cosign signing (Phase 7) blocked on key choice | Phase 7 | operator |
| I-13 | RESOLVED | Jenkins pod recovered by recreating `jenkins-0` (StatefulSet, fresh emptyDirs); now `3/3`. No config change. | Phase 6 CI runs | agent |
| I-14 | OPEN | cosign credentials missing/wrong type (`cosign-key` exists as Secret text, not FileCredentials) → stage 10 sign/attest fails | Blocks stage 10–11 and Phase 7 signing | operator (CR-4) |
| I-4 | OPEN | GitOps repo topology (single GitHub repo + branch vs. separate repos) undecided | Phase 2 | operator |
| I-5 | MOOT-ish | `malaby/.dockerignore` fix target corrected: the live risk is `malaby/backend/.dockerignore` | Phase 2 must fix backend file | agent |
| I-6 | NOTE | Platform creds weak/shared (`admin/admin123` on Jenkins/Harbor) | Out of scope to change; flagged | operator |
| I-7 | RESOLVED | Cluster egress proven (registry/harbor/github 443 OK); Atlas no longer needed | Phase 6 builds unblocked | agent |
| I-8 | RESOLVED | NetworkPolicy controller present/not disabled; empirical prove in Phase 10 | Phase 10 planned | agent |
| I-9 | PRINCIPLE | Operator directive: **minimum cluster resources, maximum quality** → 1 replica/env, reuse all existing platform, only net-new install = Falco (gated) | All phases | agent |
| I-10 | RESOLVED | GitHub push access fixed; `Hephast0s` now `push=true`; branch `feature/devsecops-foundation` pushed (`7e140b0`+) | Branch publishable | operator |
| I-11 | NOTE | Vault is **dev mode**: `VAULT_DEV_ROOT_TOKEN_ID=root`, `emptyDir` storage → all secrets lost on pod restart | Secrets bootstrap must be idempotent; runbook required | agent |
