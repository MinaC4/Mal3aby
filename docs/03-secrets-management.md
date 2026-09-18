# 03 — Secrets Management (Vault → ESO)

## Flow
```
Vault KV v2 mount `malaby/`
  malaby/data/<env>/{api,mongodb}
        │  Kubernetes auth (role malaby-<env>, SA eso-vault in malaby-<env>)
        ▼
ESO SecretStore `vault` (ns malaby-<env>)
        │
        ▼
ExternalSecret api-secrets-eso / mongodb-secrets-eso
        │
        ▼
Kubernetes Secret `api-secrets-eso` / `mongodb-secrets-eso`  (ownership: external-secrets)
        │
        ▼
api Deployment (envFrom secretRef) / MongoDB StatefulSet
```
No secret value ever enters Git. No Secret is created by hand. Only ESO writes these Secrets.

## Vault layout
| Path | Keys | Consumers |
|---|---|---|
| `malaby/data/dev/api` | `JWT_SECRET`, `ADMIN_PASSWORD`, `CORS_ORIGIN` | `api` |
| `malaby/data/dev/mongodb` | `MONGODB_ROOT_USERNAME`, `MONGODB_ROOT_PASSWORD`, `MONGODB_APP_USERNAME`, `MONGODB_APP_PASSWORD`, `MONGODB_URI` | MongoDB StatefulSet + `api` |

## Namespacing / authorization
- Vault Kubernetes auth is enabled (`auth/kubernetes`), `kubernetes_host=https://kubernetes.default.svc:443`.
- One role per environment:
  `bound_service_account_names=eso-vault`, `bound_service_account_namespaces=malaby-<env>`,
  `policies=malaby-read-<env>`.
- Policy HCL (least privilege, per env — a dev token cannot read staging/prod):
```hcl
path "malaby/data/test-env/*"     { capabilities = ["read"] }
path "malaby/metadata/test-env/*" { capabilities = ["read","list"] }
```

## Naming / ownership rule (learned the hard way)
ESO-managed Secrets **must never share a name** with a manually- or Helm-managed Secret. All
ESO-owned Secrets end in **`-eso`** and carry `app.kubernetes.io/part-of: malaby`. Applying a
manifest that writes the same Secret name outside ESO causes ownership fights.

## Bootstrap and the dev-mode Vault caveat
The homelab Vault runs **in dev mode**: `VAULT_DEV_ROOT_TOKEN_ID=root` and `emptyDir` storage.
Consequences:
- Root token is the documented dev default (`root`) — not a protected credential.
- **All Vault state (mount, policy, role, secrets) is lost when the Vault pod restarts.**
- Mitigation: `ci/scripts/vault-bootstrap.sh` is **idempotent** and re-creates everything. Existing
  secret paths are preserved unless `FORCE=1`.
Run after any Vault restart:
```bash
VAULT_ADDR=http://192.168.1.8:30086 VAULT_TOKEN=root ENVS=dev ./ci/scripts/vault-bootstrap.sh
```
A permanent fix (persistent Vault storage) is a change to the operator's Vault release and would need a
CHANGE_REQUEST — not done here.

## Manifests
`gitops/secrets/dev/`: `namespace.yaml`, `serviceaccount.yaml`, `secretstore.yaml`,
`externalsecret-api.yaml`, `externalsecret-mongodb.yaml`.

## Rotation runbook
1. Rotate in Vault: `vault kv patch malaby/dev/api JWT_SECRET=$(openssl rand -hex 32)` (or `kv put`).
2. Wait one `refreshInterval` (30s) — ESO updates the `-eso` Secret.
3. Restart consumers that read secrets only at startup: `kubectl rollout restart deploy/api -n malaby-dev`.
4. Verify: `kubectl get externalsecret -n malaby-dev` = `SecretSynced`.
5. Mongo password rotation additionally requires updating the DB user (Phase 4 runbook).

## Evidence (real)
```
SecretStore/vault        Valid  ReadWrite  Ready=True
ExternalSecret api-…     SecretSynced  Ready=True
ExternalSecret mongodb-… SecretSynced  Ready=True
kubectl get secret -n malaby-dev
  api-secrets-eso      Opaque  3
  mongodb-secrets-eso  Opaque  5

# refresh test (CORS_ORIGIN * -> http://bootstrap-check -> *)
before: *   after: http://bootstrap-check   → REFRESH PROVEN   restored: *

# cross-env denial (token scoped to malaby-read-dev)
GET malaby/data/dev/api      -> 200
GET malaby/data/dev/mongodb  -> 200
GET malaby/data/staging/api  -> 403
GET malaby/data/prod/api     -> 403

# idempotency
re-run: "exists (skip; FORCE=1 to overwrite)"
# no secret material in Git
gitleaks dir → 0 findings
```
