## 1. Make the zone hit area apply to every zone

- [x] 1.1 In `src/features/explore-homelab/ui/node-zone.tsx`, drop the `isVm` guard so the hit-area button renders for every zone, including the `host`-type Proxy zone; verify by opening the HomeLab dialog and confirming a click on the Proxy background selects it and a second click deselects it
- [x] 1.2 In the same file, replace the hard-coded `Выделить VM ${z.title}` label with one derived from `z.zone.type` (host → host wording, vm → VM wording), keeping `aria-pressed` bound to `selectedVmId === z.id`; verify by inspecting the accessible name of the Proxy and Docker hit areas in the browser's accessibility panel
- [x] 1.3 Rename the `vmSelect` class and the `selectedVmId` prop to zone-neutral names (e.g. `zoneSelect`, `selectedZoneId`) across `node-zone.tsx` and `homelab-canvas.tsx`; verify with `npm run typecheck`

## 2. Carry the rename through the stylesheet

- [x] 2.1 In `src/features/explore-homelab/ui/homelab.module.css`, rename `.vmSelect` and both `:has(.vmSelect …)` selectors (hover and `aria-pressed=true`) in the dark-theme block to match the new class name; verify the Proxy border changes on hover and stays highlighted while selected
- [x] 2.2 Rename the same selectors in the `:global(:root.light-theme)` block; verify the hover and selected borders behave identically with the light theme active
- [x] 2.3 Confirm the Proxy zone's `.networkHost` styling still reads as the host zone when unselected — the selected-state border must layer over it, not replace the host treatment

## 3. Confirm nested cards still win the click

- [x] 3.1 Verify the Traefik card inside the Proxy zone still selects itself rather than the zone, and that the four cards inside the Docker zone are unaffected; the cards render after the zones and stop propagation, so this is a regression check, not new work

## 4. Cover the behavior and validate

- [x] 4.1 Extend `src/features/explore-homelab/model/use-node-selection.test.ts` with a case toggling `proxy` (select → selected, toggle again → null, and replacing a connection selection), so the Proxy node is exercised at the model level; verify with `npm test`
- [x] 4.2 Run `npm test`, `npm run typecheck`, and `npm run architecture` and confirm all three pass with no new findings
- [x] 4.3 Run `graphify update .` to refresh the knowledge graph after the code changes
