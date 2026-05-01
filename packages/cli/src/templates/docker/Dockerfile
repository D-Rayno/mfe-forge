# Multi-stage build for MFE applications
FROM oven/bun:1 AS builder

WORKDIR /app
COPY package.json bun.lock* ./
COPY apps/{{scope}}/{{app}}/package.json ./apps/{{scope}}/{{app}}/
RUN bun install

COPY . .
RUN bun run build --scope {{scope}}

# Production stage
FROM nginx:alpine

COPY --from=builder /app/apps/{{scope}}/{{app}}/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
