## Why

The homelab map draws an HTTP traffic link from the edge Traefik to RabbitMQ (`wg-rabbitmq`, "HTTP через WireGuard · RabbitMQ Management UI"), but RabbitMQ is marked on the same map as a private service whose reachability is deliberately not checked. The map therefore tells the visitor two contradictory things about the same VM: that its Management UI is proxied out to the internet, and that it is a private service with no public surface. RabbitMQ's Management UI is not published; the link is wrong and should go.

## What Changes

- Remove the `wg-rabbitmq` connection (`traefik-edge` → `rabbitmq`, kind `wireguard`) from the homelab topology. The RabbitMQ zone keeps its WireGuard tunnel to the Proxy host (`vpn-rabbitmq`) and its Zabbix monitoring link (`mon-rabbitmq`).
- Retire the now-unused `edge-wireguard-right` route hint: its `RouteHint` union member, its branch in the connection router, and the `trafficRightX` layout metric that only that branch reads.
- Record the rule this removal follows: the edge proxy's HTTP ingress links point only at zones the map reports a public reachability status for, never at zones marked as private services.

No breaking changes: the map is presentational, the connection ids are internal, and nothing outside `explore-homelab` reads them.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `homelab-map`: adds a requirement constraining which zones the map may draw an edge HTTP ingress link to, so a private service is never shown as publicly proxied.

## Impact

- `src/features/explore-homelab/model/nodes.ts` — drop the `wg-rabbitmq` connection and the `edge-wireguard-right` member of `RouteHint`.
- `src/features/explore-homelab/model/connections.ts` — drop the `edge-wireguard-right` case from `route()`.
- `src/features/explore-homelab/model/layout.ts` — drop the `trafficRightX` metric.
- `src/features/explore-homelab/model/__snapshots__/scene.test.ts.snap` — one fewer routed path; scene bounds are unaffected because `vpnRightX` (not `trafficRightX`) drives the right edge.
- Visitor-facing: the "Трафик" and "Все связи" views lose one line; selecting the RabbitMQ zone or the edge Traefik card highlights one fewer neighbour.
- No change to statuses, no change to the VM count or network-client count, no data source or API touched.
