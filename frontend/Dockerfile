# ── Build stage ──────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# When built inside Docker, the frontend is served via nginx
# which proxies /api/ to backend — so the API base is relative
ENV VITE_API_BASE=""
RUN npm run build

# ── Serve stage ──────────────────────────────────────────
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
