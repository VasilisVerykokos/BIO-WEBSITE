# syntax=docker/dockerfile:1.7

# Production image: build the static site with Node, serve it with nginx.
# The runtime image contains no Node, no npm, and no source — only the built
# bytes and a web server.
#
# Build from the REPO ROOT, not from this folder:
#   docker build -f docker/Dockerfile -t bio-website .

# ---- Stage 1: build ---------------------------------------------------------
# Node 22 LTS. BUILD_PLAN requires "Node 20 LTS or newer"; 22 is pinned here for
# reproducibility rather than tracking whatever is installed locally.
FROM node:22-alpine AS build

WORKDIR /app

# Copy the manifests alone first so `npm ci` is cached and only re-runs when a
# dependency actually changes — not on every source edit.
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .

# Gate 1: same artifact everywhere, only config differs. No host is hardcoded —
# astro.config.mjs reads SITE_URL, and it is supplied per environment.
ARG SITE_URL
ENV SITE_URL=${SITE_URL}

RUN npm run build

# ---- Stage 2: serve ---------------------------------------------------------
# Unprivileged nginx: runs as UID 101, binds 8080, never root.
FROM nginxinc/nginx-unprivileged:1.27-alpine AS serve

USER root
COPY docker/nginx/default.conf          /etc/nginx/conf.d/default.conf
COPY docker/nginx/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --from=build /app/dist             /usr/share/nginx/html
RUN chown -R 101:101 /usr/share/nginx/html
USER 101

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q --spider http://127.0.0.1:8080/ || exit 1

STOPSIGNAL SIGQUIT
CMD ["nginx", "-g", "daemon off;"]
