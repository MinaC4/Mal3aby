# Phase 12 Report — Observability & KPIs

Status: **COMPLETE (core)**. Date: 2026-09-18.

## Delivered
- api `/metrics` (prom-client) + ServiceMonitor + monitoring NetworkPolicy → Prometheus target **UP**.
- 5 Grafana dashboards (validated via API; 6–13 panels each) covering overview, application/API,
  runtime+security, infrastructure/capacity, supply-chain/delivery.
- 5 Prometheus alerts (`malaby-alerts`) loaded by Prometheus.

## Evidence
- `up{namespace="malaby-dev",job="api"} = 1`.
- Grafana `/api/search?query=Malaby` → 5 dashboards.
- Prometheus `/api/v1/rules` → group `malaby.rules` with 5 alerts.

## Definition of Done
- [x] Prometheus scrapes malaby-* (ServiceMonitor + netpol)
- [x] ≥5 dashboards with real data queries
- [x] ≥1 alert proven loaded (5 loaded); end-to-end firing not yet exercised
- [ ] Loki log shipping — **blocked**: Loki not installed (change request)
- [ ] Jenkins/DORA metrics — require Jenkins Prometheus plugin (follow-up)

## Resource impact
- api image +prom-client (negligible). No new steady-state pods; Grafana/Prometheus reused.
