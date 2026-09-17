# 02 — Git Strategy

## Remote and accounts
- `origin` = `https://github.com/MinaC4/Mal3aby` (GitHub — operator directive; Gitea excluded).
- Agent auth: `gh` as `Hephast0s`; added as collaborator by the owner. `push` may or may not include
  `admin` (branch-protection setup depends on it).
- Local `main` verified equal to `origin/main` (`97cf817`), **not behind**; fetch pruned stale remote
  branches. Nothing is ever force-pushed over `main`.

## Branch flow
```
feature/devsecops-foundation   (long-lived integration branch, pushed)
        │  per-phase commits, Conventional Commits, signed when a key is available
        ▼
main                           (merge only after a phase is verified 100%)
```
- `main` is protected conceptually: no direct commits, PR required, Jenkins check required.
- **Branch protection status: BLOCKED** — enabling protection needs repo admin, which the operating
  account may not have. Verify with `gh api repos/MinaC4/Mal3aby/branches/main/protection`.
  Until then it is an accepted, documented gap — never claim it is enforced.
- Merge cadence: **per phase**, once its Definition of Done is met (operator default).

## Commit conventions
- **Conventional Commits**, enforced locally by the `conventional-commit` commit-msg hook
  (`ci/scripts/commit-msg-conventional.sh`).
- Signing model and the (currently unresolved) operator key are in `docs/02-signing-identities.md`.

## Pre-commit gates (`.pre-commit-config.yaml`)
Runs the same class of checks as CI locally:
- hygiene: `check-merge-conflict`, `check-json`, `check-yaml`, `detect-private-key`,
  `end-of-file-fixer`, `trailing-whitespace`, `check-added-large-files` (≤2 MB)
- `guard-secret-files` — blocks staging `*.env`, `*.env.*`, `*.pem|key|p12|…`, `id_rsa*`, `.npmrc`,
  `credentials` (`ci/scripts/guard-secret-files.sh`)
- `gitleaks` (official image) — **blocking**, configured with `useDefault = true` (`.gitleaks.toml`);
  without that line a custom config silently disables all built-in rules
- `hadolint` on all Dockerfiles (failure threshold `warning`)
- `yamllint` (`.yamllint`), `shellcheck`
- backend `node --check`; both frontends `tsc --noEmit` (skipped with a clear message if `node_modules` absent)

Install: `pre-commit install`. Full run: `pre-commit run --all-files`.

## Repo topology
Single GitHub repository holding application + `ci/` + `security/` + GitOps manifests (directories),
rather than three separate repos. Rationale: single operator, least plumbing, still clean separation.
(Fallback: split into `malaby-gitops` later if Argo CD scoping benefits — see ADR-0001 D6.)
