#!/bin/bash

# Sesame TTS - Docker Build Script
set -e

echo "🚀 Building Sesame TTS Docker Images..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Build TTS Backend
echo -e "${YELLOW}📦 Building TTS Backend...${NC}"
docker build -f docker/tts-backend/Dockerfile -t sesame/tts-backend:latest .

# Build Frontend
echo -e "${YELLOW}📦 Building Frontend...${NC}"
docker build -f docker/frontend/Dockerfile -t sesame/frontend:latest .

echo -e "${GREEN}✅ All images built successfully!${NC}"

# List built images
echo -e "${YELLOW}📋 Built images:${NC}"
docker images | grep sesame

echo -e "${GREEN}🎉 Ready to deploy! Use:${NC}"
echo "  Docker Compose: docker-compose up -d"
echo "  Kubernetes: ./scripts/k8s-deploy.sh"
