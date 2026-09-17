# Pull Request

## What changed
<!-- one paragraph -->

## Security checklist (required)
- [ ] No secret, token, password, key, or connection string is added to the diff
- [ ] No `.env*`, `*.pem`, `*.key`, `id_*` file is committed
- [ ] Any change to an admin/auth endpoint keeps it behind `requireAdmin` (or is justified)
- [ ] Input that reaches a query/regex/shell is validated or escaped
- [ ] New images are pinned by digest (or a TODO references the pinning phase)
- [ ] `pre-commit run --all-files` passes locally
- [ ] No change modifies a namespace outside `malaby-*`

## Verification
<!-- exact commands + observed output, or "CI will verify" -->

## Rollback
<!-- how to revert safely -->
