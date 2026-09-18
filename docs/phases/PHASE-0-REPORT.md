# Phase 0 Report — Deep Application Comprehension

Status: **COMPLETE** (read-only; no cluster objects; no commits).
Date: 2026-09-18.

## Commands run (all read-only, local)
- `git status --short --branch`, `git remote -v`, `git log --oneline -5`
- `find malaby ... -not -path '*/node_modules/*' -not -path '*/dist/*'` + `wc -l` per file
- `grep -rIn "admin123"` / `grep -rIn "paymentScreenshotUrl"`
- `python3 -c yaml.safe_load` over `ci/services.yaml`
- Reads: backend `server.js`, `config/db.js`, `middleware/errorHandler.js`, all 3 models,
  all 3 route files, `Dockerfile`, `package.json`, `seed.js` (head), `clean.js`;
  both frontend `Dockerfile`/`nginx.conf`/`vite.config.ts`, `AuthContext.tsx`, `useAuth.ts`,
  both `hooks/useApi.ts`, `LoginPage.tsx`, `BookingsPage.tsx`; `docker-compose.yml`, `.env.example`,
  both `.dockerignore`, `docs/API_DOCUMENTATION.md`.
- Tier-2 `rg` across both `src/` trees for API calls, `localStorage`, `VITE_`, `token`.

## Deliverables
| File | Status |
|---|---|
| `docs/00-application-analysis.md` | ✅ |
| `docs/00-architecture.md` | ✅ |
| `docs/00-threat-model.md` | ✅ (21 risks F1–F21, each mapped to a control + phase) |
| `docs/00-build-matrix.md` | ✅ |
| `ci/services.yaml` | ✅ (validates as YAML) |

## Discrepancies vs the engagement's Section 2 (found during Phase 0)
1. `admin123` appears in **4** places, not 2 — including `LoginPage.tsx:115` which renders it on-screen,
   and `README.md:220`.
2. The `!.env` line is in `malaby/.dockerignore`, which compose never uses (build contexts are subdirs).
   The real exposure is `malaby/backend/.dockerignore` omitting `.env`.
3. `frontend-user/vite.config.ts` dev port `5000` collides with the api's `5000`.
4. No `.env` exists locally, so F8 is latent today.
5. No lockfile gap: all three services have lockfiles and use `npm ci`.

## New findings beyond Section 2.7
- `routes/pitches.js` `$regex` injection (F3) and `paymentScreenshotUrl` (F4) confirmed at exact lines.
- Time-slot format mismatch (`"08:00 AM"` vs 24h parser) — F19, recorded only.
- Platform credentials are weak/shared (F21) — operator-owned, flagged not touched.

## Definition of Done
- [x] All three services documented with `file:line` citations
- [x] Threat model ≥15 risks (21), each mapped to a control and phase
- [x] `ci/services.yaml` validates as YAML
- [x] `dist/` treated as artifact, not source
- [x] Document caps respected

## Cost
- Wall clock: ~1 session. Cluster resources: 0 (no cluster write). Local: read-only.

## Next phase
Phase 1 (infrastructure discovery, read-only) — **blocked** pending operator answers in `docs/STATE.md`
(Vault token, admin auth strategy, Mongo confirmation, install permissions, approval phrase).
