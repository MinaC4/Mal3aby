#!/usr/bin/env bash
# Blocks committing files that must never enter Git: env files, key material, certs.
# Used by the pre-commit hook (guard-secret-files) and callable in CI.
set -uo pipefail

# Template/example env files are allowed (they must contain no real values).
allowed='(^|/)\.env\.(example|sample|template)$'

patterns=(
  '(^|/)\.env$'
  '(^|/)\.env\..+$'
  '(^|/).+\.env$'
  '\.(pem|key|p12|pfx|jks|keystore)$'
  '(^|/)id_(rsa|dsa|ecdsa|ed25519)(\..+)?$'
  '(^|/)\.npmrc$'
  '(^|/)credentials$'
)

failed=0
while IFS= read -r file; do
  [ -z "$file" ] && continue
  if [[ "$file" =~ $allowed ]]; then continue; fi
  for p in "${patterns[@]}"; do
    if [[ "$file" =~ $p ]]; then
      echo "BLOCKED secret-like file: $file (matched $p)"
      failed=1
    fi
  done
done < <(git diff --cached --name-only --diff-filter=ACM 2>/dev/null)

if [ "$failed" -ne 0 ]; then
  echo "Commit rejected: remove the file(s) above or add a narrow, justified exception."
  exit 1
fi
echo "guard-secret-files: no secret-like files staged."
