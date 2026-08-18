FROM golang:1.25.8-alpine AS builder

WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build binary
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o app ./main.go

FROM alpine:latest

WORKDIR /app

# Copy binary from builder
COPY --from=builder /app/app .


EXPOSE 8081

# Healthcheck (workflow expects /health, add if exists or use root)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8081/health || exit 1

CMD ["./app"]
