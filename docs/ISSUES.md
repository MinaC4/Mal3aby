# ISSUES

| ID | Status | Issue | Impact | Owner |
|---|---|---|---|---|
| I-1 | OPEN | Vault is up/unsealed but no token provided; ESO ClusterSecretStore `vault` is `InvalidProviderConfig` ("unable to create client") | Phase 3 cannot wire secrets; blocks Phase 4/5 | operator |
| I-2 | RESOLVED | Data layer = **in-cluster MongoDB** (operator directive). ADR-0001 D5. Remaining sub-question: dev-only initially vs per-env — defaults to dev-only to minimize resources | Shapes Phase 4/8/10 | operator (minor) |
| I-3 | OPEN | Remaining Section 0 decisions: `admin_auth_strategy`, `new_admin_password`, `gpg_signing_owner`, permissions (`may_install_falco`, `may_run_zap_jobs`, `may_install_buildkit_or_kaniko`, `may_install_local_tools`), `approval_phrase`/`continue_phrase`, `pre_engagement_backup` | Blocks Phase 1 start | operator |
| I-4 | OPEN | GitOps repo topology (single GitHub repo + branch vs. separate repos) undecided | Phase 2 | operator |
| I-5 | MOOT-ish | `malaby/.dockerignore` fix target corrected: the live risk is `malaby/backend/.dockerignore` | Phase 2 must fix backend file | agent |
| I-6 | NOTE | Platform creds weak/shared (`admin/admin123` on Jenkins/Harbor) | Out of scope to change; flagged | operator |
| I-7 | RESOLVED | Cluster egress proven (registry/harbor/github 443 OK); Atlas no longer needed | Phase 6 builds unblocked | agent |
| I-8 | RESOLVED | NetworkPolicy controller present/not disabled; empirical prove in Phase 10 | Phase 10 planned | agent |
| I-9 | PRINCIPLE | Operator directive: **minimum cluster resources, maximum quality** → 1 replica/env, reuse all existing platform, only net-new install = Falco (gated) | All phases | agent |
| I-10 | OPEN | GitHub push denied for `Hephast0s` (`permissions.push=false` on `MinaC4/Mal3aby`); commit `b5b2cc6` exists locally only | Cannot publish branch/PR until fixed | operator |
| I-11 | NOTE | Vault is **dev mode**: `VAULT_DEV_ROOT_TOKEN_ID=root`, `emptyDir` storage → all secrets lost on pod restart | Secrets bootstrap must be idempotent; runbook required | agent |
