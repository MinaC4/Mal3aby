# Phase 7 Report — Security Gates, SBOM, Signing, Attestation

Status: **substantially COMPLETE** (gates + SBOM + sign/attest/verify operational in CI; two
deliberate-sabotage verifications still pending). Date: 2026-09-18.

## Delivered
- **Gates** wired in CI stages 2–11 (see `docs/07-security-policy.md`); the full pipeline is SUCCESS.
- **SBOM**: syft CycloneDX + SPDX per image, stashed and archived.
- **Signing/attestation/verification**: key-based cosign; all three images signed, attested with the
  CycloneDX SBOM, and verified in-pipeline (real output in `docs/evidence/phase6-ci-success.txt`).
- **Key management**: keypair in Vault (`malaby/data/dev/cosign`) + Jenkins credentials
  `malaby-cosign-{key,pub,password}`; public key published at `security/cosign.pub`.
- **Harbor robots**: `malaby-ci-push` (pull+push) and `malaby-cluster-pull` (pull-only);
  `harbor-push` k8s secret switched to the push robot and verified.
- Docs: `07-security-policy.md`, `07-key-management.md`, `07-supply-chain.md`.

## Evidence
- `docs/evidence/phase6-ci-success.txt` — `Finished: SUCCESS` with cosign sign/verify output.
- Harbor `malaby/api:22-b20ab29` shows `signature.cosign` accessories.
- `docker login` + push with `robot$malaby+malaby-ci-push` succeeded.

## Definition of Done
- [x] Every CI image signed by digest-resolved signature with SBOM + attestation
- [x] Verification passes in-pipeline using the public key
- [x] Push-only robot used by CI (admin no longer required for pushes)
- [ ] Deliberate vulnerable-dependency failing the build — **NOT EXECUTED** (trivy stages are
      report-only today; tighten to `--exit-code 1 --severity CRITICAL` and record a failing run)
- [ ] Deliberate fake secret failing the build — proven at pre-commit; **CI-level run NOT EXECUTED**
- [ ] Sign explicitly by digest (currently by tag → digest) — follow-up
- [ ] Mirror/pin base images (`mongo:7.0`) in Harbor — follow-up

## Notes
- The two NOT EXECUTED items are deliberate: they require a dedicated red-build run (~30 min each) and
  are tracked rather than faked.
- Kyverno enforcement of signatures is Phase 9 and will consume `security/cosign.pub`.
