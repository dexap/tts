#!/bin/bash

# Sesame TTS - Kubernetes Deployment Script
set -e

echo "🚀 Deploying Sesame TTS to Kubernetes..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}❌ kubectl is not installed or not in PATH${NC}"
    exit 1
fi

# Check if cluster is accessible
if ! kubectl cluster-info &> /dev/null; then
    echo -e "${RED}❌ Cannot connect to Kubernetes cluster${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Kubernetes cluster is accessible${NC}"

# Apply Kubernetes manifests in order
echo -e "${YELLOW}📝 Creating namespace and config...${NC}"
kubectl apply -f k8s/01-namespace-and-config.yaml

echo -e "${YELLOW}💾 Setting up storage...${NC}"
kubectl apply -f k8s/02-storage.yaml

echo -e "${YELLOW}🐍 Deploying TTS Backend...${NC}"
kubectl apply -f k8s/03-tts-backend.yaml

echo -e "${YELLOW}🌐 Deploying Frontend...${NC}"
kubectl apply -f k8s/04-frontend.yaml

echo -e "${YELLOW}📈 Setting up autoscaling...${NC}"
kubectl apply -f k8s/05-autoscaling.yaml

# Wait for deployments to be ready
echo -e "${YELLOW}⏳ Waiting for deployments to be ready...${NC}"
kubectl wait --for=condition=available --timeout=300s deployment/tts-backend -n sesame-tts
kubectl wait --for=condition=available --timeout=300s deployment/frontend -n sesame-tts

# Get service information
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "${YELLOW}📋 Service information:${NC}"
kubectl get services -n sesame-tts

echo -e "${YELLOW}🔍 Pod status:${NC}"
kubectl get pods -n sesame-tts

# Get frontend URL
FRONTEND_URL=$(kubectl get service frontend-service -n sesame-tts -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
if [ -z "$FRONTEND_URL" ]; then
    FRONTEND_URL="<pending>"
fi

echo -e "${GREEN}🎉 Sesame TTS is now running!${NC}"
echo "Frontend URL: http://${FRONTEND_URL}"
echo ""
echo "Useful commands:"
echo "  Monitor pods: kubectl get pods -n sesame-tts -w"
echo "  View logs: kubectl logs -f deployment/tts-backend -n sesame-tts"
echo "  Scale frontend: kubectl scale deployment frontend --replicas=3 -n sesame-tts"
