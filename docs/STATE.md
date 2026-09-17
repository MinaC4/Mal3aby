# Malaby DevSecOps — STATE (handoff)

Phase: **3 COMPLETE** → next Phase 4 (baseline deployment dev) | Updated: 2026-09-18

## Resume here
Read this file + the one or two files it names. Touch only `malaby-*`. Never modify the shared
platform. Operator answers I-1/I-2/I-3 in `docs/ISSUES.md` unblock Phase 1.

## Operator decisions locked this session
- **Git = GitHub** (`MinaC4/Mal3aby`), NOT Gitea. Work on a branch; merge to `main` only when 100% working.
  Operator added me as collaborator; `gh` authenticated as `Hephast0s`. Never force-push `main`.
- **Database = in-cluster** ("اشتغل على الداتا بيز على الكلاستر"), not Atlas. Planned: MongoDB StatefulSet
  + `local-path` PVC in `malaby-dev` (dev data loss acceptable). Confirm statefulness scope for staging/prod.
- **Platform creds provided by operator out-of-band** (NOT stored in Git; used only at runtime):
  Jenkins, Harbor, Grafana, ArgoCD (admin), Prometheus/Kyverno/Adminer anonymous. Gitea creds irrelevant.
  **Vault correction: it is UP and unsealed** (`/v1/sys/health` → initialized=true, sealed=false, v2.0.3).
  ESO store is broken by config, not by Vault being down.

## Section 0 — discovered read-only (facts)
- access_method: local-kubectl (cluster-admin: `kubectl auth can-i --list` = *.* [*])
- kube_context_name: `default` (client & server v1.36.2+k3s1)
- nodes: mina 192.168.1.8 (control-plane), worker-1 10.1.211.122, worker-2 10.1.211.202
- installed (agent): kubectl helm git docker(29.1.3) cosign grype trivy jq yq node npm python3 gh
- MISSING (agent): kustomize syft gitleaks semgrep hadolint yamllint shellcheck nerdctl
- ingress_class: traefik (default) ; storage_class: local-path ; cert-manager: ABSENT
- harbor `harbor.192.168.1.8.nip.io` (NP 30082) ; jenkins 30081 ; vault 30086 ; argocd 30085 ;
  grafana 30084 ; devtron 31018 ; gitea 30080 (unused)
- gitops: Argo CD authoritative ; Devtron also present ; kyverno v1.18.2 (only boutique-* policies) ;
  trivy-operator present ; ESO v2.9.0 present but store broken ; falco ABSENT ; policy-reporter release FAILED
- existing projects NEVER to touch: boutique-*, eshtry-mny(-tests), hephastos, devtron*, semaphore,
  sonarqube, monitoring, observability, backstage, tools, velero, harbor, jenkins, vault, kyverno, argocd, argo
- in-cluster Mongo precedent: `eshtry-mny/mongodb-0` (do not reuse; separate project)

## I-1/I-2/I-3 — still BLOCKING Phase 1
- Vault token/root to enable `malaby/` mount + k8s auth + ESO role (Vault is up; need credentials)
- Confirm in-cluster Mongo plan (dev only vs dev+staging+prod)
- `admin_auth_strategy` (rec: jwt-session-in-backend) + `new_admin_password` (or "generate+store in Vault")
- `regex_search_fix` (rec: yes), `payment_screenshot_handling`
- `gpg_signing_owner`/`gpg_key_id` (only key present: boutique-ci-bot 84DF9F67AAB13638)
- permissions: `may_install_local_tools`, `may_install_falco`, `may_run_zap_jobs`, `may_install_buildkit_or_kaniko`
- `approval_phrase`, `continue_phrase`, `pre_engagement_backup` confirmed
- egress test (Atlas no longer needed if in-cluster; still test registry egress)

