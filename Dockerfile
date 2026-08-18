# Multi-stage Dockerfile for Dokploy / Donweb VPS Deployment
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve Frontend with Nginx & Backend with Node.js
FROM nginx:alpine
RUN apk add --no-cache nodejs npm

WORKDIR /app
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/server ./server
COPY --from=builder /app/docker-start.sh ./docker-start.sh
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN chmod +x ./docker-start.sh

EXPOSE 80
CMD ["/app/docker-start.sh"]
