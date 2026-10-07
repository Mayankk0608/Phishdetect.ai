# Docker Deployment Guide for PhishGuard AI

This guide explains how to build and run PhishGuard AI using Docker.

## Prerequisites

- Docker Engine 20.10+ or Docker Desktop
- Docker Compose (optional, for easier management)

## Quick Start

### Option 1: Using Docker Compose (Recommended)

1. **Create a `.env` file** with your configuration:
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env`** and set your Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   APP_URL=http://localhost:3000
   ```

3. **Build and run**:
   ```bash
   docker-compose up -d
   ```

4. **Access the application**:
   Open your browser to http://localhost:3000

5. **View logs**:
   ```bash
   docker-compose logs -f
   ```

6. **Stop the application**:
   ```bash
   docker-compose down
   ```

### Option 2: Using Docker CLI

1. **Build the image**:
   ```bash
   docker build -t phishguard-ai:latest .
   ```

2. **Run the container**:
   ```bash
   docker run -d \
     --name phishguard-ai \
     -p 3000:3000 \
     -e GEMINI_API_KEY=your_actual_api_key_here \
     -e APP_URL=http://localhost:3000 \
     phishguard-ai:latest
   ```

3. **View logs**:
   ```bash
   docker logs -f phishguard-ai
   ```

4. **Stop the container**:
   ```bash
   docker stop phishguard-ai
   docker rm phishguard-ai
   ```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `GEMINI_API_KEY` | Google Gemini API key for AI analysis | Yes | - |
| `APP_URL` | Public URL where the app is hosted | No | http://localhost:3000 |
| `NODE_ENV` | Node environment (production/development) | No | production |

## Production Deployment

### Building for Production

```bash
docker build -t phishguard-ai:v1.0.0 .
```

### Pushing to a Registry

```bash
# Tag for your registry
docker tag phishguard-ai:v1.0.0 your-registry.com/phishguard-ai:v1.0.0

# Push to registry
docker push your-registry.com/phishguard-ai:v1.0.0
```

### Running in Production

```bash
docker run -d \
  --name phishguard-ai \
  --restart unless-stopped \
  -p 3000:3000 \
  -e GEMINI_API_KEY=${GEMINI_API_KEY} \
  -e APP_URL=https://your-domain.com \
  your-registry.com/phishguard-ai:v1.0.0
```

## Health Checks

The container includes a built-in health check that verifies the API is responding:

```bash
# Check container health status
docker inspect --format='{{.State.Health.Status}}' phishguard-ai
```

## Troubleshooting

### Container won't start
```bash
# Check logs for errors
docker logs phishguard-ai

# Verify environment variables
docker inspect phishguard-ai | grep -A 10 Env
```

### Port already in use
```bash
# Use a different port
docker run -p 8080:3000 ...
```

### Build fails
```bash
# Clean build with no cache
docker build --no-cache -t phishguard-ai:latest .
```

## Multi-Stage Build Details

The Dockerfile uses a multi-stage build for optimization:

1. **Builder Stage**: Installs all dependencies and builds the application
2. **Production Stage**: Only includes production dependencies and built artifacts

This results in a smaller, more secure production image (~200MB vs ~800MB).

## Security Considerations

- Never commit `.env` files with real API keys
- Use Docker secrets or environment variable injection in production
- The container runs as the default Node user (non-root)
- Only necessary files are copied to the final image

## Performance Tuning

### Resource Limits

```bash
docker run -d \
  --name phishguard-ai \
  --memory="512m" \
  --cpus="1.0" \
  -p 3000:3000 \
  phishguard-ai:latest
```

### Docker Compose with Limits

```yaml
services:
  phishguard-ai:
    # ... other config
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

## Development with Docker

For development with hot-reload, mount your source code:

```bash
docker run -d \
  --name phishguard-ai-dev \
  -p 3000:3000 \
  -v $(pwd):/app \
  -v /app/node_modules \
  -e NODE_ENV=development \
  node:20-alpine \
  sh -c "cd /app && npm install && npm run dev"
```
