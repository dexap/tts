#!/usr/bin/env python3
"""
Sesame TTS Backend Server
A Flask-based API server for text-to-speech generation
"""

import os
import json
import time
import uuid
from datetime import datetime
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Configuration
AUDIO_DIR = os.environ.get('AUDIO_DIR', '/app/audio_files')
MODEL_DIR = os.environ.get('TTS_MODEL_DIR', '/app/models')
HOST = os.environ.get('HOST', '0.0.0.0')
PORT = int(os.environ.get('PORT', '8000'))

# Create directories if they don't exist
os.makedirs(AUDIO_DIR, exist_ok=True)
os.makedirs(MODEL_DIR, exist_ok=True)

# Available models (mock for now)
AVAILABLE_MODELS = {
    'sesame/csm-1b': 'Sesame CSM-1B (Default)',
    'tts_models/en/ljspeech/tacotron2-DDC': 'Tacotron2 DDC',
    'tts_models/en/ljspeech/glow-tts': 'Glow-TTS',
}

# Current loaded model
current_model = 'sesame/csm-1b'
loaded_models = ['sesame/csm-1b']

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'model': current_model
    })

@app.route('/api/tts/models', methods=['GET'])
def get_models():
    """Get available and loaded models"""
    return jsonify({
        'success': True,
        'models': {
            'available_models': AVAILABLE_MODELS,
            'loaded_models': loaded_models,
            'current_model': current_model
        }
    })

@app.route('/api/tts/models', methods=['POST'])
def manage_models():
    """Load or switch TTS models"""
    data = request.get_json()
    action = data.get('action')
    model_id = data.get('modelId')
    
    global current_model, loaded_models
    
    if model_id not in AVAILABLE_MODELS:
        return jsonify({
            'success': False,
            'error': f'Model {model_id} not available'
        }), 400
    
    if action == 'load':
        # Simulate model loading
        logger.info(f"Loading model: {model_id}")
        time.sleep(2)  # Simulate loading time
        if model_id not in loaded_models:
            loaded_models.append(model_id)
        current_model = model_id
        
    elif action == 'switch':
        if model_id not in loaded_models:
            return jsonify({
                'success': False,
                'error': f'Model {model_id} not loaded'
            }), 400
        current_model = model_id
        
    return jsonify({
        'success': True,
        'current_model': current_model,
        'loaded_models': loaded_models
    })

