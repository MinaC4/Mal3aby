# Runbook — Failed deploy (Argo OutOfSync/Degraded)
1. `kubectl get application malaby-dev -n argocd -o jsonpath='{.status.conditions[*].message}'`
2. `kubectl get events -n malaby-dev --sort-by=.lastTimestamp | tail -20`
3. If admission-denied: check `kubectl get clusterpolicies | grep malaby` and the denied policy message.
4. If image pull fails: verify the digest exists in Harbor (`/api/v2.0/projects/malaby/repositories`).
5. Roll back: `git revert <commit> && git push` (Argo self-heals), or `kubectl rollout undo deploy/<svc> -n malaby-dev`.
