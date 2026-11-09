# ─── Stage 1: build the static bundle ─────────────────────────────────────────
FROM node:20-bookworm-slim AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Vite inlines env vars at build time, so the API URL must be known here. Public client-side URLs only.
# nosemgrep: dockerfile.security.secret-in-build-arg.secret-in-build-arg
ARG VITE_API_URL=http://localhost:3000/api
ARG VITE_SOCKET_URL=http://localhost:3000
ARG VITE_EXAM_APP_URL=
ENV VITE_API_URL=$VITE_API_URL \
    VITE_SOCKET_URL=$VITE_SOCKET_URL \
    VITE_EXAM_APP_URL=$VITE_EXAM_APP_URL

RUN npm run build


# ─── Stage 2: serve ───────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runtime

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY security-headers.inc /etc/nginx/conf.d/security-headers.inc

EXPOSE 80
# Nginx worker processes drop privileges to 'nginx' user; entrypoint runs in alpine container runtime
# nosemgrep: dockerfile.security.missing-user.missing-user
CMD ["nginx", "-g", "daemon off;"]
