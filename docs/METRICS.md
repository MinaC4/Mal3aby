# METRICS — Measured Numbers

## Delivery
- **Build (full CI)**: ~25–35 min on `malaby-ci` pods (dominated by scanner image pulls and 3 Kaniko
  builds on the homelab). Stages 1–6 ≈ 8 min; 7a/b/c ≈ 12 min; 8–11 ≈ 10 min.
- **Deploy**: Argo auto-sync after a Git commit ~110 s (poll); drift self-heal ~10 s; rollback ~247 s.
- **Frequency**: on-demand (manual trigger via API today); webhook is a follow-up.

## Supply chain
- 3 images built and pushed per run: `api`, `frontend-user`, `frontend-admin`.
- All 3 signed (cosign) + CycloneDX-attested + verified in-pipeline.
- Harbor project `malaby` with push-only and pull-only robots.

## Vulnerabilities (as reported by CI, ungated baseline)
- `npm audit` during frontend builds: `11 vulnerabilities (2 low, 5 moderate, 4 high)`.
- trivy image scan runs per image (report-only today; tighten to fail on CRITICAL-with-fix).

## Capacity (steady state, malaby-dev)
- api 50m/64Mi req (lim 250m/256Mi), frontends 10m/32Mi (lim 100m/64Mi), mongo 100m/256Mi (lim 500m/512Mi).
- Actual observed ≈ 53m CPU / 157Mi RAM for the app; Falco adds ~100m/256Mi per node.
- **Load baseline** (`GET /api/pitches`, 200 req, conc 10, loaded node): p50 1400 ms, p95 1759 ms,
  p99 2225 ms, 7.1 rps, 0 errors. High due to multi-hop proxy + loaded node; recommend api CPU
  limit 250m→500m and re-measure.

## Security signal
- `malaby_admin_auth_failures_total`: should stay ~0 post-fix; a spike alerts (`MalabyAdminAuthFailureSpike`).
