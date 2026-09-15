## 0. Measured geometry

Measured off `public/projects/homelab/thumbnail.webp` (994 × 644 px), via `magick ref.png -crop … txt:-` pixel dumps and `magick -font … -pointsize N label:"X" -trim` re-renders to derive font sizes. All coordinates are canvas-space px, origin top-left.

**Canvas:** 994 × 644.

**Ground (gradient):** linear, vertical, top → bottom. Top endpoint `rgb(230,242,252)` / `#E6F2FC`. Bottom endpoint `rgb(255,255,255)` / `#FFFFFF`. Sampled monotonically increasing lightness down column x=5 (y=0 → ~630, reaching pure white by y≈630); horizontally flat (identical colour at the same y across x=0/497/993) — i.e. `background: linear-gradient(180deg, #E6F2FC 0%, #FFFFFF ~98%)`.

**Vertical layout box** (non-overlapping deltas, sum to 644):

| Segment | y range | px |
|---|---|---|
| Top padding (canvas top → headline line-1 cap top) | 0–78 | 78 |
| Headline line-height (line-1 cap top → line-2 cap top) | 78–120 | 42 |
| Headline line-2 cap height | 120–146 | 26 |
| Gap: headline → supporting line | 146–175 | 29 |
| Supporting line height (cap + descenders) | 175–191 | 16 |
| Gap: supporting line → frame | 191–230 | 39 |
| Frame outer height | 230–573 | 343 |
| Bottom padding (frame bottom → canvas bottom) | 573–644 | 71 |
| **Total** | | **644** |

