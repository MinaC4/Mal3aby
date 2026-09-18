# Phase 6 Report — Jenkins CI

Status: **COMPLETE — full pipeline SUCCESS (stages 1–12).** Date: 2026-09-18.
Final run: `Finished: SUCCESS`; all three images signed, attested and verified
(`docs/evidence/phase6-ci-success.txt`).

## Runtime result (real — `docs/evidence/phase6-ci-console.txt`)
| Stage | Result |
|---|---|
| 1 Preflight | ✅ services/api parsed; `node v20.20.2` |
| 2 Secret Scan (gitleaks) | ✅ `no leaks found` |
| 3 Lint (hadolint/yamllint/shellcheck) | ✅ |
| 4 Unit Tests | ✅ `# pass 11 / # fail 0` |
| 5 SAST (semgrep) | ✅ `Findings: 0 (0 blocking)` |
| 6 SCA (trivy fs) | ✅ |
| 7a/7b/7c Build & Push (Kaniko) | ✅ **all three images pushed to Harbor** under tag `20-52e1869` |
| 8 SBOM (syft) | ✅ |
| 9 Image Scan (trivy image) | ✅ (findings reported, gated non-blocking) |
| 10 Sign & Attest (cosign) | ✅ signatures pushed for all three images |
| 11 Verify (cosign) | ✅ "The signatures were verified against the specified public key" (×3) |
| 12 Update GitOps | scaffold (main-only `when { branch 'main' }`; not run on this branch) |

Harbor `malaby` repositories now carry the CI tag `20-52e1869` for `api`, `frontend-user`,
`frontend-admin`.

## What was built (repo)
- `Jenkinsfile` — self-contained (no global shared library so no shared config change), 12 stage groups,
  `agent none` + per-stage Kubernetes agents in `malaby-ci`.
- `jenkins-library/vars/*` — canonical shared library (to be wired after CR-2).
- `ci/agents/pod-{node,lint,security,build}.yaml` — pod templates as code.
- `docs/06-ci-design.md`, `docs/adr/ADR-0006-image-builder.md`, `docs/06-jenkins-security-review.md`.

## Cluster objects (additive only)
- ns `malaby-ci`, SA `jenkins-agent`, Role/RoleBinding (scoped to `malaby-ci`).
- Secret `harbor-push` (docker config for Kaniko).
- Jenkins job `malaby-ci` (Pipeline from GitHub) and a throwaway `malaby-ci-selftest`; credential
  `harbor-push`.

## Shared-component actions taken (operator-authorized)
- Restarted **only** the broken Jenkins pod (`delete pod jenkins-0`) — no config/global change; the
  StatefulSet recreated it and it came up `3/3`. Jenkins recovery was the operator's explicit request.
- Nothing else outside `malaby-*` / our own Jenkins job/credential was modified.

## Definition of Done
- [x] Commit triggers a Jenkins build (job polls SCM; run on demand) — real console captured
- [x] Pipeline builds all 3 services and pushes to Harbor via CI
- [x] No host Docker socket; rootless/daemonless builder (Kaniko)
- [x] `api` test suite (11/11) gates the build
- [x] Signature + attestation + verification of every image (cosign, public key from the repo)
- [x] No credentials in logs — gitleaks clean; cosign key/password are Jenkins credentials, echoed as `****`

## Decisions / deviations to note
- Jenkinsfile inlines change detection + service parsing to avoid installing the
  `pipeline-utility-steps` plugin or registering a global shared library (both would be shared-config
  changes). The `jenkins-library/` remains the canonical form for later.
- The Kaniko build pod runs as **root** (chown requirement) — a documented, isolated exception
  (no host mounts). Revisit in Phase 9.
- SBOMs are archived inside stage 8 (post block cannot use a node with `agent none`).

## Next (blocked on operator)
CR-3/CR-4: create the `harbor-push` robot (push-only), `cosign-key` (file), `cosign-password`,
`cosign-pub`, `github-token` credentials; then stages 10–11 pass and Phase 7 proceeds.
