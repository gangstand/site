## Context

See `proposal.md` — Why. What shapes the approach here is where the artwork has to come from.

The map has no URL of its own. `homelab-map` states it explicitly: the map SHALL be reachable only from the HomeLab entry in the home page project list, and the site SHALL NOT serve a dedicated homelab page. So any capture of the rendered canvas has to go through the project dialog, not through a convenient standalone page.

Three further constraints come from the code as it stands:

- The site boots in the dark palette (`:root { color-scheme: dark }` in `app/globals.css`); the light palette is a `:root.light-theme` class applied by the theme toggle. The map is captured in this default dark palette — the map's own signature look — so no toggle flip is needed for the capture itself.
- `HomelabCanvas` is rendered with `embedded` inside the dialog, which turns on `fitOnMount`, so opening the dialog already frames the whole scene. The dialog fills the viewport minus a 32px gutter and gives the canvas everything left of the details pane (which starts at one third and can be dragged down to one fifth). At a large window this is a comfortably big frame to shoot.
- `useSiteStatus` polls `/api/homelab/status/` every 30s and paints per-site reachability. Whatever state those indicators are in at the moment of capture is frozen into the asset forever.

The existing four thumbnails are all crops of landing-page heroes at 994–1000px wide. HomeLab has no landing page, so its hero has to be composed rather than cropped.

## Goals / Non-Goals

**Goals:**

- A single committed binary, `public/projects/homelab/thumbnail.webp`, reachable through the existing `/projects/<id>/thumbnail.webp` convention with no new lookup code.
- A bake recipe concrete enough that re-shooting the asset later — after the map's layout changes — is a mechanical repeat, not a re-invention.
- A composition that reads as a sibling of the other four rather than a screenshot dropped into the list.

**Non-Goals:**

- No capture tooling added to the repo. No headless-browser dependency in `package.json`, no npm script, no committed bake sheet. The pipeline runs once, outside the app, and only its output is committed.
- No runtime change to how thumbnails are chosen or loaded. Per-theme and per-language variants stay out; both would need the list renderer to pick a source, which is a different change.
- Not a fix for the wider thumbnail problems noted while exploring (Russian copy baked into every asset, eager loading). This change makes HomeLab match its neighbours in composition; it does not re-cut the set.

## Decisions

### Capture the map through the dialog, not through a temporary route

The map is shot exactly where a visitor sees it: run `npm run dev`, open the home page in the site's default dark theme, activate the HomeLab entry, let `fitOnMount` frame the scene, narrow the details pane and zoom to the largest scale that still keeps every connection loop closed (not clipped), then capture the canvas region.

*Alternative — add a temporary `/homelab` route for the shoot.* Rejected. `homelab-map` requires that no such URL exists; introducing one even briefly contradicts a live requirement, and the risk of it surviving into a commit is real — the route was deliberately removed by an earlier change (`2026-09-14-remove-homelab-pages`).

*Alternative — render the scene offline from `model/connections.ts` and `model/layout.ts` into an SVG.* The geometry is all there and it would give a resolution-independent result. Rejected as disproportionate: it means re-implementing `NodeCard`, `NodeZone`, `ConnectionsLayer` and the stylesheet outside React, and it would drift from the real map the moment either side changes. The point of a baked still is that it shows the thing itself.

### Compose the hero in a throwaway bake sheet, not in the app and not in a design tool

The headline, supporting line and the framed screenshot are assembled in a plain HTML file written to the scratchpad, sized 994 wide by whatever height the composed content naturally needs, rendered headlessly and captured. That file is not committed.

The headline is a distinct hook rather than a restatement of the project's list description (`homelab.description.ru`, "Личная инфраструктура на гипервизоре", shown under the thumbnail) — echoing that same line inside the image as well would put the same sentence on screen twice. The supporting line instead enumerates the concrete infrastructure the map depicts (Proxmox VE and the seven VM names, plus WireGuard), giving the reader information the headline and the outside caption don't already carry. The background is a soft light-blue-to-white gradient rather than the flat `#fdfdfc` the other four use, framing the dark-captured map the way a light mat frames a photo.

