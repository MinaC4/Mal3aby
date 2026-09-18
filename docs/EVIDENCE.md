# EVIDENCE — Index

The engagement's proof, by phase. Everything here is real command output (no simulation).

| Phase | Evidence | What it proves |
|---|---|---|
| 1 | `evidence/pre-engagement/` (git-ignored) | cluster state before changes |
| 2 | `phases/PHASE-2-REPORT.md` | `.env` not in image; planted secret blocked |
| 3 | `03-secrets-management.md` | Vault→ESO refresh; cross-env denial (200/403) |
| **4** | **`evidence/phase4-unauth-exploit.txt`** | **unauthenticated admin access to PII/state (the "before")** |
| **5** | **`evidence/phase5-auth-fix.txt`** | **same calls now 401; legit login works (the "after")** |
| 6 | `evidence/phase6-ci-success.txt` | full CI SUCCESS incl. cosign sign/verify |
| 7 | `07-key-management.md`, `07-supply-chain.md` | keys in Vault; Harbor robots |
| 8 | `08-gitops.md` | auto-sync, self-heal, rollback timings |
| 9 | `evidence/phase9-enforcement.txt` | valid pod allowed; 5 rejection cases |
| 10 | `evidence/phase10-netpol-test.txt`, `evidence/phase10-falco.txt` | blocked egress; Falco alert |
| 11 | `evidence/phase11-smoke.txt`, `evidence/phase11-load.txt` | smoke 6/6; load baseline |
| 12 | `12-observability.md` | Prometheus target up; 5 dashboards; 5 alerts |

## The centrepiece
`phase4-unauth-exploit.txt` (attack) sits next to `phase5-auth-fix.txt` (fix + 401). That pairing is the
single most important artifact of the engagement.
