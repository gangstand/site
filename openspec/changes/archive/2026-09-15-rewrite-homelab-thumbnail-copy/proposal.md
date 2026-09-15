## Why

The HomeLab thumbnail is the first image on the home page, and its baked headline — «Свой дата-центр дома, под полным контролем» — sells a metaphor rather than the thing. «Дата-центр дома» is a marketing flourish; the estate the map actually draws is an infrastructure contour for home services. The supporting line under it is a bare product roll-call («Proxmox VE, Docker, Postgres, RabbitMQ, Jenkins, Harbor, Redis, Zabbix и приватная сеть WireGuard») — nine proper nouns that a reader scanning a 600px-wide list cannot parse and that say nothing about what the estate *does*.

Both lines are pixels inside `public/projects/homelab/thumbnail.webp`, not strings in the codebase, so changing them means re-baking the asset.

## What Changes

- The headline baked into `public/projects/homelab/thumbnail.webp` becomes **«Собственная инфраструктура для домашних сервисов»** (rendered uppercase by the bake sheet, as today).
- The supporting line becomes **«Контейнеры, CI/CD, базы данных, мониторинг и защищённая сеть в одном контуре»** — the same estate described by what each part is for instead of by vendor name.
- The map still inside the thumbnail is **re-captured fresh** from the live `HomelabCanvas` through the HomeLab detail dialog, following the recipe recorded in `openspec/changes/archive/2026-09-14-add-homelab-thumbnail/tasks.md`. The original capture PNG was a scratchpad file and is gone, so the alternative would be upscaling a crop out of the already-downscaled committed WebP; a fresh shoot keeps the still at full quality and re-syncs it with the map as it stands today.
- `src/_pages/home/config/homelab.ts` keeps `thumbnail: { width: 994, height: 644 }` **only if the re-baked sheet measures the same**. The new headline is longer than the old one and the new supporting line is shorter, so the composed height may land somewhere other than 644; whatever `identify` reports for the committed file is what the config must declare.
- The requirement in `project-showcase` that governs the HomeLab thumbnail is rewritten so it constrains what the two lines have to *convey* (what the estate is, and what it runs) rather than leaving the supporting line's job implicit.

**Flagged, not changed:** the new headline overlaps the caption rendered under the thumbnail from `homelab.description.ru` — «Личная инфраструктура на гипервизоре». Both open on a possessive + «инфраструктура»; the headline then says «для домашних сервисов» and the caption «на гипервизоре». The current spec asks the headline to be *distinct from* the list description, and the new copy sits closer to it than the old headline did. The requested headline is what ships; if the repetition reads badly on screen, the cheaper fix afterwards is the caption (a plain string in `homelab.ts`), not another re-bake.

Not in scope: the other four thumbnails, the Russian-only baking of the whole set, and the `description` strings in the project configs.

## Capabilities

### New Capabilities
<!-- None. -->

### Modified Capabilities
- `project-showcase`: the requirement *The HomeLab thumbnail depicts its own infrastructure map* changes — it gains an explicit division of labour between the headline (names what the estate is) and the supporting line (names what it runs, in categories rather than product names), and the anti-duplication clause is restated against the caption's *information* rather than its wording.

## Impact

- `public/projects/homelab/thumbnail.webp` — re-baked binary: new headline, new supporting line, freshly captured map still. Weight stays in the 34–63 KB family band (current file is 31 KB).
- `src/_pages/home/config/homelab.ts` — the `thumbnail` dimensions, only if the re-baked height differs from 644.
- `src/_pages/home/model/project.test.ts` — asserts positive image dimensions, not specific numbers; no edit expected, but it is the guard that must still pass.
- No change to `HomelabCanvas`, the scene data, `useSiteStatus`, the detail dialog, or `src/_pages/home/ui/projects.tsx`. The asset path convention `/projects/<id>/thumbnail.webp` is untouched.
- No new runtime dependency. Capture and composition run once, outside the app; only the output is committed, and the bake sheet must not leak into the repo.
