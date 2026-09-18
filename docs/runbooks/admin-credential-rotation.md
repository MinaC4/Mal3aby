# Runbook — Admin credential rotation
1. New bcrypt hash: `node -e "console.log(require('bcryptjs').hashSync(process.argv[1],10))" '<newpw>'`.
2. `vault kv patch malaby/dev/api ADMIN_PASSWORD_HASH='<hash>' ADMIN_PASSWORD='<newpw>'`.
3. Wait ≤30s (ESO), `kubectl rollout restart deploy/api -n malaby-dev`.
4. Existing JWTs remain valid until `JWT_SECRET` is rotated too; rotate it to force re-login.