## Verified application facts (Phase 0)
- 3 services: api (node20/express/mongoose :5000), frontend-user/admin (vite→nginx:alpine :80); no queue
- Zero backend auth. `admin123` hardcoded in FOUR places: AuthContext.tsx:14, hooks/useAuth.ts:9,
  LoginPage.tsx:115 (shows it on screen), README.md:220
- Real `.env` exposure is `malaby/backend/.dockerignore` (root `malaby/.dockerignore` is unused by compose)
- No tests; frontend-user sourcemap:true; nginx root; unpinned images; regex injection pitches.js:16/22;
  free-text paymentScreenshotUrl bookings.js:338

## DONE (evidence)
- Phase 0: `docs/00-*.md` (analysis/architecture/threat-model F1–F21/build-matrix), `ci/services.yaml`
  (validated), `docs/phases/PHASE-0-REPORT.md`
- Phase 1: `docs/01-agent-capabilities.md`, `01-infrastructure-inventory.md`, `01-capability-matrix.md`,
  `01-capacity-budget.md`, `docs/adr/ADR-0001-platform-choices.md`, `docs/phases/PHASE-1-REPORT.md`,
  `docs/evidence/pre-engagement/` (git-ignored raw exports)
- Phase 1 egress test: `malaby-preflight` ns created+deleted, verified NotFound. Results: registry/
  harbor/github :443 OK, DNS OK.
- Phase 2: `docs/02-git-strategy.md`, `02-signing-identities.md`, `.pre-commit-config.yaml`,
  `.gitleaks.toml`, `.hadolint.yaml`, `.yamllint`, `CODEOWNERS`, `SECURITY.md`, `CONTRIBUTING.md`,
  `.github/pull_request_template.md`, `ci/scripts/{guard-secret-files,commit-msg-conventional}.sh`,
  `.dockerignore` fixes. Proof: planted secret blocked (exit 1), repo scan 0 findings, real build shows
  no `.env` in image.
- Governance: `docs/CHANGE_LOG.md`, `docs/ROLLBACK.md`, `docs/ISSUES.md`

- Phase 3: `docs/03-secrets-management.md`, `ci/scripts/vault-bootstrap.sh`,
  `gitops/secrets/dev/*`. Vault mount `malaby/` + k8s auth + role `malaby-dev`; ESO SecretStore
  `Valid/Ready`; refresh proven; cross-env denial proven (dev 200 / staging+prod 403).

## Key facts
- GitHub branch `feature/devsecops-foundation`, pushed and tracking `origin`; push access works.
- Vault is **dev-mode** (root token `root`, emptyDir) → ephemeral; re-run `vault-bootstrap.sh` after restart.
- Secrets: ESO-owned Secrets always suffixed `-eso`; per-env Vault policies.
- Signing: unsigned until a key is supplied (I-3). Branch protection blocked (needs admin).

## Next (Phase 4)
- Build 3 images from **unmodified** app (control group), push Harbor project `malaby`.
- `malaby-dev` namespace already exists. Add MongoDB StatefulSet + api/frontend Deployments/Services/Ingress.
- Then the deliberate unauthenticated-admin exploit transcript.

## Key Phase 1 facts
- Egress to registries/GitHub OK. Atlas not needed (in-cluster Mongo). NetworkPolicy controller active.
- Capacity: ~7.8Gi mem free; planned app footprint ~768Mi; only net-new install = Falco (gated).
- Operator principle: minimum cluster resources, max quality → reuse all platform, 1 replica/env.

## Created so far
- Local files only (above). Cluster: only the temporary `malaby-preflight` ns (deleted).
- Branch `feature/devsecops-foundation`, local commit `b5b2cc6`.
- **PUSH BLOCKED (I-10):** `git push` → 403; `Hephast0s` has pull but **push=false** on
  `MinaC4/Mal3aby`. Operator must add/accept the collaborator invite with write access.
- Repo identity set **repo-local only**: `Malaby DevSecOps <devsecops@malaby.local>`.
