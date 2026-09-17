# ADR-0001 — Platform Choices (Phase 1)

Status: **accepted** (with two items still needing operator confirmation, marked ⚠).
Context: k3s homelab, many shared components already running, operator wants minimum resource use
with maximum quality. Additive-only contract; never duplicate a component (rule 1.12).

## Decisions

### D1. GitOps controller = Argo CD (reuse)
Argo CD v3.4.5 is the authoritative controller (manages `boutique-*`, `eshtry-mny`, `hephastos`).
Devtron also exists but will **not** be pointed at `malaby-*` (avoid two controllers fighting).
- Consequence: `argocd` namespace stays untouched; we add Applications only.

### D2. Registry = Harbor, project `malaby` (reuse)
Harbor 2.15.1 already backs the cluster. New project `malaby` only; immutable tags for released
semver tags; robot accounts: push-only for Jenkins, pull-only for the cluster (Phase 7).
- Fallback if `harbor_may_create_project = no`: use an existing repo under Harbor admin, documented.

### D3. Image signing = key-based cosign (homelab-appropriate)
Keyless (Fulcio/Rekor) needs OIDC + public-good infra; key-based is verifiable offline and simple.
Private key + password stored in Vault; public key published in `malaby-gitops` and a ConfigMap for
Kyverno. Always sign **by digest**. Provenance predicate is honestly labeled, not claimed as SLSA.

### D4. Policy engine = Kyverno (reuse)
Already installed. New policies prefixed `malaby-`, scoped via `namespaceSelector` to `malaby-*`,
rolled out Audit → Enforce. No change to existing `boutique-*` policies.

### D5. Data layer = in-cluster MongoDB (self-hosted) — operator directive
Atlas is replaced by a `StatefulSet` + `local-path` PVC in `malaby-dev` (and per env if needed).
- Consequences (materially better):
  - `api` egress becomes **intra-cluster only** → Phase 10 default-deny needs no public-internet hole.
  - No Atlas Network Access/egress-IP change needed; the whole F15 class disappears.
  - State is on `local-path` (Delete reclaim) → **dev data loss is acceptable**; stateful backup is
    the operator's Velero process. ⚠ Confirm whether staging/prod also get their own Mongo or dev-only initially.
  - Credentials are generated and flow Vault → ESO (never committed).

### D6. Git hosting = GitHub, branch-first workflow — operator directive
Repo `MinaC4/Mal3aby`. Work on `feature/devsecops-foundation`; merge to `main` only when 100% working.
`gh` authenticated as `Hephast0s`; operator added the agent as collaborator. Gitea is **not** used.
- ⚠ Repo topology to confirm: single repo holding app + GitOps + Jenkins shared library, vs. separate
  repos. Phase 2 assumes 3 logical areas; they can live as directories or repos. Default if no answer:
  **separate directories** in one repo for simplicity and least resource/plumbing.

### D7. TLS = no cert-manager; Traefik + nip.io hosts
cert-manager is absent and installing it is not justified for a homelab portfolio. Use
`malaby-<env>.192.168.1.8.nip.io` / `malaby-admin-<env>...` over HTTP, or self-signed if the operator
wants HTTPS. ⚠ Note the trade-off in `docs/SECURITY.md`.

### D8. Resource discipline = 1 replica/env, small requests, reuse
Measured headroom ~7.8Gi; planned app footprint ~768Mi. Only net-new security workload is Falco
(gated). No HPA. Ephemeral CI/scan pods carry no steady-state cost. See `01-capacity-budget.md`.

## Consequences / accepted trade-offs
- One GitOps controller (Argo CD) means Devtron drift is avoided by never registering `malaby-*` there.
- In-cluster Mongo removes internet egress but adds a stateful workload + backup responsibility.
- No cert-manager means no managed TLS; acceptable for a homelab demo, documented.
- Fixing application auth is mandatory (rule 1.7) and independent of these platform choices.
