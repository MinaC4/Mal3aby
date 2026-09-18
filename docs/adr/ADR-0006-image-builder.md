# 06-ADR — Image builder choice

Status: proposed (Phase 6). Context: Jenkins Kubernetes pod agents, **no host Docker socket**, homelab
registry Harbor over insecure HTTP (`192.168.1.8:30082`), small Node/nginx images.

## Decision: Kaniko (`gcr.io/kaniko-project/executor:debug`)

## Alternatives
| Option | Pro | Con | Verdict |
|---|---|---|---|
| **Kaniko** | daemonless, rootless-capable, single container, works with the Jenkins k8s plugin, native `--insecure` for Harbor | slower layer-by-layer, deprecated upstream but widely used and stable | **chosen** |
| BuildKit rootless | fast, modern | needs `--security-context` tuning / seccomp, often wants privileged or `CAP_SYS_ADMIN`; more moving parts in a homelab pod | rejected for now |
| Host Docker socket | simplest | grants the agent control of the node's Docker daemon → effectively node root; explicitly forbidden by the engagement | rejected |
| Docker-in-Docker | isolated | requires privileged pods | rejected |

## Consequences
- Build credentials are a Harbor **push-only robot** mounted as `/kaniko/.docker/config.json` from the
  `harbor-push` Jenkins credential — never a host socket.
- `--insecure --skip-tls-verify` is required because Harbor here serves HTTP; scoped to the build pod.
- If Kaniko is ever removed from upstream, the fallback is BuildKit rootless; the pod template isolates
  the change to `ci/agents/pod-build.yaml`.
- Base-image pinning by digest (Phase 7) happens in the Dockerfiles, independent of the builder.
