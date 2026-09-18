# Phase 6 Report — Jenkins Continuous Integration

Status: **PARTIAL — authored & reviewed; runtime execution BLOCKED by CR-1**. Date: 2026-09-18.
Nothing in this phase is claimed as verified CI output; the shared Jenkins instance is down.

## Delivered (repo)
- `Jenkinsfile` — declarative, 12 stages (preflight → secret scan → lint → tests → SAST → SCA →
  Kaniko build/push → SBOM → image scan → sign/attest → verify → GitOps update), PR vs main behaviour,
  `FORCE_ALL`, artifact archiving.
- `jenkins-library/vars/` — `malabyLoadServices`, `malabyChangedServices` (change detection against
  `ci/services.yaml`), `malabyUpdateGitOps` (Phase 8 scaffold).
- `ci/agents/pod-{node,lint,security,build}.yaml` — pod templates as code, no host Docker socket,
  drop ALL capabilities, `RuntimeDefault` seccomp.
- `docs/06-ci-design.md`, `docs/adr/ADR-0006-image-builder.md`, `docs/06-jenkins-security-review.md`.

## Delivered (cluster, additive only)
- Namespace `malaby-ci` (PSA baseline enforce / restricted audit+warn).
- ServiceAccount `jenkins-agent`, Role + RoleBinding scoped to `malaby-ci` (pods/exec/log,
  configmaps, secrets, services, PVCs, events). Nothing outside `malaby-*` touched.

## Blockers / NOT EXECUTED
- **CR-1**: `jenkins-0` is `Error`; `init` initContainer loops on `cp: overwrite ...?`; StatefulSet 0/1.
  → no pipeline run, no console output, no images built by CI.
- **CR-2**: register the shared library + confirm the agent namespace/credentials (global config).
- **CR-3/4**: create Harbor/cosign/GitHub credentials and a signing key.
- Consequently the DoD items “commit triggers Jenkins”, “single-service change builds only that
  service”, and “3 images in Harbor via CI” are **NOT EXECUTED**.

## Definition of Done
- [x] Pipeline, shared library, pod templates written
- [x] `ci/services.yaml` wired for change detection
- [x] `malaby-ci` least-privilege namespace/RBAC created
- [x] Docs + ADR + Jenkins security review (with honest NOT EXECUTED markers)
- [ ] Commit triggers Jenkins automatically — blocked (CR-1)
- [ ] Single-service change builds only that service — blocked (CR-1)
- [ ] Full build produces 3 images in Harbor — blocked (CR-1); baseline images were built manually in Phase 4/5
- [ ] No credentials in logs — to be confirmed on first run
- [ ] `api` test suite gates the build — tests exist (11/11) and are wired into stage 4; not yet run in CI

## Operator action to unblock
See `docs/CHANGE_REQUESTS.md` CR-1. Once Jenkins is healthy, the first run will validate stages 1–4
immediately (no external credentials needed) and stages 7–11 once CR-3 credentials exist.
