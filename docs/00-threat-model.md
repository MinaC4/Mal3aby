# 00 — Threat Model (STRIDE) and Risk Register

Scope: application + delivery pipeline; cluster is the operator's homelab. Assets: booking/PII data,
admin capability (confirm/cancel/delete), DB credentials, image supply chain, cluster integrity.

## 1. STRIDE per trust boundary (see 00-architecture.md §4)
| Boundary | Spoofing | Tampering | Repudiation | Info disclosure | DoS | Elevation |
|---|---|---|---|---|---|---|
| TB1 Internet→SPA | fake login UI — currently trivial at TB4 | — | — | sourcemaps expose source (F13) | — | — |
| TB2 SPA→api | **any caller can hit any route** (F1) | unauthenticated write (F1) | no request audit log (F17) | listing endpoints leak all PII (F1) | no rate limit (F5) | public→admin with no creds (F1) |
| TB3 api→Mongo | creds in `.env` (F7) | — | — | URI leak → full DB | DB down → pod "healthy" (F16) | DB creds grant full access |
| TB4 AdminUI↔api | hardcoded `admin123` (F1) | client can be bypassed entirely | client-side flag | password in bundle/screen (F1) | — | **primary elevation path** |
| TB5 Build→image | unpinned base images (F10) | build-context `.env` copy (F8) | no provenance (F18) | secrets in image layers | — | image runs as root (F11) |

## 2. Risk register (ranked)
Severity = likelihood × impact, homelab context. "Phase" = where it is closed.

| ID | Risk | Sev | STRIDE | Control | Phase |
|---|---|---|---|---|---|
| F1 | Admin API (`GET/PUT/DELETE /bookings`, all `/notifications`) has zero server auth; `admin123` hardcoded in bundle and on login screen | Critical | Elevation/Info | `requireAdmin` JWT middleware, bcrypt hash from Vault, remove client-side check | 5 (demo 4→5, re-verify 11) |
| F2 | CORS `origin:'*'` default | High | Tampering | per-env `CORS_ORIGIN` allowlist | 5/8 |
| F3 | User input → Mongo `$regex` (ReDoS / unintended match) | High | DoS/Info | escape regex + cap length | 5 |
| F4 | `paymentScreenshotUrl` arbitrary string rendered as `<img>` | High | Tampering/XSS | validate scheme/host or disable endpoint | 5 |
| F5 | No rate limiting anywhere | High | DoS | express-rate-limit on write + login routes | 5 |
| F6 | No HTTP security headers on API | Medium | Info | `helmet` | 5 |
| F7 | DB credentials in plaintext `.env` | High | Info | Vault→ESO; no secrets in Git | 3 |
| F8 | `.dockerignore` (backend) does not exclude `.env`; `COPY . .` | High | Info | fix `.dockerignore`, prove no `.env` in image | 2/6 |
| F9 | `VITE_API_URL` build-time → not promotable | Medium | — | keep relative `/api` (already default); ADR | 6/8 |
| F10 | Unpinned base images `node:20-alpine`/`nginx:alpine` | Medium | Spoofing/Tamper | pin digests; scans/signing | 7 |
| F11 | Nginx images run as root | High | Elevation | non-root nginx variant + Kyverno restricted | 9 |
| F12 | No tests → pipeline gates nothing | Medium | Repudiation | add `npm test` (auth, regex, overlap) | 5/6 |
| F13 | `frontend-user` ships sourcemaps | Low | Info | disable sourcemap | 5 |
| F14 | No resource limits / probes / PDB | Medium | DoS | manifests + Kyverno | 4/9 |
| F15 | Atlas egress over public internet (or **chosen:** in-cluster Mongo removes this entirely) | Medium | Info | NetworkPolicy least egress; in-cluster Mongo is the securable choice | 10 |
| F16 | `connectDB` swallows errors; pod healthy without DB | Medium | DoS | readiness reflects DB; `/health` enhancement | 4/5 |
| F17 | No audit logging of admin actions | Medium | Repudiation | structured logs + Loki; 401/403 rate dashboard | 12 |
| F18 | No SBOM/signature/provenance | High | Tamper/Spoof | Syft + cosign sign/attest + Kyverno verify | 7/9 |
| F19 | time-slot `"08:00 AM"` vs 24h parser mismatch → overlap logic `NaN` | Medium | Tamper | **recorded**; only touched if it breaks gating | — |
| F20 | Unauthenticated ingress + no network segmentation | High | Elevation | default-deny NetworkPolicy + ingress scoping | 10 |
| F21 | Weak/shared platform creds (admin/admin123 on Jenkins/Harbor) | High | Spoofing | **operator-owned**; flagged, not modified | note |

## 3. Traceability to acceptance
- F1 is the load-bearing item: exploited for real in Phase 4, fixed and re-proven in Phase 5, re-verified by ZAP in Phase 11.
- Each F# maps to a phase deliverable and a `security/exceptions.yaml` entry where an accepted risk remains.
