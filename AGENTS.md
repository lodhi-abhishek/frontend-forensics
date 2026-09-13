<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project guidance

This repository is a collection of independent frontend studies, not one shared product surface. Keep changes scoped to the route being edited unless a shared primitive or global behavior is intentionally being changed.

## Structure and conventions

- Each page lives under `app/<route>/` and normally keeps its route-specific components, data, and styles beside `page.tsx`.
- Use CSS Modules for substantial route styling (`*.module.css`); keep truly global rules in `app/globals.css`.
- Put route-owned images, fonts, video, and third-party runtime assets under `public/assets/<route>/`, and reference public files with root-relative URLs.
- Keep browser-only behavior in explicit client components (`"use client"`). Clean up event listeners, animation frames, timers, and observers in effect cleanup functions.
- Preserve responsive behavior, keyboard access, reduced-motion handling, and the visual fidelity of the reference when changing an interactive study.
- Prefer existing shared utilities and UI primitives when they fit; avoid introducing a new dependency for a local visual effect.
- Route pages may export their own metadata and viewport settings. Do not assume the root layout metadata describes every study.

## Validation

Use pnpm, as declared by `package.json`. Before handing off a change, run `pnpm exec tsc --noEmit` and the relevant production build when practical. The current `lint` script invokes `next lint`, which is not a valid command in Next.js 16; treat it as stale rather than using it as the validation signal for this project.

When changing a route or its assets, verify that route directly in the dev server at `/route-name` and check both a narrow and a wide viewport. Do not rewrite or remove unrelated studies or their assets during route-local work.
