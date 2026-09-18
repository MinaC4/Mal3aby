# 07 — Supply Chain: SBOM, Signing, Attestation

## Per-image artifacts
| Artifact | Tool | Where |
|---|---|---|
| CycloneDX JSON + SPDX JSON | syft (stage 8) | Jenkins artifacts `sbom-<svc>.{cdx,spdx}.json`; stashed for attest |
| Cosign signature | cosign sign (stage 10) | in Harbor: `signature.cosign` accessory on the image digest |
| CycloneDX attestation | cosign attest (stage 10) | in Harbor: attestation attached to the image digest |
| Verification | cosign verify (stage 11) | console output, blocking |

## Verification (real, from the successful CI run)
```
cosign sign   ... malaby/{api,frontend-user,frontend-admin}:22-b20ab29  -> Pushing signature to: ...
cosign verify ... (x3)
  The following checks were performed on each of these signatures:
    - The signatures were verified against the specified public key
Finished: SUCCESS
```
Harbor confirms `signature.cosign` accessories on `malaby/api:22-b20ab29`.

## Provenance honesty
- We do **not** claim certified SLSA. The attestation is a CycloneDX SBOM attestation plus the cosign
  signature; any provenance predicate must be labeled as **self-attested**, not a certified builder.

## Known limitations (to close)
1. **Signing by tag**: stage 10 passes `repo:tag`; cosign resolves it to the current digest and attaches
   the signature to the digest (a warning is printed). Phase 7 follow-up: sign explicitly by digest
   (resolve the digest after push and pass `repo@sha256:…`).
2. **Base-image mirroring**: `mongo:7.0` is still pulled from docker.io; mirror it into Harbor `library`
   (or `malaby`) and pin by digest.
3. **Kyverno enforcement**: `security/cosign.pub` is published but not yet enforced at admission — Phase 9.
4. **Digest pins in GitOps**: Phase 8 writes the pushed digests into the environment overlays.

## Reproducibility
- The pipeline builds from a clean SCM checkout each run; `npm ci` uses lockfiles; images are built
  rootless/daemonless with Kaniko. The only unpinned inputs are the base images (limitation #2).
