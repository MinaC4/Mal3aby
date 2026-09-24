#!/usr/bin/env bash
# vault-bootstrap.sh — idempotent Malaby secrets bootstrap.
#
# The homelab Vault runs in DEV MODE (emptyDir, root token `root`), so its state is
# lost on every pod restart. Re-run this script after any Vault restart:
#
#   VAULT_ADDR=http://192.168.1.8:30086 VAULT_TOKEN=root ./ci/scripts/vault-bootstrap.sh
#
# It creates, additively and only under the `malaby/` mount:
#   - KV v2 mount  malaby/
#   - policy       malaby-read
#   - k8s auth     kubernetes/ role per namespace (eso-vault SA)
#   - secrets      malaby/data/<env>/{api,mongodb}
# Existing secret paths are never overwritten unless FORCE=1.
set -euo pipefail

VAULT_ADDR="${VAULT_ADDR:-}"
VAULT_TOKEN="${VAULT_TOKEN:-}"
FORCE="${FORCE:-0}"
ENVS="${ENVS:-dev}"

[ -n "$VAULT_ADDR" ] || { echo "error: set VAULT_ADDR"; exit 1; }
[ -n "$VAULT_TOKEN" ] || { echo "error: set VAULT_TOKEN (dev-mode Vault uses 'root')"; exit 1; }

api() { # method path [json]
  local m="$1" p="$2" d="${3:-}"
  if [ -n "$d" ]; then
    curl -sS -o /tmp/vb.out -w '%{http_code}' -X "$m" \
      -H "X-Vault-Token: $VAULT_TOKEN" -H 'Content-Type: application/json' \
      --data "$d" "$VAULT_ADDR/v1/$p"
  else
    curl -sS -o /tmp/vb.out -w '%{http_code}' -X "$m" \
      -H "X-Vault-Token: $VAULT_TOKEN" "$VAULT_ADDR/v1/$p"
  fi
}

rand() { openssl rand -hex "${1:-24}"; }
urlenc() { printf '%s' "$1" | jq -sRr @uri; }

echo "==> KV v2 mount malaby/"
code=$(api POST sys/mounts/malaby '{"type":"kv","options":{"version":"2"}}')
case "$code" in 204|200) echo "    enabled";; 400) echo "    already enabled";; *) echo "    ERROR $code: $(cat /tmp/vb.out)"; exit 1;; esac

echo "==> per-env policies (least privilege: each env reads only its own path)"
for env in $ENVS; do
  policy="path \"malaby/data/$env/*\" { capabilities = [\"read\"] }
path \"malaby/metadata/$env/*\" { capabilities = [\"read\",\"list\"] }"
  code=$(api PUT "sys/policies/acl/malaby-read-$env" "$(jq -n --arg p "$policy" '{policy:$p}')")
  [ "$code" = "204" ] || [ "$code" = "200" ] || { echo "    policy $env ERROR $code: $(cat /tmp/vb.out)"; exit 1; }
  echo "    malaby-read-$env written"
done

echo "==> kubernetes auth"
code=$(api POST sys/auth/kubernetes '{"type":"kubernetes"}')
case "$code" in 204|200) echo "    enabled";; 400) echo "    already enabled";; *) echo "    ERROR $code"; exit 1;; esac
code=$(api POST auth/kubernetes/config '{"kubernetes_host":"https://kubernetes.default.svc:443"}')
[ "$code" = "204" ] || [ "$code" = "200" ] || { echo "    config ERROR $code: $(cat /tmp/vb.out)"; exit 1; }
echo "    configured"

for env in $ENVS; do
  echo "==> role + secrets for env=$env"
  code=$(api PUT "auth/kubernetes/role/malaby-$env" "$(jq -n --arg ns "malaby-$env" --arg pol "malaby-read-$env" \
    '{bound_service_account_names:"eso-vault",bound_service_account_namespaces:$ns,policies:$pol,ttl:"1h",max_ttl:"24h"}')")
  [ "$code" = "204" ] || [ "$code" = "200" ] || { echo "    role ERROR $code: $(cat /tmp/vb.out)"; exit 1; }

  # api secret
  if [ "$FORCE" = "1" ] || [ "$(api GET "malaby/data/$env/api")" = "404" ]; then
    jwt="$(rand 32)"; adminpw="$(rand 16)"
    cors="http://malaby-$env.192.168.1.8.nip.io,http://malaby-admin-$env.192.168.1.8.nip.io"
    hash="$(node -e "console.log(require('./malaby/backend/node_modules/bcryptjs').hashSync(process.argv[1],10))" "$adminpw" 2>/dev/null || true)"
    if [ -z "$hash" ]; then echo "    ERROR: bcryptjs not found — run 'npm ci' in malaby/backend first"; exit 1; fi
    code=$(api POST "malaby/data/$env/api" "$(jq -n --arg j "$jwt" --arg a "$adminpw" --arg h "$hash" --arg c "$cors" \
      '{data:{JWT_SECRET:$j, ADMIN_PASSWORD:$a, ADMIN_PASSWORD_HASH:$h, ADMIN_USERNAME:"admin", CORS_ORIGIN:$c}}')")
    [ "$code" = "204" ] || [ "$code" = "200" ] || { echo "    api secret ERROR $code: $(cat /tmp/vb.out)"; exit 1; }
    echo "    wrote malaby/data/$env/api"
  else
    echo "    malaby/data/$env/api exists (skip; FORCE=1 to overwrite)"
  fi

  # mongodb secret + composed URI
  if [ "$FORCE" = "1" ] || [ "$(api GET "malaby/data/$env/mongodb")" = "404" ]; then
    rootuser="root"; rootpw="$(rand 18)"; appuser="malaby"; apppw="$(rand 18)"
    uri="mongodb://$appuser:$apppw@mongodb.malaby-$env.svc.cluster.local:27017/malaby?authSource=malaby"
    code=$(api POST "malaby/data/$env/mongodb" "$(jq -n \
      --arg ru "$rootuser" --arg rp "$rootpw" --arg au "$appuser" --arg ap "$apppw" --arg uri "$uri" \
      '{data:{MONGODB_ROOT_USERNAME:$ru, MONGODB_ROOT_PASSWORD:$rp, MONGODB_APP_USERNAME:$au, MONGODB_APP_PASSWORD:$ap, MONGODB_URI:$uri}}')")
    [ "$code" = "204" ] || [ "$code" = "200" ] || { echo "    mongodb secret ERROR $code: $(cat /tmp/vb.out)"; exit 1; }
    echo "    wrote malaby/data/$env/mongodb"
  else
    echo "    malaby/data/$env/mongodb exists (skip; FORCE=1 to overwrite)"
  fi
done

rm -f /tmp/vb.out
echo "==> done. Retrieve admin password with: vault kv get malaby/$env/api"
