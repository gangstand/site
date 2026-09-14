## 1. Remove the route and its page slice

- [x] 1.1 Delete `app/homelab/page.tsx` and the now-empty `app/homelab/` directory; verify `app/api/homelab/status/route.ts` is untouched and `find app -type d -name homelab` returns only `app/api/homelab`
- [x] 1.2 Delete `src/_pages/homelab/` (`index.ts`, `ui/homelab-page.tsx`); verify `grep -rn "_pages/homelab" app src` returns nothing

## 2. Retire the internal destination

- [x] 2.1 In `src/_pages/home/model/project.ts`, narrow `ProjectDestination` to the `external` variant and make `destination` optional on `ProjectDefinition`; verify `npm run typecheck` reports the expected errors only at the HomeLab config, the detail dialog, and the project test
- [x] 2.2 In `src/_pages/home/config/homelab.ts`, drop the `destination` field; verify no `/homelab` string remains in `src/_pages/home/config/`
- [x] 2.3 In `src/_pages/home/ui/project-detail-dialog.tsx`, guard the now-optional destination (`project.destination?.kind === "external"`) so the "Visit website" link still renders for the four external projects and not for HomeLab; verify `npm run typecheck` passes
- [x] 2.4 In `src/_pages/home/model/project.test.ts`, replace the `internal` destination assertion with one that HomeLab has no destination, keeping the curated-order and external-destination assertions for the other projects; verify `npm run test` passes

## 3. Verify the surviving behavior

- [x] 3.1 Confirm nothing references the removed route: `grep -rn "/homelab\"" app src README.md` returns only the status API path (`/api/homelab/status`)
- [x] 3.2 Run `npm run typecheck`, `npm run test`, and `npm run architecture`; all three pass with no new steiger findings
- [x] 3.3 Run a cold `npm run build`, then start the built app and check both spec scenarios by hand: opening the HomeLab card on `/` shows the infrastructure map with live site status, and requesting `/homelab` returns the 404 page
- [x] 3.4 Run `graphify update .` so the knowledge graph drops the deleted page slice
