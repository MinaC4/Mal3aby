# CHANGE REQUESTS

Changes that touch **shared** components or need operator action. None are applied until approved.

## CR-1 — Restore the shared Jenkins instance (BLOCKING Phase 6)
- **State:** `jenkins-0` is `Error` (0/3); StatefulSet `jenkins/jenkins` is `0/1`. The `init` initContainer
  loops on `cp: overwrite '/var/jenkins_plugins/...'?` (no `-f`), so the pod never becomes Ready.
  Main container last exit `143` (SIGTERM, graceful "Stopping Jenkins") at `2026-09-18T00:44:16Z`.
- **Why:** Jenkins is required to execute the Phase 6 pipeline. The Kubernetes cloud is already
  configured in Jenkins ("Stopping watch for kubernetes cloud kubernetes").
- **Proposed fix (operator action or approval for the agent to do it):**
  1. If Jenkins is intentionally scaled down: `kubectl scale statefulset/jenkins -n jenkins --replicas=1`
     (currently already 1) and ensure the pod restarts cleanly.
  2. If the plugin-init copy loop is the cause: the chart's plugin init should use `cp -f` /
     `cp -an`. Chart-level fix or clearing the stale plugin volume is required.
  3. Rollback: none needed (no change yet).
- **Blast radius:** `jenkins` namespace only; no other project depends on the change.
- **Decision needed:** may the agent delete/restart `pod/jenkins-0` and/or patch the chart's init
  command? (Rule 1.1 forbids this without explicit approval.)

## CR-2 — Register the shared library + confirm the agent namespace
- Register `malaby-jenkins-library` (path `jenkins-library/` in this repo) as a **global** Jenkins
  shared library named `malaby-jenkins-library` (Manage Jenkins → System → Global Pipeline Libraries).
  This is a global-config change → needs approval.
- Confirm the Kubernetes cloud's pod namespace/credentials; our least-privilege RBAC is in `malaby-ci`
  (`ci/agents/rbac.yaml`). If the cloud currently uses cluster-admin, point it at SA `jenkins-agent`
  in `malaby-ci`.

## CR-3 — Jenkins credentials to create (additive, in Jenkins only)
| ID | Type | Used by |
|---|---|---|
| `harbor-push` | Username/Password (robot) | Kaniko `/kaniko/.docker/config.json` |
| `cosign-key` | Secret file | sign/attest |
| `cosign-password` | Secret text | cosign key password |
| `cosign-pub` | Secret file | verify |
| `github-token` | Secret text | GitOps digest-push |

## CR-4 — Signing identity (GPG) and cosign key
- No operator GPG key exists; commits are unsigned. Create a dedicated `malaby-ci-bot` GPG key (private
  key in Vault) for signed GitOps commits, and a cosign key pair (private in Vault). Needed for Phase 7.
