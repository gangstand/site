## 1. Remove the connection

- [x] 1.1 Delete the `wg-rabbitmq` entry from `HOMELAB_CONNECTIONS` in `src/features/explore-homelab/model/nodes.ts`; verify `npm run typecheck` still passes and no other declaration references the id (`grep -rn "wg-rabbitmq" src/` returns nothing).
- [x] 1.2 Confirm the RabbitMQ zone keeps exactly two connections — `vpn-rabbitmq` and `mon-rabbitmq` — and that `postgres`, `redis` and `rabbitmq` (the three `privateService` zones) now have no `traefik-edge` connection at all; verify by reading back `HOMELAB_CONNECTIONS` and matching the spec's "Edge ingress is drawn only to publicly reachable zones" requirement.

## 2. Retire the dead routing path

- [x] 2.1 Remove the `edge-wireguard-right` case from `route()` in `src/features/explore-homelab/model/connections.ts`; verify `npm run typecheck` passes, which also proves the `switch` still covers every remaining `RouteHint` (the function has no `default` branch, so an uncovered hint surfaces as a missing-return error).
- [x] 2.2 Remove `"edge-wireguard-right"` from the `RouteHint` union in `src/features/explore-homelab/model/nodes.ts`; verify `npm run typecheck` passes.
- [x] 2.3 Remove the `trafficRightX` metric from `layoutMetrics` in `src/features/explore-homelab/model/layout.ts` — it was read only by the deleted route branch; verify `grep -rn "trafficRightX" src/` returns nothing and `npm run typecheck` passes.

## 3. Update tests and verify behavior

- [x] 3.1 Run `npm test` and update `src/features/explore-homelab/model/__snapshots__/scene.test.ts.snap` so the `wg-rabbitmq` path entry is gone; verify the diff removes that one entry only and leaves every other routed path byte-identical.
- [x] 3.2 Verify the scene bounds are unchanged after the snapshot update — the right edge is driven by `vpnRightX` (hypervisor right + 75), not the removed `trafficRightX` (hypervisor right + 20) — by confirming the "contains every projected node and routed point" test still passes and no non-`wg-rabbitmq` path coordinates shifted.
- [x] 3.3 Run `npm test`, `npm run typecheck`, `npm run architecture` and `npm run build`; verify all four succeed.
- [ ] 3.4 Open the map from the HomeLab entry on the home page and verify the spec's scenarios by hand: on the "Трафик" and "Все связи" views no line runs from the edge Traefik to RabbitMQ; Jenkins, Harbor and Zabbix keep theirs; selecting the RabbitMQ zone highlights only Proxy and Zabbix; selecting the edge Traefik card highlights no private-service zone.

## 4. Keep project artifacts current

- [x] 4.1 Run `graphify update .` so the knowledge graph reflects the removed connection and route hint; verify the command exits successfully.
