# 08 — GitOps Continuous Delivery (Argo CD)

## Model
- **Single controller**: Argo CD (already authoritative on this cluster). Devtron is not used for
  `malaby-*` (documented in ADR-0001).
- **AppProject `malaby`** scopes sources to this repo and destinations to `malaby-*` only
  (cluster-resource whitelist empty).
- **Application `malaby-dev`** (`gitops/apps/malaby-dev.yaml`): source = this repo, path `gitops/base`,
  destination `malaby-dev`. Sync policy **automated + prune + selfHeal**.

## Promotion by digest
- Images are built, signed and pushed by Jenkins (Phase 6/7). All three dev workloads are pinned to the
  **signed CI digests** of run `22-b20ab29` (`api@628c02fe`, `frontend-user@d2b5dc7d`,
  `frontend-admin@610ddd3e`).
- `gitops/environments/{dev,staging,prod}` overlays (digest pins per env) are the intended structure;
  today `gitops/base/` is the dev source. Promotion copies the exact digest — never a rebuild.

## Proof (real)
| Behaviour | Method | Result |
|---|---|---|
| Auto-sync | pushed a label change to `gitops/base/api.yaml` | applied in **~110 s** (Synced/Healthy) |
| Drift self-heal | `kubectl scale deploy/api --replicas=2` | reverted to **1 in ~10 s** |
| Rollback | Git commit removing the label, pushed | reverted in **~247 s** (< 5 min) |

Argo status throughout: `SYNC=Synced HEALTH=Healthy`.

## Deliberate scope decision (minimum resources)
Only `dev` is deployed. Running staging + prod would add ~2× (api + 2 frontends + Mongo) pods; the
operator's standing directive is **minimum cluster resources**. The staging/prod overlays + Applications
are therefore **not yet created** — this is recorded as a conscious trade-off, not an omission. Adding
them is mechanical: copy `gitops/apps/malaby-dev.yaml`, create the namespace + ESO resources for the env
(`ENVS="dev staging prod" vault-bootstrap.sh`), and point the overlay at the same digests.

## Notes / limitations
- `OrphanedResourceWarning` (6): the namespace, `eso-vault` SA, SecretStore and ESO Secrets are managed
  outside this Application (secrets via ESO; namespace via Phase 4). `orphanedResources.warn` is on.
- `targetRevision` is the feature branch today; switch to `main` after merge.
- App-of-apps bootstrap and a staging pre-sync smoke hook are Phase 11 work.
