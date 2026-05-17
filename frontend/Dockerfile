# syntax=docker/dockerfile:1

# Build stage
FROM oven/bun:latest AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Build the React Router application
RUN bun run build

# Production stage
FROM node:24-alpine AS production

WORKDIR /app

# Copy built assets and dependencies from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copy and set permissions for entrypoint
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Expose the application port
EXPOSE 3000

# Start the application via entrypoint
ENTRYPOINT ["./entrypoint.sh"]
