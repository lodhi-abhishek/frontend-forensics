# Frontend Forensics

A collection of frontend recreations and experiments built with Next.js, React, TypeScript, and Tailwind CSS.

Each route is a self-contained study of a real product, editorial page, or interactive experience. The project focuses on reconstructing visual systems, motion, layout, typography, and interaction details from the original references.

## Pages

| Route | Reference |
| --- | --- |
| [`/linear-next`](./app/linear-next/page.tsx) | [Linear — Next.js](https://linear.app/next) |
| [`/amp-agent`](./app/amp-agent/page.tsx) | [Amp — How to Build an Agent](https://ampcode.com/notes/how-to-build-an-agent) |
| [`/hermes-agent`](./app/hermes-agent/page.tsx) | [Hermes Agent](https://hermes-agent.nousresearch.com/) |
| [`/bun-rewrite`](./app/bun-rewrite/page.tsx) | [Bun — What does this look like?](https://bun.com/blog/bun-in-rust#what-does-this-look-like) |
| [`/dia-browser`](./app/dia-browser/page.tsx) | [The Browser Company — Dia](https://www.diabrowser.com/) |
| [`/buildwithmoveindia`](./app/buildwithmoveindia/page.tsx) | [Build What Moves India](https://buildwhatmovesindia.com/) |
| [`/aeos`](./app/aeos/page.tsx) | [Aeos Labs](https://labs.aeoscompany.com/) |
| [`/mit-education`](./app/mit-education/page.tsx) | [MIT Education](https://www.mit.edu/education/) |
| [`/superlogical`](./app/superlogical/page.tsx) | [Superlogical](https://www.superlogical.com) |
| [`/macroscope`](./app/macroscope/page.tsx) | [Macroscope](https://macroscope.com/) |
| [`/fable-mythos-5-1-new`](./app/fable-mythos-5-1-new/page.tsx) | [Anthropic — Claude, Fable, and Mythos 5.1](https://www.anthropic.com/claude-fable-and-mythos-5-1) |

## Getting started

### Prerequisites

- Node.js 20 or newer
- pnpm 11 or newer

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Visit any route from the table above to view a page study.

### Production build

```bash
pnpm build
pnpm start
```

## Tech stack

- [Next.js](https://nextjs.org/) 16 with the App Router
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Three.js](https://threejs.org/) for 3D and interactive scenes
- [Lucide](https://lucide.dev/) icons

## Project structure

```text
app/       Route-specific pages, components, and styles
public/    Images, fonts, videos, scripts, and other static assets
docs/      Supporting notes and implementation references
lib/       Shared utilities
```

## Notes

This is an independent frontend study project. The pages are recreations for learning and experimentation, and are not affiliated with or endorsed by the referenced companies.

The original references used for each study are listed below.

## Original references

- https://linear.app/next
- https://ampcode.com/notes/how-to-build-an-agent
- https://hermes-agent.nousresearch.com/ (aug 5 2025)
- https://bun.com/blog/bun-in-rust#what-does-this-look-like
- https://www.diabrowser.com/
- https://buildwhatmovesindia.com/
- https://labs.aeoscompany.com/
- https://www.mit.edu/education/
- https://www.superlogical.com
- https://macroscope.com/
- https://www.anthropic.com/claude-fable-and-mythos-5-1
