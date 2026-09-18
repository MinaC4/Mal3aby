# 12 — Observability & DevSecOps KPIs

## Metrics
- The `api` exposes Prometheus metrics at `/metrics` (`prom-client`): default Node metrics plus
  `malaby_http_requests_total`, `malaby_http_request_duration_seconds` (histogram), and
  `malaby_admin_auth_failures_total{reason}` (incremented on 401/403 in `requireAdmin`).
- `gitops/base/servicemonitor.yaml` (label `release: prometheus`) is discovered by the existing
  kube-prometheus-stack. Verified: `up{namespace="malaby-dev",job="api"} = 1`.
- A NetworkPolicy (`malaby-allow-monitoring`) permits Prometheus (ns `monitoring`) to scrape the api.

## Dashboards (Grafana, folder picked up automatically via the sidecar, ns `malaby-dev`)
| UID | Title | Focus |
|---|---|---|
| `malaby-overview` | Malaby — Overview | health, replicas, restarts, auth failures, traffic, latency, pods |
| `malaby-application` | Malaby — Application & API | request rate by route, 4xx/5xx, latency percentiles, error ratio, admin 401/403 |
| `malaby-runtime-security` | Malaby — Runtime & Security | running pods, restarts, OOMKills, admin auth failures, Kyverno results, Trivy vulns |
| `malaby-infrastructure` | Malaby — Infrastructure & Capacity | CPU/mem usage vs requests/limits, node utilisation |
| `malaby-supply-chain` | Malaby — Supply Chain & Delivery | deployment availability, running containers, deployed image digests |

All five loaded in Grafana and validated (6–13 panels each).

## Alerts (PrometheusRule `malaby-alerts`, verified loaded)
`MalabyApiDown`, `MalabyAdminAuthFailureSpike` (unauthenticated admin probing), `MalabyHighErrorRate`,
`MalabyPodRestarting`, `MalabyKyvernoPolicyFailures`.

## Logs
- **Loki is not installed** on this cluster (checked: no pods/services). Falco and app logs go to stdout
  only. Shipping to Loki is blocked on installing Loki (a new shared component → change request);
  recorded rather than faked.

## KPI definitions (for the dashboards)
- **Deployment frequency / lead time / change-failure / MTTR**: derived from CI + GitOps activity
  (Jenkins build history + Argo sync/rollback). Jenkins metrics require the Prometheus plugin; today
  these are tracked manually in `docs/METRICS.md`.
- **Supply-chain coverage**: signed images total vs deployed (see `docs/07-supply-chain.md`).
- **Security signal**: rate of `malaby_admin_auth_failures_total` (should stay ~0 after the auth fix).
