FROM golang:1.25.8-alpine AS builder

WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

ARG BUILD_VERSION=""
ARG BUILD_MODE=""

# Build binary with optional version and build mode
RUN LDFLAGS="-s -w"; \
    if [ -n "$BUILD_VERSION" ]; then \
        LDFLAGS="$LDFLAGS -X main.BuildVersion=$BUILD_VERSION"; \
    fi; \
    BUILD_TAGS=""; \
    if [ "$BUILD_MODE" = "devmode" ]; then \
        BUILD_TAGS="-tags=devmode"; \
    fi; \
    echo "go build -ldflags=\"$LDFLAGS\" $BUILD_TAGS -o app ."; \
    CGO_ENABLED=0 GOOS=linux go build \
        -ldflags="$LDFLAGS" \
        $BUILD_TAGS \
        -o app .

FROM alpine:latest

WORKDIR /app

# Copy binary from builder
COPY --from=builder /app/app .

COPY ./html ./html


EXPOSE 8081

# Healthcheck (workflow expects /health, add if exists or use root)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8081/health || exit 1

ENV API_ENDPOINT="\${window.location.protocol}//api.\${window.location.hostname}"
CMD ["./app"]
