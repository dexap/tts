#!/bin/bash

# Sesame TTS - Kubernetes Cleanup Script
set -e

echo "🧹 Cleaning up Sesame TTS from Kubernetes..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Delete all resources
echo -e "${YELLOW}🗑️ Deleting all Sesame TTS resources...${NC}"

kubectl delete -f k8s/05-autoscaling.yaml --ignore-not-found=true
kubectl delete -f k8s/04-frontend.yaml --ignore-not-found=true
kubectl delete -f k8s/03-tts-backend.yaml --ignore-not-found=true
kubectl delete -f k8s/02-storage.yaml --ignore-not-found=true
kubectl delete -f k8s/01-namespace-and-config.yaml --ignore-not-found=true

echo -e "${GREEN}✅ Cleanup complete!${NC}"
echo "Note: Persistent volumes may still exist to preserve data."
