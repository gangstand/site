## 1. Capture the map still

- [x] 1.1 Start the app with `npm run dev` and open the home page in a browser you can drive and screenshot; verify the project list renders with HomeLab first and still showing the grey placeholder block
- [x] 1.2 Pin the capture environment before shooting: window 1920 × 1200, device pixel ratio 2; verify with `window.innerWidth` / `window.devicePixelRatio` in the console, and record both values in the commit message so a later re-bake can reproduce the frame
- [x] 1.3 Capture in the site's default dark palette (no theme toggle needed); verify `document.documentElement.classList` does not contain `light-theme` and the page background is `#191919`
- [x] 1.4 Activate the HomeLab entry to open its detail dialog and let the canvas settle; verify `fitOnMount` has framed the whole scene — the Proxmox VE hypervisor block with its seven virtual machines, the external VPS proxy zone, and the connection lines between them are all inside the canvas region
- [x] 1.5 Wait for `/api/homelab/status/` to answer before shooting; verify the site indicators show resolved reachability rather than every site reading "unknown" (the state at capture time is frozen into the asset permanently — see design.md, *Accept frozen status indicators*)
- [x] 1.6 Drag the details pane to the narrow end of its range to give the canvas more width, and record the resulting details width; verify the canvas region is at least 1400 CSS px wide before capturing
- [x] 1.7 Capture the canvas region only — not the dialog chrome, header, or details pane — to a PNG in the scratchpad; verify the file is at least 2800px wide (1400 CSS px at DPR 2) and that the framing decision left open in design.md has been made by eye at this point
- [x] 1.8 Stop the dev server; verify no file under `public/`, `src/`, or `app/` was modified during the shoot with `git status`

## 2. Compose and encode the thumbnail

- [x] 2.1 Write a throwaway bake sheet HTML into the scratchpad — **not** into the repo — 994px wide with a light blue-to-white gradient ground, Geist Sans from `node_modules/geist/dist/fonts`, the headline `Свой дата-центр дома, под полным контролем` (distinct from the list description, not a restatement of it), the supporting line `Proxmox VE, Docker, Postgres, RabbitMQ, Jenkins, Harbor, Redis, Zabbix и приватная сеть WireGuard`, and the captured (dark-theme) map in a rounded frame below them, sized to the frame's own aspect ratio; verify the layout echoes the header-over-framed-screenshot rhythm of `public/projects/esaul/thumbnail.webp` and `public/projects/swapdog/thumbnail.webp` when opened side by side, and that html/body/.sheet all declare the same explicit pixel height before any screenshot is taken (an auto/unset height tiled the capture 2×2 in practice)
- [x] 2.2 Confirm the headline does not borrow the Geist Pixel face; verify by comparison with `esaul/thumbnail.webp`, whose dot-matrix headline is that project's signature and must stay unique to it
- [x] 2.3 Measure the bake sheet's natural content height at 1x, set that height explicitly on html/body/.sheet, then render headlessly at device pixel ratio 2 and capture it to PNG; verify `identify` reports exactly double the chosen CSS width × height (994 × 644 CSS → 1988 × 1288 PNG)
- [x] 2.4 Downscale to 994 × 644 and encode to WebP with ImageMagick 7 (`magick … -quality 82 -define webp:method=6`); verify `identify` reports exactly `994x644` and the file is at most 65 KB, in family with the 34–63 KB neighbours. If ImageMagick reports no WebP write delegate, fall back to `ffmpeg -i … -c:v libwebp` and re-verify the same two properties
- [x] 2.5 Check legibility at the sizes the asset is actually rendered at: downscale the encoded WebP to 600px and 448px wide and verify the headline and the supporting line are both still readable, and that nothing in the composition depends on the map's node labels being legible
- [x] 2.6 Place the result at `public/projects/homelab/thumbnail.webp`; verify with `git status` that it is the only new file under `public/` and that no bake sheet, intermediate PNG, or capture leaked into the repo

## 3. Wire the asset into the project list

- [x] 3.1 In `src/_pages/home/config/homelab.ts`, replace `thumbnail: { kind: "placeholder" }` with the image declaration carrying width 994 and height 644; verify the declared numbers equal what `identify` reported for the committed file
- [x] 3.2 Reload the home page and verify the HomeLab entry now renders the image through the existing `/projects/<id>/thumbnail.webp` convention with no change to the path-building code, and that it reads as one set with the other four even though it is shorter than all of them

## 4. Remove the now-unconstructed placeholder variant

- [x] 4.1 In `src/_pages/home/model/project.ts`, collapse `ProjectThumbnail` from a two-case union to the single image shape carrying width and height; verify with `npm run typecheck` that every construction site is updated in the same pass
- [x] 4.2 Update the five config files (`homelab.ts`, `teamtasker.ts`, `swapdog.ts`, `esaul.ts`, `swaprat.ts`) to the collapsed shape, keeping each project's existing dimensions unchanged; verify the four existing entries still declare 994 × 787, 994 × 885, 994 × 896, and 1000 × 819 respectively
- [x] 4.3 In `src/_pages/home/ui/projects.tsx`, remove the placeholder branch and its fixed `h-[300px] sm:h-[500px]` block so the thumbnail render has one path; verify no `placeholder` identifier remains anywhere under `src/`
- [x] 4.4 Confirm the surviving branch still exposes the image as decorative (`alt=""`) and keeps `aria-label`, `aria-haspopup` and `aria-expanded` on the button that opens the dialog; verify by reading the accessible name of the HomeLab entry in the browser's accessibility panel — it must announce the project name, not the image
- [x] 4.5 In `src/_pages/home/model/project.test.ts`, replace the assertion that HomeLab's thumbnail equals `{ kind: "placeholder" }` with one asserting every project declares positive image dimensions, keeping the existing checks on destinations, detail kinds, and curated order; verify with `npm test`

## 5. Verify the change as a whole

- [x] 5.1 Run `npm test`, `npm run typecheck`, and `npm run architecture` and confirm all three pass with no new findings
- [x] 5.2 Load the home page in both themes at a desktop width and at a phone width and verify the five entries read as one set — no blank block, no entry that jumps out of the stack's rhythm — and that nothing below the HomeLab entry shifts once its image finishes loading
- [x] 5.3 Open the HomeLab dialog from the new thumbnail and verify the live map is recognisably the same picture the still shows, so the thumbnail reads as a preview of what it opens
- [x] 5.4 Run `graphify update .` to refresh the knowledge graph after the code changes
- [x] 5.5 Run `openspec validate add-homelab-thumbnail --strict` and confirm the change validates
