# 06 — CI Design (Jenkins)

> **Runtime status:** the pipeline is authored and reviewed, but **not executed** yet — the shared
> Jenkins instance is down (CR-1). Nothing here is claimed as verified console output.

## Execution model
- Jenkins **Kubernetes pod agents** in the new `malaby-ci` namespace (`ci/agents/namespace.yaml`,
  `rbac.yaml`, least-privilege Role for pods/exec/log/secret/configmap within that namespace only).
- A Kubernetes cloud already exists in Jenkins, so **no global config is needed** to schedule pods
  there. Registering the shared library (CR-2) and credentials (CR-3) are the only shared changes.
- **Rootless, daemonless builds**: Kaniko. **No host Docker socket is ever mounted** (contrast with the
  operator's previous project, which used host Docker).

## Pod templates (as code, `ci/agents/`)
| Template | Containers | Used by |
|---|---|---|
| `pod-node.yaml` | `node:20-alpine` | preflight, tests, GitOps commit |
| `pod-lint.yaml` | hadolint, yamllint, shellcheck | lint |
| `pod-security.yaml` | gitleaks, semgrep, trivy, syft, cosign | scan/SBOM/sign/verify |
| `pod-build.yaml` | kaniko executor | image build/push |

All pods: `serviceAccountName: jenkins-agent`, `allowPrivilegeEscalation:false`, `capabilities.drop:[ALL]`,
`seccompProfile: RuntimeDefault`. This is a small node app, so the `node` image covers all three services.

## Stage map (Jenkinsfile) ↔ `ci/services.yaml`
| # | Stage | Tool | Gate (main) |
|---|---|---|---|
| 1 | Preflight | node | load matrix + change detection (`malabyChangedServices`) |
| 2 | Secret Scan | gitleaks | **BLOCKING** |
| 3 | Lint & Static | hadolint/yamllint/shellcheck | BLOCKING on errors |
| 4 | Unit Tests | `npm test` (api) + `npm run check` (frontends) | **BLOCKING** |
| 5 | SAST | semgrep | gated (ERROR severity) |
| 6 | SCA (source) | trivy fs | gated (CRITICAL/HIGH) |
| 7 | Build & Push | Kaniko → Harbor `malaby` | **BLOCKING** |
| 8 | SBOM | syft (CycloneDX + SPDX) | BLOCKING if absent |
| 9 | Image Scan | trivy image (vuln/secret/misconfig) | gated |
| 10 | Sign & Attest | cosign (key from Vault) | **BLOCKING** |
| 11 | Verify | cosign verify | **BLOCKING** |
| 12 | Update GitOps | git commit digest pins (main only) | scaffold (Phase 8) |

Change detection: a change to `Jenkinsfile`, `ci/**`, or `jenkins-library/**` rebuilds all services;
otherwise only services whose `context` directory changed. `FORCE_ALL` overrides.

## PR vs main
- PR: stages 1–9, images tagged `pr-<n>`, **no push/sign**.
- `main`: full chain including push, sign, attest, verify, GitOps update.

## Security posture (rule 1.14) — see `06-jenkins-security-review.md`
`gitleaks` runs before anything else; no credentials are echoed; the `security` pod never mounts a
kubeconfig with cluster-admin (RBAC scoped to `malaby-ci`). Jenkins' own posture is reviewed separately
and remains partially unverifiable while the controller is down.
