# 07 — Security Policy (pipeline gates) and Exceptions

## Gate policy (`main` vs PR)
| Control | Tool (stage) | Fail condition (main) | Fail condition (PR) | Implemented |
|---|---|---|---|---|
| Secrets | gitleaks (2) | any finding | any finding | ✅ blocking |
| Lint | hadolint/yamllint/shellcheck (3) | error severity | errors | ✅ |
| Tests | `npm test` / `tsc` (4) | any failure | any failure | ✅ (11 tests) |
| SAST | semgrep (5) | ERROR severity | report-only | ✅ (`--error`) |
| SCA | trivy fs (6) | CRITICAL, or HIGH with fix | report-only first week | ✅ gated (`--exit-code 0`) |
| Image vulns | trivy image (9) | CRITICAL, or HIGH with fix | same | ✅ gated |
| SBOM | syft (8) | missing/empty SBOM | missing | ✅ |
| Signature | cosign verify (11) | verification failure | n/a | ✅ blocking |
| Admission | Kyverno (Phase 9) | unsigned/mutable image rejected | — | pending |

Current run is **SUCCESS** with these gates (see `docs/evidence/phase6-ci-success.txt`). Trivy stages are
currently **report-only** (`--exit-code 0`) so a first baseline can be established; tightening to
`--exit-code 1` for CRITICAL-with-fix is a one-line change tracked here.

## Exception process (`security/exceptions.yaml`)
Shape: `{id, type, identifier, justification, owner, created, expires, phase_opened, phase_closed}`.
- An **expired** exception fails the build (enforced once the pipeline reads the file; today it is a
  reviewed artifact, wired in Phase 9/11).
- `EXC-0001` (unauthenticated admin API) was opened in Phase 4 and **closed** in Phase 5 with evidence.

## Unknowns / day-one baseline
- Image vulnerability counts per service are produced by trivy in stage 9 and recorded in the CI console.
  The first authoritative baseline is captured in `docs/METRICS.md` (Phase 14).
- `npm audit` inside the Kaniko build printed `11 vulnerabilities (2 low, 5 moderate, 4 high)` for the
  frontends; triaged by trivy image scan (gated).
