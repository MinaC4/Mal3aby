# Runbook — Rollback
1. Preferred (GitOps): `git revert <bad-commit> && git push`; Argo syncs automatically (~2–4 min).
2. Emergency (pod-level): `kubectl rollout undo deploy/<svc> -n malaby-dev`.
3. Verify: `kubectl get application malaby-dev -n argocd` = Synced/Healthy; run the smoke Job.
