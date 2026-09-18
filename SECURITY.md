# Security Policy

## Reporting
This is a single-operator homelab project. Report issues to the repository owner (`@MinaC4`)
privately; do not open a public issue for an unpatched vulnerability.

## Supported versions
Only the current `main` branch is supported. `feature/*` branches are work-in-progress.

## Scope and known constraints (honest limitations)
- The platform is a **homelab k3s cluster**; it is not hardened to internet-facing production standards.
- **Vault runs in dev mode** (`emptyDir`, in-memory storage, root token `root`) on this cluster.
  Secrets live only for the lifetime of the Vault pod. A restart wipes the `malaby/` mount, so the
  bootstrap is idempotent (`ci/scripts/vault-bootstrap.sh`) and must be re-run after a Vault restart.
  See `docs/03-secrets-management.md`.
- TLS on homelab hostnames relies on Traefik/self-signed certificates; there is no cert-manager.
- MongoDB is in-cluster on `local-path`; dev data loss on volume reclaim is accepted.

## Non-negotiable rules for contributors
1. Never commit secrets — Vault is the only source, ESO the only delivery path.
2. Never modify a running namespace other than `malaby-*`.
3. All admin API routes must be protected by server-side authentication.
4. Every supply-chain artifact (image) is signed and verified before it runs.
