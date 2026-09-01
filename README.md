# [Brand Name] — Furniture Showroom & Planning Concept

A front-end concept for a furniture showroom you can plan through: explore complete room scenes, save exact
pieces and finishes, build a quote list, keep measurements, and bring the whole plan to a showroom visit.

Mock data only — there is no backend, no authentication and no payment processing. Nothing submitted by the
forms is sent anywhere.

## Stack

|            |                                                                            |
| ---------- | -------------------------------------------------------------------------- |
| Framework  | React 19 + [TanStack Start](https://tanstack.com/start) (SSR) on Vite 8    |
| Router     | TanStack Router, file-based (`src/routes/`)                                |
| Styling    | Tailwind v4 — all design tokens in `src/styles.css`                        |
| Components | shadcn/ui (Radix primitives), lucide icons                                 |
| State      | React context (`src/lib/planner-context.tsx`), persisted to `localStorage` |
| Motion     | CSS transitions and keyframes; no animation library                        |

## Getting started

```bash
npm install
npm run dev      # http://localhost:8080
npm run build    # production build to .output/
npm run preview
npm run lint
```

The production build targets nitro's `node-server` preset. Override with `NITRO_PRESET` to deploy elsewhere.

## Routes

| Route                | Page                                                                                   |
| -------------------- | -------------------------------------------------------------------------------------- |
| `/`                  | Home — hero, room exploration, featured pieces, materials, planning desk, showroom CTA |
| `/rooms`             | Virtual showroom — room scenes with shoppable hotspots                                 |
| `/collection`        | Product grid with filters and sort                                                     |
| `/collection/$slug`  | Product detail                                                                         |
| `/materials`         | Materials and finishes, with sample requests                                           |
| `/planner`           | Saved rooms, quote drafts, measurements, visits, saved materials                       |
| `/planner/rooms/$id` | Saved room detail / moodboard                                                          |
| `/quote`             | Quote list and quote request                                                           |
| `/showrooms`         | Locations and visit booking                                                            |

## Design direction

Warm, tactile, calm, architectural, material-focused and slightly editorial — practical rather than
decorative. Deliberately not SaaS-dashboard, not generic e-commerce, not cold minimalism, not black-and-gold.

**Palette** (tokens in `src/styles.css`)

`--ivory #F6F1E8` · `--parchment #EFE7D8` · `--limestone #E4DCCB` · `--taupe #B8A996` · `--clay #B5745A`
· `--rust #8F4A32` · `--olive #6B6A47` · `--oak #C8A97E` · `--walnut #4A3325` · `--graphite #2A2420`

Section backgrounds layer ivory → parchment → limestone → walnut for tonal shift. No pure black.

**Typography** — Inter for body, Inter Tight for headings (`--font-display`), Instrument Serif as a sparing
editorial accent (`--font-editorial`).

**Texture** — product, room and material imagery are CSS-gradient placeholders defined as Tailwind `@utility`
rules (`placeholder-oak`, `placeholder-boucle`, `placeholder-room`, …), each with a distinct tonal fill rather
than identical grey rectangles.

**Motion** — restrained, 150–450ms, transform and opacity only, and always behind
`prefers-reduced-motion: reduce`. Motion supports spatial understanding (room switching, hotspot selection,
panel continuity) and state feedback (saves, quote count, form results). No parallax, scroll-jacking, spring
easing or continuous decorative animation.

## Data

Typed mock data lives in `src/data/` — `products.ts`, `rooms.ts`, `materials.ts`, `planner.ts`, `showrooms.ts`.

The planner context persists saved pieces, saved rooms, quote items and an optional guest profile to
`localStorage` (key `brand-planner-v2`). Reads happen in `useEffect` after mount to avoid SSR hydration
mismatches.

## Notes

`[Brand Name]` is an intentional placeholder. It is defined once in `src/lib/brand.ts` and used everywhere
else, so it is a one-line change.
