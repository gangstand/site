# gangstand.tech

## Architecture

This Next.js App Router project keeps `app/` as the framework adapter layer. Route files expose Next.js-required exports such as metadata and route handlers, then compose application code from `src/`.

The application uses these Feature-Sliced Design layers:

- `src/_app`: application-wide providers and route-handler implementations.
- `src/_pages`: route-owned composition and route-specific UI, model, and config.
- `src/features`: focused reusable interactions, currently `copy-email` and `explore-homelab`.
- `src/shared`: framework-neutral UI, library helpers, configuration, and transport contracts.

Keep code in its owning page unless it has multiple current consumers, an independent reason to change, and one focused responsibility. External consumers import page and feature slices through their `index.ts` public API; Shared modules expose focused folder or segment APIs. Dependencies flow downward only: `_app -> _pages -> features -> shared`.

## Checks

```bash
npm test
npm run typecheck
npm run architecture
npm run build
```
