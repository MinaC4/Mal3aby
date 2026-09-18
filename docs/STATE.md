# Malaby DevSecOps — STATE (handoff)

Phase: **0–11 merged to `main`** (12–14 not started) | Updated: 2026-09-18
Branch `feature/devsecops-foundation` merged into `main` at `100bfd7`; Argo CD now tracks `main`.

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

- Phase 4: `docs/04-baseline-deployment.md`, `gitops/base/*`, `security/exceptions.yaml`,
  `docs/evidence/phase4-{unauth-exploit,smoke}.txt`. Harbor project `malaby` + 3 baseline images.
  All pods Running; exploit proven (PII list + confirm + delete, no creds). Actual ~53m/157Mi.

## Live cluster objects (malaby-dev)
- ns `malaby-dev`; SA `eso-vault`; SecretStore `vault`; ExternalSecrets `api-secrets-eso`,`mongodb-secrets-eso`
- StatefulSet `mongodb` (+ headless svc, init CM, PVC data-mongodb-0 2Gi)
- Deployment/Service `api` (:5000), `frontend-user` (:80), `frontend-admin` (:80); Ingress `malaby-dev`
- Hosts: `malaby-dev.192.168.1.8.nip.io`, `malaby-admin-dev.192.168.1.8.nip.io`

## Bugfix batch (between Phase 4 and 5)
- `docs/BUGFIXES.md`: audit of both frontends + backend time logic. Critical fix B1: double-booking
  was allowed because the overlap check matched the exact date, not the day. Also B2/B3 (NaN + TZ),
  blank admin screen (A1/A2), fake auth dead code, displayed credentials, fake dashboard trends,
  quick-booking arbitrary time, fake home stats, etc.
- Current live image digests: api `sha256:8c6af7c0…`, frontend-user `sha256:edffd680…`,
  frontend-admin `sha256:bfb32e13…` (in `gitops/base/`).

- Phase 5: `docs/05-security-remediation.md`, `docs/evidence/phase5-auth-fix.txt`. Real JWT auth
  (`requireAdmin` + `POST /api/auth/login`, bcrypt hash from Vault), regex escape, payment-URL
  validation, explicit CORS allowlist, helmet, rate limiting, `/ready`, sourcemaps off, `npm test`
  (11/11 passing). EXC-0001 closed. Current image digests: api `sha256:a18ca59f…`,
  frontend-admin `sha256:985f15ea…`, frontend-user `sha256:639e2bc3…`.

- Phase 6 (PARTIAL): `Jenkinsfile`, `jenkins-library/vars/*`, `ci/agents/pod-*.yaml`, `malaby-ci`
  ns + RBAC, `docs/06-ci-design.md`, `docs/adr/ADR-0006-image-builder.md`,
  `docs/06-jenkins-security-review.md`. **Runtime blocked**: shared Jenkins is down (I-13 / CR-1).

## Phase 6 runtime result
- Jenkins recovered (`3/3`); job `malaby-ci` runs on Kubernetes pod agents in `malaby-ci`.
- Stages 1–9 GREEN: gitleaks `no leaks`, lint, `npm test 11/11`, semgrep `0 findings`, trivy fs,
  **Kaniko pushed all 3 images** (`Harbor malaby/*:20-52e1869`), SBOM, image scan.
- Stage 10 sign FAILED: cosign credential type (CR-4). Console: `docs/evidence/phase6-ci-console.txt`.

## Next
- Phase 7 needs CR-4 (cosign keypair → Vault + Jenkins file credentials; Harbor push/pull robots).
  Optionally CR-2 to register the shared library and CR-3 `github-token`.
- Then stages 10–11 go green and Phase 7 (SBOM/sign/attest/verify) proceeds.

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
