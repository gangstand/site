## Why

On the homelab map every VM zone (Docker, Harbor, Jenkins, Postgres, RabbitMQ, Redis, Zabbix) can be clicked to select it and highlight its links, but the Proxy zone — the WireGuard hub that every one of those VMs connects to — cannot. It is the single most connected node on the map (seven VPN links plus the HTTPS ingress and its Zabbix monitoring link), and it is the one node a visitor cannot use to filter the picture.

## What Changes

- The Proxy zone becomes selectable exactly like the Docker zone: clicking anywhere on its background selects it, clicking it again deselects it, and selection stays mutually exclusive with node and connection selection.
- Selecting Proxy highlights its border and dims the cards unrelated to it, the same feedback VM zones already give.
- The zone hit area stops being VM-only and becomes a property of every zone, so the Proxy host zone gets one without a special case.
- The hit area's accessible name stops hard-coding the word "VM" and describes the zone by what it is (host vs. virtual machine), so the Proxy button does not announce itself as a VM.
- Cards nested inside a zone (Traefik inside Proxy, and the four cards inside Docker) keep their own click targets and stay on top of the zone hit area.

## Capabilities

### New Capabilities
<!-- None. -->

### Modified Capabilities
- `homelab-map`: adds a requirement covering zone selection on the map — which zones are selectable, what selecting one does, and how it interacts with nested cards and with connection selection.

## Impact

- `src/features/explore-homelab/ui/node-zone.tsx` — the `isVm` guard around the hit-area button, and its `aria-label`.
- `src/features/explore-homelab/ui/homelab.module.css` — the `.vmSelect` rule and the `:has(.vmSelect …)` selectors that drive hover and selected borders, in both the dark and light theme blocks.
- `src/features/explore-homelab/ui/homelab-canvas.tsx` — zones are currently passed `selectedVmId`; naming and the related-node dimming path are touched only if needed.
- No change to the data model (`model/nodes.ts`), the layout (`model/layout.ts`), the selection reducer (`model/use-node-selection.ts`), or the status API.
