# Copilot Instructions

## MCP Servers

Context7 is configured (`.mcp.json`). **Always use Context7 to fetch up-to-date documentation** before answering questions or making changes involving:
- **Payload CMS** — use Context7 library ID `payload/payload` (v3 API, collections, globals, blocks, access control, hooks, local API)
- **Next.js** — use Context7 library ID `vercel/next.js` (App Router, server components, `generateStaticParams`, `revalidateTag`, middleware)
- **Tailwind CSS** — use Context7 library ID `tailwindlabs/tailwindcss` (utility classes, config, dark mode)
- **HeroUI** — use Context7 library ID `hero-ui/hero-ui` (components, theming, best practices)
- **next-intl** — use Context7 library ID `formatjs/next-intl` (i18n routing, message formatting, locale detection)

## Project Overview

**nanotestcms** is a hybrid Payload CMS v3 + Next.js 16 corporate website for Nanotest (thermal characterization and reliability testing). Payload serves as the headless CMS (admin UI at `/admin`, MongoDB-backed), and Next.js handles the public-facing site with App Router SSG/SSR.

## Commands

```bash
pnpm dev                  # Dev server on port 3301
pnpm devsafe              # Removes .next then starts dev server
pnpm build                # Production build
pnpm lint                 # ESLint + Biome linter
pnpm generate:types       # Regenerate payload-types.ts from Payload schema
pnpm generate:importmap   # Regenerate Payload import map
pnpm db:sync              # Sync database via scripts/sync_db.js
```

**Requirements**: Node ^24, PNPM ^10.0.0

There is no test suite.

## Architecture

The app uses two Next.js route groups:

- **`src/app/(app)/[lang]/`** — public website with i18n. All public routes live under a `[lang]` dynamic segment (`en` | `de`).
- **`src/app/(payload)/`** — Payload CMS admin, API routes, and access control hooks. Biome ignores this directory.

**Data flow**: Server components call `getPayload()` to fetch from MongoDB → render content blocks as React components. No client-side data fetching layer. Dynamic routes (`products/[product]`, `services/[service]`) use `generateStaticParams()` for SSG.

**On-demand revalidation**: The `/api/revalidate` endpoint calls `revalidateTag()` to purge the Next.js cache when content is published in Payload.

## Payload CMS Conventions

- **Collections** live in `src/collections/`: `Solutions`, `SolutionCategories`, `TeamMembers`, `DistroPartners`, `Documents`, `Media`, `Users`.
- **Globals** live in `src/globals/`: `HomepageContent`, `AboutContent`, etc. — these are singleton content objects fetched directly in page server components.
- **Blocks** live in `src/blocks/` and define the polymorphic block schema: `TextBlock`, `TextImageBlock`, `TextVideoBlock`, `HighlightBlock`, `FeaturesBlock`, `CardsBlock`, `DownloadsBlock`, `ContactFormBlock`. Block React components live in `src/components/content/`.
- **Generated types**: `src/payload-types.ts` is auto-generated — never edit manually. Run `pnpm generate:types` after changing collections/globals/fields.
- **Access control**: `isLoggedIn` and `isPublishedOrLoggedIn` helpers (in `src/app/(payload)/access/`) gate collection read/write.
- Locales are `en` (default) and `de`. Payload config at `src/payload.config.ts`.

## Component & File Conventions

- Components: PascalCase `.tsx` (e.g., `Navbar.tsx`, `ContactForm.tsx`)
- Utilities: kebab-case `.ts` (e.g., `send-email.ts`, `validate-captcha.ts`)
- Payload blocks/collections/fields: PascalCase `.ts`
- Components are feature-grouped under `src/components/`: `navigation/`, `content/`, `footer/`, `carousel/`, `distributors/`, etc.
- Path alias `@/*` maps to `src/*`. Use it for all internal imports.

## Styling

- **Tailwind CSS 4** + **HeroUI** component library. Use HeroUI primitives (Button, Card, Accordion, Modal) before writing custom components.
- Custom color tokens defined as CSS variables in `src/styles/globals.css`:
  - Primary: `#00A984` (green)
  - Secondary: `#8A4F7D` (purple) / `#F3B61F` (gold, dark mode)
  - Focus/accent: `#FC8450` (orange)
- Dark mode via `next-themes` with class strategy. Use Tailwind's `dark:` variant.
- HeroUI theme config lives in `tailwind.config.ts`.

## Internationalization

- `next-intl` handles routing and translations. Message files live in `src/` (check `i18n` config).
- Always access the current locale via the `[lang]` route param or `useParams()`. Never hard-code `en`/`de` strings for locale detection.
- Payload content is localized at the field level via the `localized: true` flag.

## Code Style (Biome)

- 2-space indent, 100-char line width, single quotes (JS), double quotes (JSX), trailing commas everywhere, semicolons always.
- Run `pnpm lint` to check. Biome handles both formatting and linting — do not add ESLint rules that conflict.
