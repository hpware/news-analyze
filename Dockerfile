FROM oven/bun:latest as builder

WORKDIR /app

# Copy package.json first
COPY package.json ./

# Copy lock files if they exist (support both bun and npm/yarn)
COPY bun.lockb* package-lock.json* yarn.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile || bun install

# Copy remaining source files
COPY . .

# Build the application
RUN bun run build

# Production stage
FROM oven/bun:latest

WORKDIR /app

# Copy built assets and dependencies
COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/build /app/build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/bun.lockb* ./
# If you have customized your output directory, please add your custom one here, or just remove it. :)


# Install production dependencies
RUN bun install --production

EXPOSE 3000
CMD ["bun", "run", "start"]