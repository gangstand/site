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
- `src/pages/`: page composition.
- `src/widgets/`: independent profile and footer sections.
- Additional FSD layers are introduced only when there is a concrete use case.

Profile copy lives in `src/widgets/profile/ui/profile.tsx`. No external fonts, images, analytics or runtime APIs are required.

Contact addresses live in `src/shared/config/contacts.ts`. Brand SVG paths come from [Simple Icons](https://simpleicons.org/) (CC0). Theme selection is stored locally in the browser; the circular animation uses the View Transitions API with a reduced-motion and unsupported-browser fallback.
