# ملعبي (Mal3aby) — Football Pitch Booking Platform + DevSecOps

<div align="center">

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?logo=mongodb)](https://mongodb.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Docker](https://img.shields.io/badge/-Docker-2496ED?logo=docker&logoColor=white)](https://docker.com)
[![k3s](https://img.shields.io/badge/k3s-Kubernetes-326CE5?logo=kubernetes&logoColor=white)](https://k3s.io)
[![Jenkins](https://img.shields.io/badge/Jenkins-CI-D24939?logo=jenkins&logoColor=white)](https://jenkins.io)
[![Argo CD](https://img.shields.io/badge/Argo%20CD-GitOps-EF7B4D?logo=argo&logoColor=white)](https://argo-cd.readthedocs.io)

**A full-stack football-pitch booking platform (booking API + two React SPAs) hardened and shipped with an
end-to-end DevSecOps pipeline on a k3s homelab.**

<img width="1918" height="950" alt="Screenshot 2026-05-18 223719" src="https://github.com/user-attachments/assets/8a50cca3-2adc-46aa-871f-55eb47227d3a" />

</div>

---

## Overview

Three services make up the application:

| Service | What it is | Image |
|---|---|---|
| `api` | Node/Express/Mongoose REST API (booking logic, JWT auth, Prometheus metrics) | `192.168.1.8:30082/malaby/api` |
| `frontend-user` | Public booking SPA (React + Vite, Nginx) | `.../malaby/frontend-user` |
| `frontend-admin` | Admin dashboard SPA (React + Vite, Nginx, JWT login) | `.../malaby/frontend-admin` |
| `mongodb` | In-cluster MongoDB 7 StatefulSet (local-path PVC) | `mongo:7.0` (digest-pinned) |

**Live (dev) environment:** `http://malaby-dev.192.168.1.8.nip.io` (user) ·
`http://malaby-admin-dev.192.168.1.8.nip.io` (admin) — managed by Argo CD from `main`.

## Features

**User app** — browse/search pitches, view details and pricing, pick available time slots, submit a
booking (pending), see a confirmation page.

**Admin dashboard** — JWT login, view all bookings, confirm/cancel, notifications feed, dashboard KPIs.

**Booking logic** — a `pending` booking does not block a slot; only `confirmed` bookings block
availability; overlapping confirms are rejected. Double-booking is prevented at the database level
(partial unique index) and by a whole-day overlap check (see `docs/BUGFIXES.md`).

## Security model

- **Every admin endpoint requires a JWT** issued by `POST /api/auth/login`; the password is verified
  against a **bcrypt hash in Vault** and the JWT signing secret also comes from Vault. No credential is
  hardcoded or shipped in the browser bundle.
- Rate limiting, `helmet`, regex-injection escaping, payment-URL validation, and an explicit CORS
  allowlist protect the API.
- Before/after proof: `docs/evidence/phase4-unauth-exploit.txt` →
  `docs/evidence/phase5-auth-fix.txt` (unauthenticated admin calls now return `401`).

## Architecture

```
internet → Traefik
  ├─ malaby-dev.<nip>.io        → frontend-user (nginx :8080)  ─┐ /api proxy
  └─ malaby-admin-dev.<nip>.io  → frontend-admin (nginx :8080) ─┤
                                                               ▼
                                                      api (Express :5000)
                                                               ▼
                                                      mongodb (StatefulSet :27017)
```
No internet egress from the app (MongoDB is in-cluster). Full diagram and delivery flow:
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## DevSecOps controls (live on `dev`)

| Area | Implementation |
|---|---|
| **Secrets** | HashiCorp Vault → External Secrets Operator → Kubernetes Secrets (`*-eso`); no secrets in Git |
| **CI** | Jenkins on Kubernetes pod agents (`malaby-ci`): gitleaks → lint → `npm test` (11 tests) → Semgrep → Trivy → Kaniko build/push → Syft SBOM → Trivy image → **cosign sign + attest + verify** |
| **Supply chain** | Images digest-pinned and **cosign-signed** (all three deployed digests verify against `security/cosign.pub`); CI builds additionally attach a CycloneDX SBOM attestation and run `cosign verify`; Harbor push/pull robots |
| **CD** | Argo CD (`Application malaby-dev`) automated sync + prune + self-heal; promotion by digest |
| **Admission** | Kyverno (**7 validation policies Enforce**, scoped to `malaby-dev`): labels, resources, probes, digest-only, registry, no SA token, **restricted Pod Security**; plus a default-deny NetworkPolicy generator; `verify-images` in Audit |
| **Network** | Default-deny NetworkPolicies; only DNS, ingress→frontends, frontends→api, api→mongo allowed |
| **Runtime** | Falco (modern-eBPF) with Malaby-specific rules (shell / unexpected egress / SA-token read) |
| **Observability** | api `/metrics` → Prometheus + 5 Grafana dashboards + 5 alerts |
| **Dynamic** | Smoke Job (6/6) + load baseline (`tests/`) |

## Repository layout

```
.
├── malaby/                 # application source
│   ├── backend/            #   api (Express, auth, metrics, tests)
│   ├── frontend-user/      #   public SPA (Nginx)
│   └── frontend-admin/     #   admin SPA (Nginx)
├── gitops/                 # deployment state (Argo CD source)
│   ├── base/               #   workloads, ingress, servicemonitor, dashboards, networkpolicies
│   ├── apps/               #   Argo AppProject + Application
│   ├── policies/           #   Kyverno ClusterPolicies (malaby-*)
│   └── secrets/            #   ExternalSecrets + SecretStore
├── ci/                     # agent templates, service matrix, scripts
├── tests/                  # smoke, load, dast
├── security/               # cosign.pub, exceptions, test fixtures
├── jenkins-library/        # shared library vars
├── docs/                   # analysis, ADRs, runbooks, evidence, phase reports
└── Jenkinsfile
```

## API overview

Full reference: [`malaby/docs/API_DOCUMENTATION.md`](malaby/docs/API_DOCUMENTATION.md).

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/login` | public (rate-limited) → JWT |
| GET | `/api/pitches`, `/api/pitches/:id`, `/api/pitches/:id/slots` | public |
| GET | `/api/bookings/availability` | public |
| POST | `/api/bookings` | public |
| PUT | `/api/bookings/:id/payment` | public (validated URL) |
| GET / PUT / DELETE | `/api/bookings*` (list/status/delete) | **admin (JWT)** |
| GET / PUT / DELETE | `/api/notifications*` | **admin (JWT)** |
| GET | `/health`, `/metrics`, `/ready` | internal |

## Local development

```bash
# Backend (needs MONGODB_URI; see malaby/.env.example)
cd malaby/backend && npm ci && npm run dev      # :8000
# Frontends
cd malaby/frontend-user  && npm ci && npm run dev   # :5000 (proxies /api → :8000)
cd malaby/frontend-admin && npm ci && npm run dev   # :3001
# Tests
cd malaby/backend && npm test
```

## Docker (compose)

```bash
cd malaby
printf 'MONGODB_URI=%s\n' '<your-uri>' > .env
docker compose up --build -d
```

## Kubernetes / GitOps deployment (current path)

- Images are built and signed by Jenkins, pushed to Harbor project `malaby`.
- Argo CD application `malaby-dev` (see `gitops/apps/`) syncs `gitops/base` from `main`; secrets come
  from Vault via ESO (`gitops/secrets/`); Kyverno policies are in `gitops/policies/`.
- Vault is **dev-mode** on this homelab — re-run `ci/scripts/vault-bootstrap.sh` after a Vault restart.

## Honest limitations

- The dev environment is **HTTP-only** (no cert-manager/TLS on the homelab): the admin password and JWT travel unencrypted on the LAN.
- Vault runs in dev mode (in-memory): a restart wipes the `malaby/` secrets (idempotent bootstrap provided).
- Commits are **unsigned** (no GPG key configured).
- Kyverno `malaby-verify-images` is in **Audit** because Harbor is served over HTTP (Kyverno cannot verify);
  CI still enforces `cosign verify`. Deployed dev images are signed; SBOM **attestations** are produced by
  CI runs, so re-running CI on `main` re-attests the current code.
- ZAP DAST was not executed (scanner image pull); smoke + load were.
- Only `dev` is deployed (minimum-resource directive); staging/prod overlays are not created.
- Loki is not installed; app/Falco logs go to stdout only.
- Platform credentials (Jenkins/Harbor) are operator-owned and currently weak/shared (flagged, not changed).

## Documentation

[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) · [`docs/SECURITY.md`](docs/SECURITY.md) ·
[`docs/EVIDENCE.md`](docs/EVIDENCE.md) · [`docs/METRICS.md`](docs/METRICS.md) ·
[`docs/DEMO.md`](docs/DEMO.md) · [`docs/INTERVIEW-NOTES.md`](docs/INTERVIEW-NOTES.md) ·
[`docs/runbooks/`](docs/runbooks/) · full phase history [`docs/phases/`](docs/phases/) ·
live state [`docs/STATE.md`](docs/STATE.md).
