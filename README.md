# gangstand

Personal site built with Next.js App Router, TypeScript and Tailwind CSS.

## Development

```sh
npm ci
npm run dev
```

## Checks and production

```sh
npm run typecheck
npm run build
```

Next.js exports the site to `out/`. The multi-stage Dockerfile builds the export and serves it through Nginx. The existing Jenkins pipeline does not need a Node.js runtime on the host.

## Structure

- `app/`: Next.js routes, metadata and global styles.
- `src/views/`: page composition.
- `src/widgets/`: independent profile, projects and footer sections.
- Additional FSD layers are introduced only when there is a concrete use case.

Profile copy lives in `src/shared/config/translations.ts`.

### Projects

Each project lives in its own folder under `src/widgets/projects/`: `homelab/`, `teamtasker/`, `swapdog/`, `esaul/`, `swaprat/`. Project definitions contain metadata, Russian/English copy and photo coordinates. Homelab also owns its infrastructure map implementation.

- `model/project.ts`: shared project and image types.
- `model/projects.ts`: project registry and display order.
- `ui/`: shared list, detail dialog and photo canvas for all projects.
- `src/shared/ui/infinite-canvas/`: reusable pan, zoom, touch gestures, keyboard navigation and localized controls.

To add a project, create its folder with a `ProjectDefinition`, register it in `model/projects.ts`, and place its preview at `public/projects/<id>/thumbnail.webp`. Add photos to its `images` array (`src`, localized `alt`, `x`, `y`, `width`, `height`, in canvas pixels). The common photo canvas handles rendering and empty states. An optional `canvas` component and localized label provide a custom view without changing the common dialog; heavy views can be lazy-loaded as in `homelab/project.tsx`.

Contact addresses live in `src/shared/config/contacts.ts`. Brand SVG paths come from [Simple Icons](https://simpleicons.org/) (CC0). Theme selection is stored locally in the browser; the circular animation uses the View Transitions API with a reduced-motion and unsupported-browser fallback.
