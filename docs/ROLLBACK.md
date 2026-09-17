# ROLLBACK

Ordered teardown for everything this engagement creates. Does **not** touch pre-existing resources.

## Planned teardown order (filled as objects are created)
1. `kubectl delete -f malaby-gitops/argocd/ --ignore-not-found` (Applications only)
2. `kubectl delete -f malaby-gitops/policies/ --ignore-not-found`
3. `kubectl delete -f malaby-gitops/secrets/ --ignore-not-found`
4. `kubectl delete ns malaby-dev malaby-staging malaby-prod malaby-security malaby-ci --ignore-not-found --wait=false`
5. `helm uninstall` **only** malaby-created releases if any (none planned; reuse existing).
6. Harbor: delete project `malaby` (operator action or `harbor` UI).
7. Vault: delete `malaby/` mount + `malaby` policy/role (operator action).
8. GitHub: delete the feature branch (or close PR). Never rewrite `main` unless merged intentionally.

## Notes
- `kubectl delete ns` is safe only for the `malaby-*` namespaces created here.
- Never run `helm uninstall` against existing shared releases.
