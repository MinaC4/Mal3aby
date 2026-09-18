# Contributing

## Workflow
1. Branch off `main`: `feature/<topic>` or `fix/<topic>`.
2. Make changes; run `pre-commit run --all-files` until clean.
3. Commit using **Conventional Commits** (`feat:`, `fix:`, `docs:`, `ci:`, `chore:`, `security:`).
4. Open a PR into `main`; the PR template's security checklist must be complete.
5. Squash-merge once the Jenkins check is green.

## Local setup
```bash
pre-commit install              # enable hooks
pre-commit run --all-files      # run every gate now
```

## Never
- Commit `.env*`, keys, or credentials.
- Push directly to `main`.
- Touch namespaces outside `malaby-*` on the shared cluster.

## Commit signing
See `docs/02-signing-identities.md`. CI/GitOps commits must be signed with the dedicated bot key.
