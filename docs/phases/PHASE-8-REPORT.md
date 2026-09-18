# Phase 8 Report — GitOps Continuous Delivery

Status: **COMPLETE for dev** (auto-sync, drift self-heal, rollback proven). Date: 2026-09-18.

## Delivered (additive, cluster)
- Argo CD `AppProject/malaby` (scoped to this repo + `malaby-*`).
- Argo CD `Application/malaby-dev` (automated + prune + selfHeal) — `Synced/Healthy`.

## Delivered (repo)
- `gitops/apps/appproject-malaby.yaml`, `gitops/apps/malaby-dev.yaml`.
- `docs/08-gitops.md`.

## Evidence (real)
- Auto-sync: label change applied ~110 s after `git push`.
- Self-heal: manual scale to 2 reverted to 1 in ~10 s.
- Rollback: Git revert reflected in ~247 s.

## Definition of Done
- [x] dev running from Git (Argo CD)
- [x] drift reverted automatically in dev
- [x] rollback completes under 5 minutes with evidence
- [x] every image reference is a digest in the GitOps overlay — all three pinned to the signed CI
      digests of run `22-b20ab29`
- [ ] staging/prod from Git — **deliberately deferred** (minimum-resource directive); pattern documented
- [ ] single GitOps controller — yes (Argo CD); Devtron carries no `malaby-*` app

## Resource impact
- Argo CD already ran (reuse); 0 new steady-state pods.