*Alternative — assemble in a design tool.* Perfectly workable, but the result is not reproducible from the repo and nobody can re-bake it without the source document.

*Alternative — compose with ImageMagick's text drawing.* Rejected: no control over the typography that makes these thumbnails look deliberate — tracking, line-height, the rounded frame around the screenshot.

Typography follows `teamtasker`/`swaprat`: Geist Sans, bold headline, regular supporting line. Geist is already in `node_modules/geist` and is the site's own face. The Geist Pixel face is deliberately avoided — that is `esaul`'s signature and borrowing it would read as a mistake.

### Output 994 × 644 WebP

994 matches three of the four existing assets (`swaprat` is the odd 1000). The height is shorter than any existing thumbnail (787–896) — an explicit, deliberate choice: the composed height follows the content (headline, supporting line, and a frame sized to the map's own aspect ratio with no letterboxing or side-cropping) rather than being padded out to land inside the existing family's range. HomeLab is allowed to be the shortest entry in the stack. Target weight ≤ 65 KB, in line with the 34–63 KB neighbours.

Encoding uses ImageMagick 7, already installed. `cwebp` is not present; `ffmpeg` with `libwebp` is, as a fallback if the WebP write delegate turns out to be missing. Capture at 2× device pixel ratio and downscale to 994 wide, so the headline stays crisp.

### Drop the `placeholder` variant rather than leave it unconstructed

Once HomeLab declares an image, nothing constructs `{ kind: "placeholder" }`. `ProjectThumbnail` collapses to the image shape and the placeholder branch leaves `projects.tsx`.

*Alternative — keep it as the fallback for a future project with no artwork yet.* Rejected. It would be a union member no code path produces and a JSX branch no render reaches, and the repo has a habit of deleting paths that stop being used rather than keeping them warm. If a future project needs a stand-in, re-adding one is a few lines.

With the discriminant reduced to one case, the `kind` tag stops carrying information. Collapsing the type to a bare `{ width, height }` is the tidier end state and is what the tasks do; the field keeps the name `thumbnail`, so every config file's shape stays recognisable.

### Accept frozen status indicators

The captured map freezes whatever `useSiteStatus` had painted. The bake is taken with the status source reachable so the estate reads as alive rather than as a wall of "unknown", but no attempt is made to stub or suppress the indicators: they are small, and at the 600px column the thumbnail renders into they are well below legibility anyway. The live truth is one click away in the dialog.

## Risks / Trade-offs

- **The still goes stale when the map's layout changes** → the bake recipe lives in `tasks.md` in enough detail to repeat; re-shooting is a single sitting, not a rebuild.
- **Text in the thumbnail is illegible at the rendered size.** The list column is 600px on desktop and 448px on mobile, so a 994px asset renders at 0.60/0.45 — the flaw the existing four already have, where 11px UI labels land at ~5px → the headline is sized so it survives the downscale, and nothing in the composition depends on the map's node labels being readable. Verification is done on the downscaled image, not on the full-size file.
- **Capture is non-deterministic across window size, DPR and font loading** → viewport, device pixel ratio and details-pane width are pinned in the task steps so a repeat shoot lands in the same place.
- **The composed thumbnail's height falls outside the range the other four span** → accepted as an explicit choice: the frame is sized to the map's own aspect ratio rather than stretched or letterboxed to match the family's height range, so HomeLab reads as the shortest entry rather than an entry with dead space or a distorted screenshot.
- **Removing a type variant could disturb something not obvious from the call sites** → `npm run typecheck`, `npm test` and `npm run architecture` all run before the change is considered done, and `project.test.ts` is updated rather than deleted so the invariant it guarded is still guarded.

## Migration Plan

No runtime migration. The change ships as one commit: the new binary plus the config, type, renderer and test edits. Rollback is reverting that commit — the placeholder branch and the placeholder declaration come back together, so there is no intermediate state where a project declares an image that the renderer cannot draw.

## Open Questions

- How tightly the map should be framed in the still — the whole scene as `fitOnMount` leaves it, or a crop that fills more of the frame with the hypervisor block and its virtual machines. This is decided by eye at bake time against the downscaled preview; it changes neither the specs, the output dimensions, nor the task breakdown.
