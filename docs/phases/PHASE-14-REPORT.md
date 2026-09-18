# Phase 14 Report — Documentation & Portfolio Packaging

Status: **COMPLETE** (documentation set). Date: 2026-09-18.

## Delivered
- `README.md` gains a DevSecOps section linking the portfolio docs.
- `docs/ARCHITECTURE.md`, `SECURITY.md` (control catalogue ↔ threat IDs ↔ verification),
  `EVIDENCE.md` (indexed bundle), `METRICS.md`, `DEMO.md`, `INTERVIEW-NOTES.md`.
- Runbooks: `runbooks/{failed-deploy,rollback,secret-leak,admin-credential-rotation,vulnerability-response}.md`.
- ADRs: `docs/adr/ADR-0001-platform-choices.md`, `ADR-0006-image-builder.md`.
- Phase reports 0–14 under `docs/phases/`.

## The centrepiece
`docs/evidence/phase4-unauth-exploit.txt` next to `docs/evidence/phase5-auth-fix.txt` — the real
before/after of the authentication fix.

## Definition of Done
- [x] A reader can understand the system from the docs alone
- [x] Every claim is backed by an artifact under `docs/evidence/` or a phase report
- [ ] `docs/METRICS.md` DORA figures are partly manual (Jenkins Prometheus plugin is a follow-up)

## Honest limitations (also in README/SECURITY)
Vault dev-mode; unsigned commits; Kyverno restricted/verify in Audit; ZAP not executed; staging/prod
not deployed (minimum-resource directive); Loki absent; Backstage registration pending a token.
