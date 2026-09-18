# DEMO — Script (10 minutes)

1. **The flaw (30s).** Open `http://malaby-admin-dev.<nip>.io` and the API is unprotected:
   `curl -s http://malaby-admin-dev.192.168.1.8.nip.io/api/bookings` → `401` now; before the fix it
   returned all customer PII (see `docs/evidence/phase4-unauth-exploit.txt`).
2. **The fix (60s).** `POST /api/auth/login` with the Vault password → JWT; `GET /api/bookings` with
   `Authorization: Bearer` → `200`. Show `docs/evidence/phase5-auth-fix.txt`.
3. **CI (4 min).** Trigger the `malaby-ci` job. Walk the stages: gitleaks → lint → tests 11/11 →
   semgrep 0 → trivy → Kaniko builds → SBOM → trivy image → cosign sign/attest → verify.
   Show Harbor carries `signature.cosign`.
4. **GitOps (2 min).** Argo `malaby-dev` is `Synced/Healthy`. Scale `api` to 2 → self-heals to 1 in ~10s.
   Commit a change → auto-syncs in ~110s. Roll back with `git revert` → ~4 min.
5. **Guardrails (2 min).** Kyverno: try `kubectl run` with a tag / wrong registry / no limits →
   denied (`docs/evidence/phase9-enforcement.txt`). NetworkPolicy: from a test pod, `api`/`mongo`/
   internet are blocked; DNS works.
6. **Detect (30s).** `kubectl exec -n malaby-dev deploy/api -- sh -c true` → Falco alert.
7. **Observe (1 min).** Grafana → 5 Malaby dashboards; Prometheus target `up=1`; alert rules loaded.
