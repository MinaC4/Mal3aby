# 09 — Policy as Code (Kyverno)

Policies are prefixed `malaby-`, scoped by `resources.namespaces: [malaby-dev]` (staging/prod to be
added when they exist), and never touch existing `boutique-*`/`eshtry-mny`/`hephastos` policies.

## Catalogue
| Policy | Action | Enforces |
|---|---|---|
| `malaby-require-labels` | **Enforce** | pods carry `app.kubernetes.io/part-of: malaby` + `app` |
| `malaby-require-resources` | **Enforce** | cpu+memory requests and limits on every container |
| `malaby-require-probes` | **Enforce** | livenessProbe + readinessProbe on every container |
| `malaby-disallow-latest` | **Enforce** | images pinned by digest (`@sha256:`) |
| `malaby-restrict-registry` | **Enforce** | images only from Harbor `malaby` (mongo temporarily allowlisted) |
| `malaby-sa-token` | **Enforce** | `automountServiceAccountToken: false` |
| `malaby-restricted` | **Enforce** | runAsNonRoot, drop ALL, no priv-escalation, seccomp, readOnlyRootFilesystem |
| `malaby-verify-images` | Audit | cosign signature + CycloneDX SBOM attestation |
| `malaby-generate-default-deny` | (generate) | creates `malaby-default-deny` NetworkPolicy in namespaces labeled `malaby.io/netpol=true` |

## Enforcement proof — `docs/evidence/phase9-enforcement.txt`
| Case | Result |
|---|---|
| Valid pod (labels, resources, probes, digest, no SA token) | **allowed** |
| Tag instead of digest | **denied** — `malaby-disallow-latest` |
| Wrong registry (`nginx:alpine`) | **denied** — `malaby-restrict-registry` |
| No resource limits | **denied** — `malaby-require-resources` |
| `automountServiceAccountToken: true` | **denied** — `malaby-sa-token` |
| `privileged: true` | **denied** — namespace Pod Security (baseline) |

## Restricted Pod Security — now ENFORCED
The frontends were rebuilt on `nginxinc/nginx-unprivileged` (UID 101, listen 8080, readOnlyRootFilesystem
with emptyDir mounts for `/tmp`, `/var/cache/nginx`, `/var/run`), MongoDB runs as UID 999 with
readOnlyRootFilesystem, and `api` runs as 1001 with readOnlyRootFilesystem. `malaby-restricted` is now
**Enforce**; a pod without the required securityContext is denied, and the real workloads are admitted.

## Why `malaby-verify-images` remains in Audit
Kyverno cannot verify signatures against Harbor over **plain HTTP** (`unverified image …`), so Enforce
would block all our own pods. Options: serve Harbor over TLS with a trusted CA (node-level change
request) or configure Kyverno for the insecure registry; until then it runs in Audit and CI still
enforces `cosign verify` (stage 11).

## Rollout method
Audit first, reviewed via `PolicyReport`/`policy-reporter`, then flipped to Enforce once the workload
complied. The only remaining Audit policy is `malaby-verify-images` (blocked on Harbor TLS).
