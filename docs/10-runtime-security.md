# 10 — Runtime Security (Falco)

Falco was **not** present on the cluster; it was installed (first-time) into the new namespace
`malaby-security` with the modern-eBPF driver (no kernel module) and small resources.

## Deployment
- Helm release `falco` (falcosecurity chart) in `malaby-security`; DaemonSet **3/3** nodes + the
  k8s-metacollector.
- Driver: `modern_ebpf` (no privileged kernel module build); resource requests 100m/256Mi per node.
- Custom rules (`customRules.malaby_rules.yaml`), 3 rules:
  1. **Malaby shell spawned in a malaby container** — `spawned_process and container and proc.name in (sh,bash,ash) and k8s.ns.name startswith "malaby-"`
  2. **Malaby unexpected outbound connection** — egress other than DNS(53)/Mongo(27017)
  3. **Malaby SA token read** — reading `/var/run/secrets/kubernetes.io/...`

## Detection evidence — `docs/evidence/phase10-falco.txt`
Trigger: `kubectl exec -n malaby-dev deploy/api -- sh -c 'echo malaby-falco-test'`
```
Warning Shell spawned in Malaby container (user=nodejs proc=sh ns=malaby-dev pod=api-... cmdline=sh -c echo malaby-falco-test)
```
The rule schema validated (`malaby_rules.yaml | schema validation: ok`).

## Honest status of the other two rules
- **SA token read** did not fire — by design: `automountServiceAccountToken: false` means there is no
  token to read. (This is the desired outcome, not a detection gap.)
- **Unexpected outbound** did not fire — the NetworkPolicy denies all non-DNS egress, so there is no
  unexpected connection to observe. Would fire if egress policy were loosened.

## Follow-ups
- Route Falco alerts to the existing Loki (additive output config) and to Alertmanager only with approval.
- Run a one-shot `kube-bench` Job for the nodes and record results (RBAC/nodes audit).
