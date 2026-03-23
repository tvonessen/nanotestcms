# AGENTS.md — nanotestcms

Payload CMS v3 + Next.js 16 corporate site for Nanotest. Payload runs embedded inside Next.js (same process, same port). MongoDB via `@payloadcms/db-mongodb`. No test suite.

## Commands

```bash
pnpm dev            # Dev server on :3301 (Next.js + Payload admin)
pnpm devsafe        # rm -rf .next && pnpm dev (use when .next cache is stale)
pnpm build          # Production build (standalone output)
pnpm lint           # Biome linter + formatter check
pnpm generate:types # Regenerate src/payload-types.ts after schema changes
pnpm generate:importmap  # Regenerate Payload import map after adding blocks/components
pnpm db:sync        # Sync database via scripts/sync_db.js
```

**After any change to a collection, global, block, or field schema**: run `pnpm generate:types`. Never edit `src/payload-types.ts` manually.

## Route Architecture

Two Next.js route groups share the same server:

| Group | Path | Purpose |
|---|---|---|
| `(app)` | `src/app/(app)/[lang]/` | Public site — all routes under `/en/` or `/de/` |
| `(payload)` | `src/app/(payload)/` | Payload admin (`/admin`), REST/GraphQL API, draft endpoint |

All public pages are server components that call `getPayload({ config })` directly — no API layer, no `fetch()`.

## Data Flow Pattern

```
Page server component
  → getPayload({ config })
  → payload.find({ collection, locale: lang, overrideAccess: false })
  → <Content lang={lang} blocks={doc.content} />
      → resolveAutoAlignment(blocks)  // alternates left/right for 'auto' alignment
      → switch(block.blockType) → individual block component
```

Key files: `src/app/(app)/[lang]/products/[product]/page.tsx`, `src/components/content/content.tsx`.

## Localization

- Two locales: `en` (default) and `de` — defined in `src/config/locales.ts`.
- The `[lang]` segment in every public route carries the locale; pass it as `locale: lang` to every Payload query.
- Payload fields are localized at field level via `localized: true`; `fallback: true` is set globally.
- `generateStaticParams()` on every page must iterate `locales.map(({ code }) => ({ lang: code }))`.

## Payload Schema Conventions

- **Collections** → `src/collections/` (PascalCase `.ts`). Slug drives URL segment.
- **Globals** → `src/globals/` — singleton content fetched via `payload.findGlobal({ slug })`.
- **Blocks** → `src/blocks/` (slug = kebab-case, e.g. `'text-image'`); React counterparts in `src/components/content/`.
- **Reusable fields** → `src/fields/` (e.g. `slugField`, `alignmentField`, `linkField`).
- Access control: `isLoggedIn` for write ops; `isPublishedOrLoggedIn` for reads (returns Payload query filter for published docs when unauthenticated). Both in `src/app/(payload)/access/`.
- Drafts + scheduled publish are enabled on all content-bearing collections and globals (`versions.drafts.schedulePublish: true`).

## On-Demand Revalidation

Globals and collections call `revalidateHook(path, locale)` in their `afterChange` hook. This hits `POST /api/revalidate` which calls `revalidatePath()`. **Only fires when `doc._status !== 'draft'`**. See `src/utils/revalidate.ts`.

## Draft / Preview Mode

`isPreviewEnabled()` (`src/utils/preview.ts`) requires **both** Next.js draft mode cookie AND an active `payload-token` cookie. The admin bar (`src/components/utility/AdminBar.tsx`) toggles preview via `GET/DELETE /api/draft` and calls `router.refresh()`.

## Content Block Alignment

`text`, `text-image`, and `text-video` blocks support an `alignment` field with values `left`, `right`, or `auto`. `auto` is resolved server-side in `resolveAutoAlignment()` inside `content.tsx` — it alternates direction relative to the previous alignable block in the list.

## Custom Payload API Endpoints

Registered in `src/payload.config.ts` under `endpoints`:

| Path | Handler |
|---|---|
| `POST /api/send-email` | `src/utils/send-email.ts` — proxies to Nodemailer via `req.payload.sendEmail()` |
| `POST /api/dont-bother-me` | `src/utils/validate-captcha.ts` — reCAPTCHA v3 verification |
| `POST /api/revalidate` | `src/utils/revalidate.ts` — Next.js path revalidation |

## Styling Rules

- **Tailwind CSS 4** + **HeroUI** (`@heroui/react`). Prefer HeroUI primitives (Button, Card, Accordion) over custom markup.
- Custom CSS tokens in `src/styles/globals.css`: primary `#00A984`, secondary `#8A4F7D` / gold `#F3B61F` (dark), focus `#FC8450`.
- Dark mode via `next-themes` class strategy; use `dark:` variant.
- Biome enforces: 2-space indent, 100-char lines, single quotes (JS), double quotes (JSX), trailing commas, semicolons.
- `console.log` is a Biome error; use `console.info/warn/error`.

## Key External Integrations

- **Google reCAPTCHA v3**: `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` env var; provider wraps the app in `src/app/(app)/[lang]/providers.tsx`.
- **Nodemailer**: config in `src/config/nodemailer.ts`; transport created once in `payload.config.ts`.
- **Image hosts** allowed in `next.config.mjs`: `localhost:3301`, `nanotest.jutoserver.de`, `nanotest-dev.jutoserver.de`.
- **`@phosphor-icons/react`**: icon library used throughout. SSR icons import from `@phosphor-icons/react/dist/ssr`.

