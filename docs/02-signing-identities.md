# 02 — Signing Identities

## Intended model
| Actor | Signature | Key location | Used for |
|---|---|---|---|
| Operator (human) | GPG | operator keyring | interactive commits to feature branch / PRs |
| CI / GitOps bot | GPG (dedicated) | private key in Vault → Jenkins Credentials | pipeline commits (digest pin bumps) |
| Image signing | cosign key pair | private key in Vault; public key in repo + ConfigMap | `cosign sign` by digest (Phase 7) |

## Current reality (blocker)
- The only secret key on this machine is **`boutique-ci-bot <boutique-ci-bot@users.noreply.github.com>`**
  (ed25519, fingerprint `84DF9F67AAB13638`), created for a different project.
- There is **no operator personal key** and no separate `malaby-ci-bot` key yet.
- `gpg_signing_owner` / `gpg_key_id` were not supplied by the operator (ISSUES I-3).

## Decision for now
- Do **not** reuse `boutique-ci-bot` for Malaby (identity confusion across projects).
- Commits on the feature branch are made **unsigned** until a key is provided; this is recorded, not
  hidden. `git log --show-signature` will show "No signature" — that is the honest state.
- Once the operator supplies a key (or approves generating a dedicated `malaby-ci-bot` key stored in
  Vault), enable `commit.gpgsign=true` and re-verify with `git log --show-signature`.
- Phase 7 cosign uses its own key pair (`cosign_key_strategy`), independent of GPG.

## Verification command (once keys exist)
```bash
git log --show-signature -1 --format='%H %G? %GS'
```
`%G?` = `G` (good) is the target; `N` (no signature) is the current documented state.
