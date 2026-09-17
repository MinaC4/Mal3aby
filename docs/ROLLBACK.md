# ROLLBACK

Ordered teardown for everything this engagement creates. Does **not** touch pre-existing resources.

## Created so far (Phase 3–4) and their removal
1. `kubectl delete -f gitops/base/ -n malaby-dev --ignore-not-found` (api/frontends/mongodb/ingress)
2. `kubectl delete -f gitops/secrets/dev/ --ignore-not-found`
3. `kubectl delete ns malaby-dev --ignore-not-found`
4. Harbor: delete project `malaby` (UI or `DELETE /api/v2.0/projects/malaby`).
5. Vault (additive only): `DELETE /v1/sys/policies/acl/malaby-read-dev` ;
   `DELETE /v1/auth/kubernetes/role/malaby-dev` ; `vault secrets disable malaby` ;
   (kubernetes auth left in place if other projects use it — check before disabling).

## Planned full teardown (later phases)
6. `kubectl delete -f gitops/policies/ --ignore-not-found`
7. `kubectl delete -f gitops/argocd/ --ignore-not-found`
8. `kubectl delete ns malaby-staging malaby-prod malaby-security malaby-ci --ignore-not-found --wait=false`
9. `helm uninstall` **only** malaby-created releases (none planned; reuse existing).
10. GitHub: delete the feature branch (or close PR). Never rewrite `main` unless merged intentionally.

## Notes
- `kubectl delete ns` is safe only for the `malaby-*` namespaces created here.
- Never run `helm uninstall` against existing shared releases.
