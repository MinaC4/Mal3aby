# Phase 13 Report — Developer Portal (Backstage)

Status: **catalog authored; registration pending operator** (Backstage is present but needs an auth
token to register a location). Date: 2026-09-18.

## Delivered (repo)
- `catalog-info.yaml` — `System` malaby + Components `malaby-api`, `malaby-frontend-user`,
  `malaby-frontend-admin`, Resource `malaby-mongodb`; `dependsOn` mirrors the call graph; links to
  Jenkins job, Harbor repo, Grafana dashboard, live sites.
- `mkdocs.yml` — TechDocs nav over the engagement docs (plugin `techdocs-core`).

## Registration
- Backstage ingress: `backstage.192.168.1.8.nip.io`. Registration is additive (new location), but the
  catalog API requires a Backstage token/resolver; that credential was not provided, so the location is
  **not yet registered**. Steps for the operator:
  `backstage-cli` or the UI → Create → Register Existing Component → paste the `catalog-info.yaml` URL
  (`https://github.com/MinaC4/Mal3aby/blob/main/catalog-info.yaml`).

## Definition of Done
- [x] `catalog-info.yaml` with System + Components + dependencies + annotations
- [x] TechDocs config
- [ ] Registered in Backstage — **blocked on an auth token** (additive change once provided)
- [x] Existing portal entries untouched (nothing was applied to Backstage)
