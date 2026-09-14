## Why

HomeLab is the first entry in the home page project list and the only one that opens something genuinely built — the interactive infrastructure map. It is also the only entry with no thumbnail: `src/_pages/home/config/homelab.ts` declares `thumbnail: { kind: "placeholder" }`, so the list opens with an empty grey block (`h-[300px] sm:h-[500px]`) where the other four show a real image. The first impression of the page is the one project that has the most to show, showing nothing.

The map itself is the material for the missing image: it already renders the whole Proxmox estate — seven virtual machines, the external VPS, the WireGuard mesh, the ingress paths. A baked still of that canvas, composed the way the other four thumbnails are composed, closes the hole with the project's own artwork rather than a stock mockup.

## What Changes

- A new static asset `public/projects/homelab/thumbnail.webp` is produced by capturing the rendered `HomelabCanvas` in the site's default dark theme and composing it into the hero layout the other four thumbnails use: Russian headline, supporting line, framed screenshot below, on a light gradient ground.
- `src/_pages/home/config/homelab.ts` stops declaring a placeholder and declares the image and its dimensions, exactly as `teamtasker`, `swapdog`, `esaul`, and `swaprat` do. The file is served through the same convention-based path `/projects/<id>/thumbnail.webp` — no new lookup mechanism.
- The image is sized 994 × 644 — narrower in height than the range the existing four span (787–896), a deliberate choice so the frame matches the map's own proportions instead of being padded or cropped to fit the family's range.
- With HomeLab carrying an image, no project uses the `placeholder` variant any more. The variant and its render branch in `src/_pages/home/ui/projects.tsx` are removed, and `ProjectThumbnail` collapses to a single shape. This is a consequence of the change, not an independent cleanup — leaving a union member that nothing constructs would leave a dead branch in the list renderer.
- `src/_pages/home/model/project.test.ts` currently asserts `homelab.thumbnail` equals `{ kind: "placeholder" }`; it is rewritten to assert that every project declares image dimensions.

Not in scope: the thumbnail is baked in Russian only. Per-language and per-theme thumbnail variants would require the list renderer to choose a source at runtime, which is a separate change. The empty `images: []` arrays on the other projects are also untouched.

## Capabilities

### New Capabilities
- `project-showcase`: how the home page project list presents each project before it is opened — that every entry carries a thumbnail image whose declared dimensions match the file it serves, and what the HomeLab thumbnail depicts.

### Modified Capabilities
<!-- None. The homelab-map capability governs the map itself and its single entry point; neither changes here. -->

## Impact

- `public/projects/homelab/thumbnail.webp` — new binary asset, the only new file. Target weight in line with its neighbours (34–63 KB).
- `src/_pages/home/config/homelab.ts` — `thumbnail` field.
- `src/_pages/home/model/project.ts` — the `ProjectThumbnail` type loses its `placeholder` variant.
- `src/_pages/home/ui/projects.tsx` — the placeholder branch of the thumbnail render is removed.
- `src/_pages/home/model/project.test.ts` — the assertion that HomeLab uses a placeholder.
- No change to `HomelabCanvas`, the scene data, the status API, the dialog, or the routing. The map stays reachable exactly as `homelab-map` specifies; the thumbnail is the button that opens it, nothing more.
- No new runtime dependency. The capture and composition run once, outside the app, and only their output is committed.
