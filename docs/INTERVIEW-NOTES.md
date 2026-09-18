# INTERVIEW NOTES — grounded in this project

1. **How did you find the auth gap, and how did you prove it was real?**
   Read every backend route: no auth middleware anywhere; the only "auth" was a client-side constant
   `admin123`. Proved it with an unauthenticated `curl` PUT that mutated a booking (Phase 4 transcript),
   then re-ran the same calls after the fix → 401 (Phase 5).
2. **Why fix the app before building the pipeline?**
   A pipeline around an unauthenticated admin API automates a broken system; the fix is the load-bearing
   security work, and CI then guarantees it can't silently regress (gitleaks + tests + ZAP later).
3. **How do you handle a database you don't control?**
   We didn't — we chose in-cluster MongoDB (ADR-0001 D5), which removed the need for internet egress and
   made the NetworkPolicy truly least-privilege. With Atlas it would have required a scoped egress hole.
4. **How is the supply chain secured end-to-end?**
   Kaniko builds (no host socket), syft SBOM, cosign sign+attest, in-pipeline verify, digest pins in Git,
   and Kyverno `verifyImages` (Audit today because Harbor is HTTP).
5. **What's still weak, honestly?**
   Vault dev-mode (ephemeral), unsigned commits (no GPG key), Kyverno restricted/verify in Audit
   (non-root nginx + HTTP registry), ZAP not executed, weak shared platform creds.
6. **How would you scale to 3 environments cheaply?**
   Same digests promoted across overlays; ESO per env; Argo Applications per env; staging auto-sync,
   prod manual. (Deferred here by the minimum-resource directive.)
7. **What would you do with 10× the budget?**
   Managed Vault, TLS everywhere (cert-manager + real CA for Harbor → Kyverno enforce), ephemeral
   preview envs, real DORA metrics from Jenkins/Prometheus, and a proper SBOM/vuln triage workflow.
8. **Why Kaniko over BuildKit/DinD?**
   Daemonless, no privileged pods, works with the Jenkins k8s plugin, and no host Docker socket
   (the previous project's accepted weakness). See ADR-0006.
9. **How do you prevent secret leakage?**
   gitleaks (pre-commit + CI), guard hook on env/key files, `.dockerignore` fix verified by a real build,
   and Vault→ESO as the only delivery path; rgrep confirms no credential in the tree.
10. **How do you know the tests actually gate?**
    `npm test` (node --test, 11 tests) runs in CI stage 4 and the build fails on failure; the auth
    middleware test asserts 401/403/200 explicitly.
11. **Why is the frontend image promotable across envs?**
    `VITE_API_URL` is left unset so the bundle uses relative `/api`, and Nginx proxies to the per-env
    `api` Service; no rebuild per environment.
12. **How do you detect an attack at runtime?**
    Falco custom rules (shell in container, unexpected egress, SA-token read) + the
    `malaby_admin_auth_failures_total` 401/403 metric and a dedicated alert.