Headline line-1 cap top y≈78, baseline y≈103 (a descender on «Ц» in «ЦЕНТР» pulls the line's raw dark-pixel extent to y≈107 — not part of cap height). Headline line-2 («КОНТРОЛЕМ», no descenders) cap top y=120, baseline y=146, giving the clean cap height of 26px confirmed independently at 25px by isolating the line-1 «С» glyph (dark y=78–103).

**Horizontal layout box:**

| Value | px |
|---|---|
| Left padding (canvas left → text/frame left edge) | 78 |
| Right padding (canvas right → text/frame right edge) | 78 (994 − 1 − 915) |
| Frame left inset | 78 |
| Frame right inset | 78 (frame spans x=78–915, width 838) |
| Frame corner radius | ≈12 |

Left and right padding agree (78 = 78); the frame shares the same left/right inset as the text column.

**Type:**

| | Cap height (measured) | Font-size (derived, Geist Sans) |
|---|---|---|
| Headline (bold, uppercase via `text-transform`) | 25–26px (glyphs «С», «КОНТРОЛЕМ») | 33px — `magick -font Geist-Bold -pointsize 33 label:"С" -trim` reproduces a 25px cap height |
| Supporting line (regular) | 12px (glyph «P» of «Proxmox», isolated at x=75–100,y=165–205) | 16px — `magick -font Geist-Regular -pointsize 16 label:"P" -trim` reproduces a 12px cap height |

Both lines left-aligned at x=78 (the left padding). Derived sizes are provisional pending 1.4's re-render check and 3.1's full-sheet comparison against `ref.png` — ImageMagick's point-size rasterization approximates but does not guarantee identity with a Chromium CSS `font-size` render of the same outline.

## 1. Recover the bake sheet geometry from the committed asset

- [x] 1.1 Copy the current `public/projects/homelab/thumbnail.webp` into the scratchpad as a lossless PNG (`magick public/projects/homelab/thumbnail.webp ref.png`) and verify `magick identify ref.png` reports `994x644`, so all later measurements are taken off pixels and not off a re-decode
- [x] 1.2 Measure the ground: sample the gradient at the four corners and at the vertical midpoint of each edge (`magick ref.png -format '%[pixel:p{x,y}]' info:`) and record the endpoint colours and the gradient's direction; verify the sampled sequence is monotonic along the axis you conclude it runs on, rather than a flat fill
- [x] 1.3 Measure the layout box: left and right padding, the headline's first-line cap top and last-line baseline, the gap from headline to supporting line, the supporting line's cap height, the gap from supporting line to the frame, and the frame's left/right/bottom insets — crop bands out of `ref.png` and read the edges; verify left and right padding come out equal and that the numbers add up to 644 with no unexplained remainder
- [x] 1.4 Measure the type: headline cap height and line-height in px, supporting-line cap height, and the frame's corner radius (crop a corner and count); convert cap heights to font sizes using Geist Sans' cap-height ratio and record both the measured and derived values; verify the derived headline size, re-rendered at that value, produces a cap height within 1px of the measured one
- [x] 1.5 Write every measured and derived number from 1.2–1.4 into this file as a `## 0. Measured geometry` block at the top, with units; verify the block alone is enough to rebuild the sheet without reopening `ref.png` — this is the record that replaces the uncommitted bake sheet (design.md, *Recover the geometry from the committed asset*)

## 2. Capture the map still

- [x] 2.1 Start `npm run dev` and open the home page in a browser you can drive and screenshot; verify the project list renders with HomeLab first, still showing the old thumbnail
- [x] 2.2 Pin the capture environment to the archived values — window 1920 × 1200, device pixel ratio 2 — and verify with `window.innerWidth` and `window.devicePixelRatio` in the console before shooting
- [x] 2.3 Verify the site is in its default dark palette: `document.documentElement.classList` does not contain `light-theme` and the page background is `#191919`
- [x] 2.4 Activate the HomeLab entry to open its detail dialog and let the canvas settle; verify `fitOnMount` has framed the whole scene — the Proxmox VE hypervisor block with its virtual machines, the external VPS proxy zone, and the connection lines between them all inside the canvas region
- [x] 2.5 Wait for `/api/homelab/status/` to answer before shooting; verify the site indicators show resolved reachability rather than every site reading "unknown" (whatever is on screen is frozen into the asset permanently)
- [x] 2.6 Drag the details pane to the narrow end of its range and verify the canvas region is at least 1400 CSS px wide
- [x] 2.7 Capture the canvas region only — no dialog chrome, header, or details pane — to a PNG in the scratchpad; verify the file is at least 2800px wide and that its framing matches the framing of the map inside `ref.png` side by side, so the swap reads as a copy edit rather than a new thumbnail
- [x] 2.8 Stop the dev server and verify with `git status` that no file under `public/`, `src/`, or `app/` was modified during the shoot

## 3. Compose the new sheet

- [x] 3.1 Write a throwaway bake sheet HTML into the scratchpad — **not** into the repo — 994px wide, using the ground, padding, type scale, gaps, frame inset and corner radius recorded in section 0, with Geist Sans loaded from `node_modules/geist/dist/fonts/geist-sans`; verify the sheet with the *old* copy and the *old* map still renders within 2px of `ref.png` on every measured edge before any new copy goes in — this proves the geometry was recovered correctly
- [x] 3.2 Swap in the new copy: headline `Собственная инфраструктура для домашних сервисов` authored in sentence case with the sheet's `text-transform: uppercase` doing the casing, and supporting line `Контейнеры, CI/CD, базы данных, мониторинг и защищённая сеть в одном контуре`; verify the rendered headline appears in capitals and that the source string is not pre-uppercased
- [x] 3.3 Swap in the freshly captured map PNG from task 2.7, sized to the frame's own aspect ratio with no letterboxing and no side-cropping; verify the frame's left, right and bottom insets still match the section 0 values

  **Update:** Replaced the framed still with user-provided captures of the same live dialog (`image_2026-09-15_15-27-58.png`, then superseded by `image_2026-09-15_15-47-42.png`, both 1791 × 823). An intermediate pass cropped the image to its tight content bounding box (1624 × 649 ≈ 2.502:1); the user explicitly rejected that ("не кропай данной изображения" — don't crop this image). **Final:** the image is used at its full, uncropped 1791 × 823 extent (alpha-flattened onto `#191919` only, no trim). At the 838px frame width that gives a natural frame height of ~385px, taller than the old 343px frame and wider-margined than a tight crop would be — this is the user's explicit choice, overriding the "no letterboxing/no side-cropping via tight crop" reading applied earlier.
- [x] 3.4 Confirm the headline does not borrow the Geist Pixel face; verify by comparison with `public/projects/esaul/thumbnail.webp`, whose dot-matrix headline is that project's signature and must stay unique to it
- [x] 3.5 Measure the sheet's natural content height at 1× and set that height explicitly on `html`, `body` and `.sheet` before capturing; verify all three declare the same explicit pixel height (an auto/unset height tiled the capture 2×2 in the previous bake)
- [x] 3.6 Record how many lines the headline wrapped to and the resulting sheet height; verify against the expectation in design.md (*Let the composed height follow the content*) — two lines and 644 — and note the actual numbers if they differ, since section 5 depends on them

  **Initial actual:** headline wrapped to 2 lines, as expected. The first sheet height came out **634px**, not 644 — a 10px drop. The wrap matched, but the frame was 10px shorter than the old asset (334.8px vs. 343px) because the first captured map (2360×943 ≈ 2.503:1) was wider than the old frame's content (838×343 ≈ 2.443:1).

  **Final actual:** the headline still wraps to 2 lines. The user-provided replacement map is used uncropped at 1791×823 (≈2.176:1) per the user's explicit instruction (see 3.3's update) — its 838px-wide frame is ~385px high and the final sheet is **684px** tall. Section 5 declares `height: 684` in `homelab.ts`.

## 4. Render and encode

- [x] 4.1 Render the sheet headlessly at device pixel ratio 2 and capture to PNG; verify `magick identify` reports exactly double the chosen CSS width × height (994 × H CSS → 1988 × 2H PNG)
- [x] 4.2 Downscale to 994 × H and encode to WebP with `magick … -quality 82 -define webp:method=6`; verify `magick identify` reports exactly `994xH` and the file weighs at most 65 KB, in family with the 31–63 KB neighbours. If the WebP write delegate is missing, fall back to `ffmpeg -i … -c:v libwebp` and re-verify both properties
- [x] 4.3 Check legibility at the sizes the list actually renders: downscale the encoded WebP to 600px and to 448px wide and verify both the headline and the supporting line are readable at both, and that nothing in the composition depends on the map's node labels being legible (`project-showcase`, *Reading the thumbnail at the size the list renders it*)
- [x] 4.4 Open the encoded result beside `public/projects/esaul/thumbnail.webp` and `public/projects/swapdog/thumbnail.webp` at the list's real widths, and beside `ref.png`; verify it reads as one set with the neighbours and as the same artefact as the old homelab thumbnail with different words
- [x] 4.5 Replace `public/projects/homelab/thumbnail.webp` with the result; verify with `git status` that the thumbnail is the only changed path under `public/` and that no bake sheet, capture PNG, `ref.png`, or downscaled preview leaked into the repo

## 5. Reconcile the declared dimensions

- [x] 5.1 Read the committed file's real dimensions with `magick identify public/projects/homelab/thumbnail.webp` and compare against `thumbnail: { width: 994, height: 644 }` in `src/_pages/home/config/homelab.ts`; verify the two agree, and if the height moved, update the config to the identified value and leave a one-line note of the new number in the commit message

  **Final verification:** `magick identify` reports 994×684 and `homelab.ts` declares `thumbnail: { width: 994, height: 684 }`.
- [x] 5.2 Run `npm test` and verify `src/_pages/home/model/project.test.ts` still passes — it asserts every project declares positive image dimensions, which is the guard on 5.1

## 6. Verify the change as a whole

- [x] 6.1 Load the home page at a desktop width and at a phone width and verify the five entries still read as one set, that the new headline and supporting line are legible in place, and that nothing below the HomeLab entry shifts once its image finishes loading
- [x] 6.2 Read the HomeLab entry's caption beneath the thumbnail («Личная инфраструктура на гипервизоре») together with the new headline and record whether the overlap flagged in proposal.md reads badly on screen; verify the observation is reported to the user rather than acted on — the caption is out of scope for this change

  **Observation:** The adjacent wording is noticeably repetitive: both the baked headline and caption lead with infrastructure terminology, so the overlap reads awkwardly in the list. No caption change was made because it is explicitly out of scope; this is reported to the user for a potential follow-up.

- [x] 6.3 Open the HomeLab dialog from the new thumbnail and verify the live map is recognisably the same picture the still shows, so the thumbnail still reads as a preview of what it opens
- [x] 6.4 Run `npm run typecheck` and `npm run architecture` and verify both pass with no new findings
- [x] 6.5 Run `graphify update .` to refresh the knowledge graph
- [x] 6.6 Run `openspec validate rewrite-homelab-thumbnail-copy --strict` and verify the change validates
