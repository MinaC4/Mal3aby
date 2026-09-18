# 07 — Key Management (cosign) and Secret Supply Chain

## cosign keypair
- **Type:** key-based (homelab-appropriate; keyless Fulcio/Rekor needs public OIDC infra).
- **Generated:** `cosign generate-key-pair` with a random password; files `cosign.key` / `cosign.pub`.
- **Stored:**
  - Vault: `malaby/data/dev/cosign` → `COSIGN_PRIVATE_KEY_B64`, `COSIGN_PUBLIC_KEY_B64`, `COSIGN_PASSWORD`.
  - Jenkins credentials (scoped to this project, never the operator's existing ones):
    `malaby-cosign-key` (file), `malaby-cosign-pub` (file), `malaby-cosign-password` (string).
  - Public key published in-repo: `security/cosign.pub` (used by Kyverno `verifyImages` in Phase 9).
- **Never** committed: the private key and password exist only in Vault and Jenkins credentials.

## Harbor robots (least privilege)
Created in project `malaby` via the Harbor API:
| Robot | Permissions | Consumer | Stored in |
|---|---|---|---|
| `robot$malaby+malaby-ci-push` | repository pull+push | Kaniko / cosign in CI | Vault `malaby/data/dev/harbor`, k8s secret `harbor-push` (ns `malaby-ci`) |
| `robot$malaby+malaby-cluster-pull` | repository pull | future cluster pulls | Vault `malaby/data/dev/harbor` |

The `harbor-push` k8s secret was switched from the Harbor admin account to the push robot and verified
(`docker login` + push succeeded). The project remains public for node pulls; switching nodes to the
pull robot via an imagePullSecret is a Phase 9/10 follow-up.

## Rotation runbook (cosign)
1. `cosign generate-key-pair` with a new password (in a clean dir).
2. Update Vault `malaby/data/dev/cosign` (new key + password).
3. Update the three Jenkins credentials (`malaby-cosign-*`).
4. Update `security/cosign.pub` in the repo and the Kyverno `cosign-pub` ConfigMap (Phase 9).
5. Re-run the pipeline; stage 10/11 re-sign and verify. Old signatures remain valid for old digests.

## Revocation
- Remove the public key from `security/cosign.pub` and the Kyverno ConfigMap; new admissions fail until
  images are re-signed. Old signatures are not retroactively trusted by verify (public key removed).

## Vault caveat (I-11/I-15)
Vault is **dev-mode** (in-memory). On a Vault restart the `malaby/` mount and these keys are lost; the
idempotent `ci/scripts/vault-bootstrap.sh` plus the rotation runbook above restore them. A restart also
invalidates the Mongo credentials held by the running StatefulSet, so Mongo must be re-initialized
(dev-only, accepted).