@app.route('/api/tts/generate', methods=['POST'])
def generate_speech():
    """Generate speech from text"""
    try:
        data = request.get_json()
        text = data.get('text', '').strip()
        voice_role = data.get('voiceRole', '0')
        speech_rate = data.get('speechRate', 1.0)
        model_id = data.get('modelId', current_model)
        
        # Advanced parameters
        temperature = data.get('temperature', 1.0)
        top_p = data.get('topP', 0.9)
        top_k = data.get('topK', 50)
        repetition_penalty = data.get('repetitionPenalty', 1.0)
        random_seed = data.get('randomSeed')
        
        if not text:
            return jsonify({
                'success': False,
                'error': 'Text is required'
            }), 400
            
        if len(text) > 500:
            return jsonify({
                'success': False,
                'error': 'Text must be 500 characters or less'
            }), 400
        
        logger.info(f"Generating speech for: {text[:50]}...")
        logger.info(f"Using model: {model_id}, voice: {voice_role}, rate: {speech_rate}")
        
        # Simulate TTS generation
        time.sleep(3)  # Simulate processing time
        
        # Create audio file entry
        audio_id = str(uuid.uuid4())
        timestamp = int(time.time() * 1000)
        
        # Generate mock audio file (in real implementation, this would be actual TTS)
        audio_filename = f"tts_{audio_id}.wav"
        audio_path = os.path.join(AUDIO_DIR, audio_filename)
        
        # Create a simple mock audio file (silent WAV)
        create_mock_audio_file(audio_path, duration=len(text) * 0.1)
        
        # Create audio file metadata
        audio_file = {
            'id': audio_id,
            'title': get_title(text),
            'fullText': text,
            'audioUrl': f'/api/tts/audio/{audio_filename}',
            'timestamp': timestamp,
            'date': datetime.fromtimestamp(timestamp / 1000),
            'voiceRole': voice_role,
            'speechRate': speech_rate,
            'modelId': model_id,
            'duration': estimate_duration(text),
            'fileSize': estimate_file_size(text),
            'parameters': {
                'temperature': temperature,
                'topP': top_p,
                'topK': top_k,
                'repetitionPenalty': repetition_penalty,
                'randomSeed': random_seed
            }
        }
        
        # Save metadata
        metadata_path = os.path.join(AUDIO_DIR, f"{audio_id}.json")
        with open(metadata_path, 'w') as f:
            json.dump(audio_file, f, default=str)
        
        logger.info(f"Generated audio file: {audio_filename}")
        
        return jsonify({
            'success': True,
            'audioFile': audio_file
        })
        
    except Exception as e:
        logger.error(f"Error generating speech: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@app.route('/api/tts/files', methods=['GET'])
def get_audio_files():
    """Get list of generated audio files"""
    try:
        audio_files = []
        
        # Read all metadata files
        for filename in os.listdir(AUDIO_DIR):
            if filename.endswith('.json'):
                metadata_path = os.path.join(AUDIO_DIR, filename)
                try:
                    with open(metadata_path, 'r') as f:
                        audio_file = json.load(f)
                        audio_files.append(audio_file)
                except Exception as e:
                    logger.warning(f"Error reading metadata {filename}: {e}")
        
        # Sort by timestamp (newest first)
        audio_files.sort(key=lambda x: x.get('timestamp', 0), reverse=True)
        
        return jsonify({
            'success': True,
            'audioFiles': audio_files
        })
        
    except Exception as e:
        logger.error(f"Error getting audio files: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@app.route('/api/tts/files/<file_id>', methods=['DELETE'])
def delete_audio_file(file_id):
    """Delete an audio file"""
    try:
        # Delete audio file
        audio_files = [f for f in os.listdir(AUDIO_DIR) if f.startswith(file_id)]
        for filename in audio_files:
            file_path = os.path.join(AUDIO_DIR, filename)
            if os.path.exists(file_path):
                os.remove(file_path)
                logger.info(f"Deleted file: {filename}")
        
        return jsonify({
            'success': True,
            'message': 'File deleted successfully'
        })
        
    except Exception as e:
        logger.error(f"Error deleting file {file_id}: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@app.route('/api/tts/audio/<filename>', methods=['GET'])
def serve_audio(filename):
    """Serve audio files"""
    try:
        audio_path = os.path.join(AUDIO_DIR, filename)
        if os.path.exists(audio_path):
            return send_file(audio_path, mimetype='audio/wav')
        else:
            return jsonify({
                'success': False,
                'error': 'File not found'
            }), 404
            
    except Exception as e:
        logger.error(f"Error serving audio {filename}: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

def create_mock_audio_file(path, duration=2.0):
    """Create a mock audio file (silent WAV)"""
    import struct
    
    sample_rate = 44100
    samples = int(duration * sample_rate)
    
    # Create WAV header
    wav_header = struct.pack('<4sI4s4sIHHIIHH4sI',
        b'RIFF', 36 + samples * 2, b'WAVE',
        b'fmt ', 16, 1, 1, sample_rate, sample_rate * 2, 2, 16,
        b'data', samples * 2
    )
    
    # Create silent audio data
    audio_data = b'\x00\x00' * samples
    
    with open(path, 'wb') as f:
        f.write(wav_header)
        f.write(audio_data)

def get_title(text):
    """Get title from text (first 3 words)"""
    words = text.strip().split()[:3]
    title = ' '.join(words)
    if len(text.split()) > 3:
        title += '...'
    return title

def estimate_duration(text):
    """Estimate audio duration"""
    words = len(text.split())
    minutes = words / 150  # 150 words per minute
    seconds = int(minutes * 60)
    
    if seconds < 60:
        return f"{seconds}s"
    else:
        mins = seconds // 60
        secs = seconds % 60
        return f"{mins}m {secs}s"

def estimate_file_size(text):
    """Estimate file size"""
    words = len(text.split())
    estimated_seconds = (words / 150) * 60
    size_kb = int(estimated_seconds * 24)
    
    if size_kb < 1024:
        return f"{size_kb} KB"
    else:
        return f"{size_kb / 1024:.1f} MB"

if __name__ == '__main__':
    logger.info(f"Starting Sesame TTS Backend on {HOST}:{PORT}")
    logger.info(f"Audio directory: {AUDIO_DIR}")
    logger.info(f"Model directory: {MODEL_DIR}")
    logger.info(f"Current model: {current_model}")
    
    app.run(host=HOST, port=PORT, debug=False)
