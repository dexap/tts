# TTS Backend Container
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    wget \
    curl \
    git \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install --no-cache-dir \
    torch \
    torchaudio \
    TTS \
    flask \
    flask-cors \
    requests \
    pydub \
    yt-dlp \
    numpy \
    scipy \
    soundfile \
    librosa

# Copy the TTS backend server
COPY tts-backend-server.py /app/server.py

# Create necessary directories
RUN mkdir -p /app/audio_files /app/models /app/speaker /app/ai-tts

# Expose port
EXPOSE 8000

# Environment variables
ENV PYTHONPATH=/app
ENV TTS_MODEL_DIR=/app/models
ENV AUDIO_DIR=/app/audio_files

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Start the TTS server
CMD ["python", "server.py"]
