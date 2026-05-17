# syntax=docker/dockerfile:1

# Root Dockerfile workaround for Dokploy
# Build with: docker build -f Dockerfile .

# Build stage
FROM node:24-alpine AS builder

# Install Bun
RUN apk add --no-cache curl bash unzip && \
    curl -fsSL https://bun.sh/install | bash && \
    mv /root/.bun/bin/bun /usr/local/bin/bun

WORKDIR /app

# Copy package files from backend directory
COPY backend/package.json backend/bun.lock* ./

# Install dependencies with Bun
RUN bun install

# Copy source code from backend directory
COPY backend/. .

# Build the NestJS application
RUN bun run build

# Production stage
FROM node:24-alpine AS production

# Install Bun
RUN apk add --no-cache curl bash unzip && \
    curl -fsSL https://bun.sh/install | bash && \
    mv /root/.bun/bin/bun /usr/local/bin/bun

WORKDIR /app

# Copy built assets and dependencies from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copy and set permissions for entrypoint from backend directory
COPY backend/entrypoint.sh ./
RUN chmod +x entrypoint.sh

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the application port
EXPOSE 3000

# Start the application via entrypoint
ENTRYPOINT ["./entrypoint.sh"]
