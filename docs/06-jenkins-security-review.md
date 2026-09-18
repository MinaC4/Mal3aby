# 06 — Jenkins Security Review (rule 1.14)

> Jenkins (`jenkins/jenkins-0`) is **down** (`Error`, StatefulSet 0/1; CR-1). Several checks below could
> not be performed against the live API and are explicitly marked **NOT EXECUTED** — not guessed.

## What was observed (read-only)
- URL: `http://192.168.1.8:30081` (NodePort). When up earlier, `/login` returned `200`.
- A **Kubernetes cloud is configured** (log: "Stopping watch for kubernetes cloud kubernetes"),
  and a JNLP agent endpoint `jenkins-agent:50000` exists.
- Known admin credential is weak/shared (`admin` / a common password) — finding **J-1**.
- The 1.x-values init container copies plugins into a shared volume; it loops on `cp ... overwrite?`
  (no `-f`), which is why the pod cannot start — operational, not strictly security, but it blocks CI.

## Assessment
| # | Area | Finding | Severity | Action |
|---|---|---|---|---|
| J-1 | Authentication | Admin password is weak/shared across the homelab | High | operator: rotate; not changed by this engagement |
| J-2 | Anonymous read/access | **NOT EXECUTED** (controller down) — cannot confirm `anonymous` has no read | unknown | re-check when Jenkins is up |
| J-3 | Authorization / matrix | **NOT EXECUTED** — authorization strategy unknown | unknown | capture via `scriptApproval`/`authorizationStrategy` API |
| J-4 | Agent → controller | **NOT EXECUTED** — whether agents can reach the controller beyond their job | unknown | verify agent-to-controller access control |
| J-5 | Groovy sandbox | **NOT EXECUTED** — sandbox state / script approvals unknown | unknown | inspect when up |
| J-6 | Credential scoping | No Malaby credentials exist yet (CR-3); intend to scope all to this project | Medium | create scoped, per-use credentials |
| J-7 | Plugin CVEs | Plugin **versions unknown** (plugin manager API unavailable). Init log shows `kubernetes`,
  `workflow-*`, `configuration-as-code`, `credentials-binding`, `git`, `metrics` present | Medium | run `pluginManager` report when up; do **not** upgrade shared plugins without a change request |
| J-8 | Agent k8s API scope | Our RBAC (`ci/agents/rbac.yaml`) scopes the agent SA to `malaby-ci` only. If Jenkins' cloud
  currently uses a cluster-admin kubeconfig, that is broader than needed | High | CR-2: point the cloud at
  `system:serviceaccount:malaby-ci:jenkins-agent` |

## Positive controls we introduce
- CI runs gitleaks as the first gate; no credential is echoed; no host Docker socket.
- Pod agents drop ALL capabilities and run without privilege escalation.
- We never modify existing jobs or global Jenkins config; all changes are new objects or change requests.
