# Phase 3 Report — Secrets Bootstrap (Vault + ESO)

Status: **COMPLETE**. Date: 2026-09-18.

## Approach
- Additive Vault config under a dedicated `malaby/` mount only.
- **Kubernetes auth** (not a static token) so no long-lived Vault credential is stored anywhere.
- Per-environment least-privilege policies.
- ESO `SecretStore` lives in `malaby-dev` (new namespace), never in the shared `external-secrets` ns.

## Commands (representative)
- `VAULT_ADDR=… VAULT_TOKEN=root ENVS=dev bash ci/scripts/vault-bootstrap.sh`
- `kubectl apply -f gitops/secrets/dev/{namespace,serviceaccount,secretstore,externalsecret-api,externalsecret-mongodb}.yaml`
- refresh test via Vault `PATCH` + `kubectl get secret … -o jsonpath`
- scoped-token read test via `auth/token/create` → `malaby-read-dev` → GET dev/staging/prod paths

## Created objects (rollback in ROLLBACK.md)
- Vault: mount `malaby/`, policies `malaby-read-dev` (broad `malaby-read` created then deleted),
  auth `kubernetes/`, role `malaby-dev`, secrets `malaby/data/dev/{api,mongodb}`.
- k8s: ns `malaby-dev`; SA `eso-vault`; SecretStore `vault`; ExternalSecrets `api-secrets-eso`,
  `mongodb-secrets-eso`.

## Evidence
- `SecretStore=vault Valid/Ready`; both ExternalSecrets `SecretSynced`.
- Refresh proven: `* → http://bootstrap-check → *` observed in the k8s Secret within 30s.
- Least privilege proven: scoped dev token → dev paths `200`, staging/prod `403`.
- Idempotent re-run skips existing secret paths.
- `gitleaks dir` → **0 findings** (no secret material committed).

## Definition of Done
- [x] Vault policies deny cross-env reads (200 dev / 403 staging+prod, real output)
- [x] Repo scan confirms no secret material committed
- [x] Mechanism proven end-to-end with real values (Mongo creds generated, not operator-supplied)
- [x] Real `MONGODB_URI` in place (in-cluster Mongo, generated per operator directive)
- [!] Vault is dev-mode/ephemeral — documented risk I-11; bootstrap script mitigates

## Deviations
- `malaby-dev` namespace created in Phase 3 (needed to verify ESO) rather than Phase 4; Phase 4 adds workloads to it.
- Only `dev` seeded (minimum resources). Add staging/prod later with `ENVS="dev staging prod"`.

## Resource impact
- Steady state added: ESO controllers already ran; +0 new pods. Vault mount/secret negligible.
