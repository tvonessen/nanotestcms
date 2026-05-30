# Nanotest CMS

Corporate website and content management system for **NANOTEST** — thermal characterisation and reliability testing. Built with [Payload CMS v3](https://payloadcms.com) embedded inside [Next.js 16](https://nextjs.org), backed by MongoDB.

---

## Table of contents

- [How does it work — the simple version](#how-does-it-work--the-simple-version)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Local development](#local-development)
- [Environment variables](#environment-variables)
- [Content management](#content-management)
- [File uploads](#file-uploads)
- [Commands reference](#commands-reference)
- [Production deployment](#production-deployment)
- [Rollback](#rollback)
- [Database sync](#database-sync)

---

## How does it work — the simple version

The website has two parts running as a single application:

1. **The public website** — what visitors see at `nanotest.eu`. Pages, products, team, contact form. Available in English and German.
2. **The admin panel** — a private interface at `/admin` where editors manage all content: texts, images, documents, team members, etc.

When an editor publishes something in the admin panel, the website automatically updates (no manual rebuild needed).

Uploaded images are automatically resized into multiple formats so the website always loads the smallest version that still looks good on any screen.

---

## Architecture

```
Browser
  ↓ HTTPS
Mittwald reverse proxy
  ↓ HTTP :PORT (assigned by Mittwald)
Node.js process  (managed by Mittwald's mittnite supervisor)
  ├── Next.js 16 (App Router, SSG/SSR)      → public website at /[en|de]/...
  └── Payload CMS v3 (embedded)             → admin panel at /admin
        └── MongoDB  ←→  collections, globals, media metadata
              local filesystem (live/data/) ← uploaded files (media, documents)
```

### Route groups

| Route group | Path | Purpose |
|---|---|---|
| `(app)` | `/en/…` and `/de/…` | Public website — server-rendered, statically generated where possible |
| `(payload)` | `/admin`, `/api/…` | Payload admin UI, REST + GraphQL API |

### Data model

**Collections** (multi-document, like a database table):

| Slug | Contents |
|---|---|
| `media` | Images — auto-resized to 5 sizes (blurred placeholder, thumb, small, medium, large) |
| `documents` | PDFs, Word, Excel, PowerPoint, etc. |
| `solutions` | Products / services (the "NT" pages) |
| `solution-categories` | Grouping for products |
| `team-members` | Team gallery entries |
| `distro-partners` | Distribution partner logos & links |
| `pages` | Custom CMS-managed pages |
| `redirects` | URL redirects (managed in admin, served at runtime) |
| `users` | Admin panel users |

**Globals** (single-document, site-wide settings):

| Slug | Contents |
|---|---|
| `homepage` | Hero, highlights, features on the front page |
| `about` | About / company page content |
| `contact-us` | Contact page content |
| `legal` | Imprint / privacy policy |

**Content blocks** — all content pages are composed of these reusable building blocks:

`Hero` · `Text` · `Text + Image` · `Text + Video` · `Highlight` · `Features` · `Cards` · `Downloads` · `Contact Form`

### On-demand revalidation

When content is **published** (not just saved as draft) in the admin panel, Payload fires a webhook to Next.js that invalidates the relevant cached pages. Visitors always see up-to-date content within seconds — no site rebuild required.

---

## Prerequisites

| Tool | Required version |
|---|---|
| Node.js | `^24` |
| pnpm | `^10.0.0` |
| MongoDB | any recent version (local or remote) |

Install pnpm if not already available:
```bash
npm install -g pnpm
```

---

## Local development

```bash
# 1. Clone the repository
git clone <repo-url>
cd nanotestcms

# 2. Install dependencies
pnpm install

# 3. Copy the env template and fill in your values
cp .env .env.local   # then edit .env.local — see Environment variables below

# 4. Start the development server
pnpm dev
```

The dev server starts on **port 3301** (hardcoded for local use only):
- Public website: `http://localhost:3301/en`
- Admin panel: `http://localhost:3301/admin`

> **First run:** Open the admin panel and create the first user. This user becomes the super-admin.

If you run into stale cache issues, use `pnpm devsafe` instead — it clears `.next` before starting.

---

## Environment variables

Copy `.env` and adjust. Never commit secrets to the repository.

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URI` | MongoDB connection string | `mongodb://127.0.0.1/nanotest` |
| `HOST` | Base URL scheme + hostname | `https://www.nanotest.eu` |
| `PORT` | Port the Node.js server binds to. **On production this is assigned by Mittwald — do not hardcode it.** | `3000` |
| `NEXT_PUBLIC_SERVER_URL` | Public-facing URL used in the admin bar, SEO meta tags, and preview links. Must be reachable by browsers. | `https://www.nanotest.eu` |
| `INTERNAL_SERVER_URL` | Server-side-only URL for self-calls (e.g. revalidation). Use `http://localhost:$PORT` if the app cannot reach itself via the public domain. | `http://localhost:3000` |
| `PAYLOAD_SECRET` | Random secret for Payload's JWT signing. Generate once, keep private. | `openssl rand -hex 32` |
| `SMTP_EMAIL_HOST` | Outgoing mail server hostname | `mail.example.com` |
| `SMTP_EMAIL_PORT` | SMTP port (usually `465` for TLS) | `465` |
| `SMTP_EMAIL_USER` | SMTP username | `user@example.com` |
| `SMTP_EMAIL_PASS` | SMTP password | — |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Google reCAPTCHA v3 site key (public, safe to expose) | — |
| `RECAPTCHA_SECRET_KEY` | Google reCAPTCHA v3 secret key (keep private) | — |

For `pnpm db:sync` only (never needed in production):

| Variable | Description |
|---|---|
| `DATABASE_URI_PROD` | Production MongoDB URI (source) |
| `DATABASE_URI_DEV` | Development MongoDB URI (target) |

> **`INTERNAL_SERVER_URL` vs `NEXT_PUBLIC_SERVER_URL`:** On Mittwald, the Node.js process may not be able to reach itself through the public domain (DNS loopback restrictions). Set `INTERNAL_SERVER_URL=http://localhost:$PORT` so that server-side revalidation calls go directly to the local port instead of the public internet.

---

## Content management

Open the admin panel at `/admin`. Log in with your editor account.

### Publishing workflow

Content supports **draft mode**: save a draft to review changes privately before they go live. Use the **Publish** button to make content visible to website visitors.

**Scheduled publishing** is supported — set a future date on any content item.

### Live preview

While editing, click **Preview** in the admin bar to see an exact preview of how the page will look when published — without actually publishing it.

### Localisation

All content fields that are language-specific exist in both **English** and **German**. Switch the locale using the language selector in the top bar of the admin panel. Always fill in both languages.

### Media uploads

Images are accepted up to **20 MB**. After uploading, Payload automatically generates 5 sizes in the background (see [File uploads](#file-uploads)).

Documents (PDF, Word, Excel, PowerPoint, etc.) are also accepted up to **20 MB**.

---

## File uploads

Uploaded files are stored on the server's local filesystem:

| Type | Runtime path |
|---|---|
| Images | `live/data/media/` |
| Documents | `live/data/documents/` |

`live/data/` is a **persistent symlink** to `live.data/` — a directory that sits outside the release folder and survives every deployment.

### Image resizing

When an image is uploaded, Payload passes it through [Sharp](https://sharp.pixelplumbing.com) and generates these derivative sizes synchronously (in the same upload request):

| Size name | Width | Notes |
|---|---|---|
| `blurred` | 16 px | Tiny placeholder for blur-up loading effect |
| `thumb` | 240 px | Admin panel thumbnails |
| `small` | 640 px | Mobile screens |
| `medium` | 1 280 px | Tablet / small desktop (not upscaled) |
| `large` | 1 536 px | Large desktop (not upscaled) |

SVG files are sanitised (XML declaration removed, namespace prefixes normalised) for safe inline embedding, but not resized.

> **Important:** Image generation happens synchronously during the upload request. Uploading very large images or many images at once may take a few seconds longer than a plain file upload — this is expected behaviour.

---

## Commands reference

| Command | What it does |
|---|---|
| `pnpm dev` | Start dev server on port 3301 with hot reload |
| `pnpm devsafe` | Clear `.next` cache, then start dev server |
| `pnpm build` | Production build (outputs `standalone` bundle to `.next/`) |
| `pnpm lint` | Run Biome linter and formatter checks |
| `pnpm generate:types` | Regenerate `src/payload-types.ts` from the Payload schema — **run this after any change to a collection, global, block, or field** |
| `pnpm generate:importmap` | Regenerate Payload's import map — run after adding new blocks or admin components |
| `pnpm db:sync` | Copy production database → local development database |

---

## Production deployment

The application runs on **[Mittwald](https://www.mittwald.de)** managed Node.js hosting. Mittwald's `mittnite` process supervisor keeps the Node.js process running at all times and restarts it automatically after a crash or a graceful restart signal.

### How a deployment works

1. `update.sh` runs (manually or via cron).
2. It checks for new commits on the upstream Git branch.
3. If changes are found: `pnpm install` → `pnpm build`.
4. `deploy.sh` is called:
   - New build artifacts are staged to `live.new/`.
   - Persistent data directory (`live.data/`) is validated and symlinked.
   - A pre-deploy backup of `live.data/` is saved to `logs/data-backup.tar.gz` (overwritten each deploy — only the latest backup is kept).
   - The current `live/` directory is renamed to `live.prev/` (instant rollback point).
   - `live.new/` is renamed to `live/` — the swap is effectively atomic.
   - `mittnitectl job restart` signals Mittwald's supervisor to restart the process with the new code.
   - `deploy.sh` polls `http://localhost:$PORT/` until the server responds (up to 90 seconds).
5. If the health check passes → `live.prev/` is deleted, deployment is complete.
6. If the health check times out → automatic rollback: `live/` is moved to `live.failed/`, `live.prev/` is restored, the process is restarted.

> No downtime during build — the old server continues serving traffic until the `mv` swap and supervisor restart.

### Directory layout on the server (app root)

```
/                        ← app installation root (Mittwald)
├── live/                ← active release (current code)
│   ├── server.js        ← Next.js standalone entry point
│   ├── .env             ← runtime environment variables (copied from repo root .env)
│   └── data/            ← symlink → ../live.data/
├── live.data/           ← persistent data (never deleted by deployments)
│   ├── media/           ← uploaded images
│   └── documents/       ← uploaded documents
├── live.failed/         ← last failed release (only present after a failed deploy, deleted at next deploy)
├── logs/
│   ├── deploy.log       ← deployment log
│   ├── server.log       ← Node.js server stdout/stderr
│   └── data-backup.tar.gz  ← pre-deploy snapshot of live.data/ (overwritten each deploy)
├── update.sh            ← deployment entry point
├── deploy.sh            ← release swap and supervisor restart
├── start.sh             ← process start script (loads .env, sets HOSTNAME, exec node)
└── .env                 ← source of truth for environment variables (never committed)
```

### mStudio configuration

In Mittwald mStudio, the Node.js app must be configured with:

- **Start command:** `sh start.sh`
- **Working directory:** app root (where `start.sh` lives)
- **PORT** is provided by Mittwald as an environment variable — the value can change and must not be hardcoded anywhere.

### Setting up the cron job

In mStudio, add a cron job that runs periodically (e.g. every hour or every night):

```
./update.sh >> logs/deploy.log 2>&1
```

`update.sh` exits immediately (with code 0) if no new commits are found, so it is safe to run frequently. It also prevents concurrent runs using a lock file — if a deployment is already in progress, a second trigger is ignored.

### First deployment (initial setup)

1. SSH into the server (`mw app ssh` or mStudio terminal).
2. Clone the repository into the app root.
3. Copy `.env` and fill in all production values (including the `PORT` assigned by Mittwald).
4. Run `./update.sh` manually — this performs the first build and creates `live/`.
5. In mStudio, set the start command to `sh start.sh`.
6. Mittwald's supervisor will start the process automatically.

---

## Rollback

The previous release is preserved as `live.prev/` until the health check confirms the new deployment is healthy — then it is deleted automatically. If a deployment fails (health check timeout), the previous release is automatically restored.

**To roll back manually** (only needed if automatic rollback also failed, SSH into the server):

```bash
# 1. Move broken release out of the way
mv live live.failed

# 2. Restore previous release
mv live.prev live

# 3. Restart the process
mittnitectl job restart
```

A single backup of the persistent data directory is kept at `logs/data-backup.tar.gz` and overwritten on every deployment.

---

## Database sync

To pull the production database into your local development environment:

```bash
pnpm db:sync
```

**Requirements:** `mongodump` and `mongorestore` must be installed locally. Set `DATABASE_URI_PROD` and `DATABASE_URI_DEV` in your local `.env`.

> **Warning:** This overwrites the local development database completely. It does not touch the production database.

> **Note:** Production is always the source of truth. Never sync in the reverse direction.
