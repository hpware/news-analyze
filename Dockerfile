# If you have customized your output directory, please just remove it. :)

    FROM oven/bun:latest as builder

    WORKDIR /app
    
    # Copy package files
    COPY package.json ./
    COPY bun.lock* package-lock.json* yarn.lock* ./
    
    # Install dependencies
    RUN bun pm untrusted
    RUN bun install --prod
    
    # Copy source files
    COPY . .
    
    # Build the application
    RUN bun run build
    
    # Production stage
    FROM oven/bun:latest
    
    WORKDIR /app
    
    # Copy package files for production
    COPY --from=builder /app/package.json ./
    
    # Create a shell script to handle build output copying
    RUN echo '#!/bin/sh\n\
    for dir in ".output" "dist" "build" ".next"; do\n\
      if [ -d "/build/$dir" ]; then\n\
        mkdir -p "$dir"\n\
      fi\n\
    done' > /copy-builds.sh && chmod +x /copy-builds.sh
    
    # Copy build outputs from builder
    COPY --from=builder /app /build
    RUN /copy-builds.sh && rm -rf /build /copy-builds.sh
    
    # Install production dependencies
    RUN bun install --production
    
    EXPOSE 3000
    
    CMD ["bun", "run", "start"]