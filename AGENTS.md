# Working in this repo

A front-end-only furniture showroom concept. See `README.md` for the stack and design direction.

## Conventions

- TypeScript is strict. No `any`, no `as any` on router links — TanStack Router's link types are exhaustive.
- Routes are file-based in `src/routes/`; `src/routeTree.gen.ts` is generated, never edit it by hand.
  See `src/routes/README.md` for the naming conventions.
- Design tokens live in `src/styles.css`. Use the palette utilities (`bg-parchment`, `text-graphite`,
  `border-walnut/12`) rather than raw hex values.
- Placeholder imagery uses the `placeholder-*` `@utility` classes. Keep new placeholders tonally distinct
  and captioned.
- One code path per feature across breakpoints. Responsive differences belong in CSS, not in duplicated
  desktop/mobile components.
- Overlays (sheets, dialogs, menus) go through `src/components/ui/overlay.tsx` so focus trapping, Escape,
  scroll lock and transitions stay consistent.
- Motion is CSS-first and must degrade under `prefers-reduced-motion: reduce`.

## Scope

This is a concept: no backend, no authentication, no payments. Mock flows should be honest about being
mock — never imply that a form submission reached anyone.

## Checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```
