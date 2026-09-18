# Runbook — Suspected secret leak
1. Identify the secret and blast radius (Vault path `malaby/data/dev/*`).
2. Rotate in Vault (`vault kv put`), let ESO refresh (≤30s), `kubectl rollout restart deploy/<svc>` — or
   re-run `ci/scripts/vault-bootstrap.sh FORCE=1` for a full re-seed.
3. If a credential reached Git: remove from history (git filter-repo) and rotate; assume compromised.
4. Mongo: rotate the app user password to match the new `MONGODB_URI` (or re-init dev Mongo).
