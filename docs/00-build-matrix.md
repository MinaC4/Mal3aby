# 00 — Build Matrix

| Service | Context | Dockerfile | Language | Build cmd | Test cmd (today) | Lint cmd | Container port |
|---|---|---|---|---|---|---|---|
| api | `malaby/backend` | `malaby/backend/Dockerfile` | Node 20 / Express | `npm ci --only=production` | **none** (added Phase 5) | none (add Phase 2) | 5000 |
| frontend-user | `malaby/frontend-user` | `malaby/frontend-user/Dockerfile` | React+Vite+TS | `npm ci && npm run build` | `npm run check` (tsc only) | `npm run check` | 80 |
| frontend-admin | `malaby/frontend-admin` | `malaby/frontend-admin/Dockerfile` | React+Vite+TS | `npm ci && npx vite build` | `npm run check` (tsc only) | `npm run check` | 80 |

## Notes
- `api` uses `npm ci` in Docker but **no lockfile committed at `malaby/backend`**? Confirmed `malaby/backend/package-lock.json` exists (1,700 lines) → reproducible.
- Frontends have lockfiles; Dockerfile uses `npm ci`. Good.
- `frontend-admin` Docker build invokes `npx vite build` directly (not `npm run build`), and gets `VITE_BASE_URL=/`
  from compose. In k8s we build with no `VITE_API_URL` so the bundle uses relative `/api`.
- No Java/Go/.NET toolchain is needed anywhere — the CI node agent covers all three services.
- `frontend-*/dist/` are committed build outputs; they are **not** a source of truth and are ignored by the pipeline.

## Test gap
`ci/services.yaml` marks the `api` test as `npm test`, which does not exist until Phase 5. Until then the
pipeline treats it as a known gap and does not pretend to gate on it.
