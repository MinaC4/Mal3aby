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
| `malaby-restricted` | Audit | runAsNonRoot, drop ALL, no priv-escalation, seccomp, readOnlyRootFilesystem |
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

## Why two policies remain in Audit (honest status)
1. **`malaby-restricted`** — the nginx frontends and MongoDB run as root today. To enforce:
   rebuild both frontends on `nginxinc/nginx-unprivileged` (listen 8080, writable `/tmp`, `/var/cache`),
   run MongoDB as UID 999 with `readOnlyRootFilesystem`, and add `securityContext` to `api`.
2. **`malaby-verify-images`** — Kyverno could not verify signatures against Harbor over **plain HTTP**
   (`unverified image …`), so Enforce would block all our own pods. Options: serve Harbor over TLS with a
   trusted CA (node-level change request) or configure Kyverno for the insecure registry; until then it
   runs in Audit and CI still enforces `cosign verify` (stage 11).

## Rollout method
Audit first (`malaby-restricted`, `malaby-verify-images`), reviewed via `PolicyReport`/`policy-reporter`,
then flipped to Enforce for the policies the workload satisfies. The Enforce subset is applied and proven
above; the Audit two are tracked for Phase 9 follow-up.
