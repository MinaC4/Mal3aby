# Phase 9 Report — Admission Control (Kyverno)

Status: **PARTIAL — Enforce subset live and proven; two policies in Audit with documented blockers.**
Date: 2026-09-18.

## Delivered
- 7 policy objects scoped to `malaby-dev` (no collision with existing policies):
  `malaby-{require-labels,require-resources,require-probes,disallow-latest,restrict-registry,sa-token}`
  in **Enforce**, plus `malaby-restricted` and `malaby-verify-images` in **Audit**, plus
  `malaby-generate-default-deny` (generates a default-deny NetworkPolicy for opted-in namespaces).
- Workloads adjusted to pass: `automountServiceAccountToken: false` on all pods, `mongo` pinned by
  digest, `malaby-restricted`/probes/resources already satisfied.
- Manifests in `gitops/policies/`; promoted by Argo CD.

## Evidence — `docs/evidence/phase9-enforcement.txt`
Valid pod **allowed**; tag-not-digest, wrong-registry, missing-limits, automount-true, privileged each
**denied** with the specific policy/PSA message.

## Definition of Done
- [x] Policies scoped to `malaby-*` only; existing namespaces unaffected (scoped by `resources.namespaces`)
- [x] Unsigned/tag image rejected; wrong registry rejected; missing limits rejected; privileged rejected
- [x] Legitimate workload passes (all `malaby-dev` pods Running under Enforce)
- [ ] `:latest` specifically — covered by `malaby-disallow-latest` (any non-digest tag denied; proven with a tag)
- [ ] restricted Pod Security enforced — **Audit**; blockers: non-root nginx + mongo non-root (documented)
- [ ] cosign signature enforced at admission — **Audit**; Kyverno cannot verify over HTTP Harbor (documented)

## Notes / follow-ups
- `malaby-generate-default-deny` requires the namespace to carry `malaby.io/netpol: "true"`; `malaby-dev`
  does not, so no netpol is generated yet (NetworkPolicy is Phase 10).
- A `policy-reporter` UI exists; `PolicyReport` in `malaby-dev` shows residual Audit findings.
