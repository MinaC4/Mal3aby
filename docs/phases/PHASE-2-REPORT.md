# Phase 2 Report — Git Strategy, Repositories, Pre-Commit Controls

Status: **COMPLETE** (local/repo only; zero cluster writes).
Date: 2026-09-18.

## Repo sync (operator request)
- `git fetch --all --prune`: stale `origin/devin/...` and `origin/rep` branches removed remotely;
  only `origin/main` remains.
- `git rev-parse HEAD main origin/main` → all `97cf817...`. `git rev-list --left-right --count main...origin/main`
  → `0    0` (not ahead/behind). **Local was not behind GitHub.**
- Work moved to branch `feature/devsecops-foundation`.

## Actions
- Fixed `malaby/backend/.dockerignore` (added `.env`, `.env.*`, `*.env`) and removed the `!.env`
  negation from `malaby/.dockerignore`. Verified with a real Docker build.
- Added pre-commit gates: `guard-secret-files`, `gitleaks`, `hadolint`, `yamllint`, `shellcheck`,
  backend `node --check`, frontend `tsc`, plus `conventional-commit` (commit-msg stage).
- Added `.gitleaks.toml` (`extend.useDefault = true` — the no-op trap found on the operator's prior
  engagement), `.hadolint.yaml`, `.yamllint`, `CODEOWNERS`, PR template, `SECURITY.md`, `CONTRIBUTING.md`.
- Docs: `docs/02-git-strategy.md`, `docs/02-signing-identities.md`.

## Evidence (real output)
```
# .dockerignore fix — real build with a dummy .env present in the context
PASS: no .env in image        (malaby/backend/.env absent from /app)
# planted secret (github PAT) + project gitleaks config
RuleID: generic-api-key ; leaks found: 1 ; exit=1
# tracked tree after allowlisting the git-ignored raw export
findings: 0
# hadolint (threshold=error)
backend PASS ; frontend-user PASS ; frontend-admin PASS
# yamllint
ci/services.yaml PASS ; .pre-commit-config.yaml PASS ; .hadolint.yaml PASS
# backend syntax
11 files node --check OK
```

## Deviations / notes
- hadolint emits non-blocking warnings (DL3025 shell-form HEALTHCHECK in all 3 Dockerfiles; DL3059/DL3066
  in backend). Threshold set to `error` per the plan's "BLOCKING on errors"; the warnings are recorded
  and will be resolved in Phase 7/9 when images are digest-pinned and rebuilt non-root.
- `pre-commit` itself is not installed on the host and `may_install_local_tools` is unapproved, so
  `pre-commit run --all-files` is `NOT EXECUTED`; each underlying tool was executed individually via its
  official container/CLI instead (evidence above).
- **Commit signing**: no operator/CI key supplied; commits are unsigned and this is documented in
  `docs/02-signing-identities.md` (ISSUES I-3).

## Definition of Done
- [x] Repos/branch created: GitHub `MinaC4/Mal3aby`, branch `feature/devsecops-foundation`
- [~] `main` protected — **blocked** (needs repo admin); documented, not claimed
- [x] Backend `.dockerignore` fixed and verified with a real build
- [x] Pre-commit config complete; each gate proven working individually
- [x] Deliberate test secret proven blocked (exit 1), then removed
- [ ] At least one verified signed commit — blocked on key (I-3)

## Resource impact
- Cluster: 0. Local: one transient Docker image (removed).
