FROM oven/bun:latest as builder

WORKDIR /app

# Copy package files
COPY package.json ./
COPY bun.lockb* package-lock.json* yarn.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile || bun install

# Copy source files
COPY . .

# Build the application
RUN bun run build

# Production stage
FROM oven/bun:latest

WORKDIR /app

# Copy package files for production
COPY --from=builder /app/package.json ./
COPY --from=builder /app/bun.lockb* ./

# Conditionally copy build outputs based on framework
COPY --from=builder /app/.output* /app/.output* 2>/dev/null || true
COPY --from=builder /app/dist* /app/dist* 2>/dev/null || true
COPY --from=builder /app/build* /app/build* 2>/dev/null || true
COPY --from=builder /app/.next* /app/.next* 2>/dev/null || true
# If you have customized your output directory, please add your custom one here, or just remove it. :)


# Install production dependencies
RUN bun install --production

EXPOSE 3000

# Start command will be determined by the framework
CMD ["bun", "run", "start"]