# Docker

Two ways to run the site. Both build from the repo root.

```bash
docker compose up --build          # production build  → http://localhost:8080
docker compose --profile dev up    # dev server, HMR   → http://localhost:4321
```

Override the port or the canonical origin without editing a file:

```bash
PORT=3000 SITE_URL=https://verykokos.dev docker compose up --build
```

## What is here

| File | Role |
|---|---|
| `Dockerfile` | Two stages: Node 22 builds the site, unprivileged nginx serves `dist/`. The runtime image contains no Node, no npm, and no source. |
| `Dockerfile.dev` | Astro dev server with hot reload. Dependencies only — source is bind-mounted. |
| `nginx/default.conf` | Static server: routing, gzip, and the cache ladder. |
| `nginx/security-headers.conf` | The security headers, `include`d by every location block. |

## Decisions worth knowing about

**Unprivileged by default.** The runtime image is `nginx-unprivileged`, so the server
runs as UID 101 on port 8080 and never as root. Compose adds `read_only: true`,
`cap_drop: ALL`, and `no-new-privileges`, with `tmpfs` mounts for the two paths nginx
actually writes to.

**Headers are included per location, not set once.** nginx's `add_header` does not
inherit into a location block that declares its own `add_header` — a location that sets
`Cache-Control` would silently drop every security header. Hence the shared snippet and
the `include` in each block.

**The cache ladder has one deliberate exception.** Everything content-hashed
(`/_astro/`, fonts, images) is `immutable` for a year. HTML revalidates every time. So
does `/cv.pdf` — it is not hashed, its path can never change because it lives in sent
applications, and a year-long cache would hand a recruiter a stale CV.

**`SITE_URL` is a build argument, not a runtime one.** Astro needs the canonical origin
at build time to emit absolute URLs for Open Graph, JSON-LD, and the sitemap. No host is
hardcoded anywhere.

## Relationship to Vercel

`BUILD_PLAN.md` Phase 14 deploys to Vercel. This Docker path is an addition, not a
replacement — it is what makes the site portable to any host that runs a container.
The headers and cache rules here and in `vercel.json` are deliberately identical, so
whichever way the site is served, it is served the same.

## Not yet verified

The nginx config and `compose.yaml` are syntax-checked against real images. The image
**build** cannot run until Phase 1 creates `package.json` and the Astro project —
`npm ci` has nothing to install yet. First real build happens at the end of Phase 1.
