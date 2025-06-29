# 🚀 Sesame TTS - Containerization & Kubernetes Guide

This guide walks you through containerizing the Sesame TTS application and deploying it to a Kubernetes cluster.

## 📋 Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   TTS Backend   │
│   (Astro/Nginx) │────│   (Python/Flask)│
│   Port: 80      │    │   Port: 8000    │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────────────────────┘
                    │
            ┌─────────────────┐
            │   Kubernetes    │
            │     Cluster     │
            └─────────────────┘
```

## 🏗️ Components

### Container 1: TTS Backend
- **Base**: Python 3.11 slim
- **Framework**: Flask
- **Models**: TTS models (Tacotron2, etc.)
- **Storage**: Persistent volumes for models and audio files
- **Resources**: 2-4GB RAM, 1-2 CPU cores

### Container 2: Frontend
- **Base**: Node.js 18 (build) + Nginx Alpine (runtime)
- **Framework**: Astro with Alpine.js
- **Proxy**: Nginx proxy to TTS backend
- **Resources**: 128-256MB RAM, 0.1-0.5 CPU cores

## 🚀 Quick Start

### Prerequisites

1. **Docker** installed and running
2. **Kubernetes cluster** (Docker Desktop, Minikube, or cloud provider)
3. **kubectl** configured for your cluster
4. **AI-TTS workspace** available at `../ai-tts/`

### Step 1: Build Docker Images

```bash
# Build both containers
./scripts/build.sh
```

### Step 2: Option A - Docker Compose (Development)

```bash
# Start with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Step 3: Option B - Kubernetes (Production)

```bash
# Deploy to Kubernetes
./scripts/k8s-deploy.sh

# Monitor deployment
kubectl get pods -n sesame-tts -w

# Get frontend URL
kubectl get service frontend-service -n sesame-tts
```

## 📂 Project Structure

```
sesame-web/
├── docker/
│   ├── tts-backend/
│   │   └── Dockerfile          # Python TTS container
│   └── frontend/
│       ├── Dockerfile          # Astro frontend container
│       └── nginx.conf          # Nginx configuration
├── k8s/
│   ├── 01-namespace-and-config.yaml
│   ├── 02-storage.yaml
│   ├── 03-tts-backend.yaml
│   ├── 04-frontend.yaml
│   └── 05-autoscaling.yaml
├── scripts/
│   ├── build.sh               # Build Docker images
│   ├── k8s-deploy.sh          # Deploy to Kubernetes
│   └── k8s-cleanup.sh         # Clean up resources
└── docker-compose.yml         # Local development
```

## ⚙️ Configuration

### Environment Variables

#### TTS Backend
- `PYTHONPATH=/app`
- `TTS_MODEL_DIR=/app/models`
- `FLASK_ENV=production`

#### Frontend
- API proxy configured in Nginx to route `/api/tts/` to backend

### Resource Allocation

#### TTS Backend
- **Requests**: 2GB RAM, 1 CPU
- **Limits**: 4GB RAM, 2 CPUs
- **Replicas**: 1-3 (limited by model loading)

#### Frontend
- **Requests**: 128MB RAM, 0.1 CPU
- **Limits**: 256MB RAM, 0.5 CPU
- **Replicas**: 2-10 (auto-scaling enabled)

## 🔧 Development Workflow

### Local Development
```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f tts-backend
docker-compose logs -f frontend

# Rebuild after changes
docker-compose build
docker-compose up -d
```

### Kubernetes Development
```bash
# Apply changes
kubectl apply -f k8s/

# Check pod status
kubectl get pods -n sesame-tts

# View logs
kubectl logs -f deployment/tts-backend -n sesame-tts
kubectl logs -f deployment/frontend -n sesame-tts

# Port forward for testing
kubectl port-forward service/frontend-service 8080:80 -n sesame-tts
```

## 📊 Monitoring & Scaling

### Auto-scaling
- **Frontend**: 2-10 replicas based on CPU (70%) and Memory (80%)
- **TTS Backend**: 1-3 replicas based on CPU (80%) and Memory (85%)

### Health Checks
- **Backend**: `GET /health` endpoint
- **Frontend**: Nginx root path check

### Useful Commands
```bash
# Scale manually
kubectl scale deployment frontend --replicas=5 -n sesame-tts

# View metrics
kubectl top pods -n sesame-tts

# Describe resources
kubectl describe deployment tts-backend -n sesame-tts

# Get events
kubectl get events -n sesame-tts --sort-by='.lastTimestamp'
```

## 🗄️ Storage

### Persistent Volumes
- **Models Volume**: 10GB for TTS models (`/app/models`)
- **Audio Volume**: 5GB for generated audio files (`/app/audio_files`)

### Data Persistence
- Models and audio files persist across pod restarts
- Backup recommendations: Regular snapshots of PVs

## 🌐 Networking

### Services
- **tts-backend-service**: ClusterIP on port 8000
- **frontend-service**: LoadBalancer on port 80

### Ingress
- Configured for `sesame-tts.local` (update with your domain)
- SSL termination available (add TLS config)

## 🔒 Security Considerations

### Container Security
- Non-root user in containers
- Read-only root filesystem where possible
- Security headers in Nginx

### Network Security
- Internal cluster communication only
- CORS configured for API access
- Ingress with proper SSL/TLS

## 🚨 Troubleshooting

### Common Issues

#### Backend Won't Start
```bash
# Check logs
kubectl logs deployment/tts-backend -n sesame-tts

# Common causes:
# - Missing models in persistent volume
# - Insufficient memory allocation
# - Python dependencies missing
```

#### Frontend Can't Reach Backend
```bash
# Check service connectivity
kubectl exec -it deployment/frontend -- nslookup tts-backend-service

# Check nginx config
kubectl exec -it deployment/frontend -- cat /etc/nginx/nginx.conf
```

#### Storage Issues
```bash
# Check PV/PVC status
kubectl get pv,pvc -n sesame-tts

# Check mount points
kubectl exec -it deployment/tts-backend -- df -h
```

### Cleanup
```bash
# Remove all resources
./scripts/k8s-cleanup.sh

# Or manually
kubectl delete namespace sesame-tts
```

## 🎯 Next Steps

1. **CI/CD Pipeline**: Set up GitHub Actions for automated builds
2. **Monitoring**: Add Prometheus/Grafana for metrics
3. **Logging**: Centralized logging with ELK stack
4. **SSL/TLS**: Configure proper certificates
5. **Backup**: Automated backup strategy for persistent data

## 📞 Support

For issues and questions:
- Check logs: `kubectl logs -f deployment/<name> -n sesame-tts`
- Describe resources: `kubectl describe pod <pod-name> -n sesame-tts`
- View events: `kubectl get events -n sesame-tts`
