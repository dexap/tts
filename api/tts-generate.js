import { defineEndpoint } from 'bknd';

export default defineEndpoint({
  method: 'POST',
  path: '/api/tts/generate',
  handler: async (req, { storage, database }) => {
    try {
      const { text, voiceRole = '0', speechRate = 1.0 } = req.body;
      
      if (!text || text.trim().length === 0) {
        return {
          status: 400,
          body: { error: 'Text is required' }
        };
      }
      
      if (text.length > 500) {
        return {
          status: 400,
          body: { error: 'Text must be 500 characters or less' }
        };
      }
      
      // Simulate TTS generation (replace with actual Sesame AI integration)
      const audioData = await generateTTSAudio(text, voiceRole, speechRate);
      
      // Generate unique filename
      const audioId = 'audio_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      const filename = `${audioId}.wav`;
      const filePath = `tts/${filename}`;
      
      // Save audio file to storage
      await storage.put(filePath, audioData, {
        contentType: 'audio/wav'
      });
      
      // Get file URL
      const audioUrl = await storage.getUrl(filePath);
      
      // Create database record
      const audioFile = {
        id: audioId,
        title: getTitle(text),
        full_text: text,
        voice_role: voiceRole,
        speech_rate: parseFloat(speechRate),
        audio_url: audioUrl,
        file_path: filePath,
        duration: estimateDuration(text),
        file_size: estimateFileSize(text),
        created_at: new Date().toISOString()
      };
      
      // Insert into database
      await database.insert('tts_audio_files', audioFile);
      
      return {
        status: 200,
        body: { 
          success: true, 
          audioFile: {
            ...audioFile,
            createdAt: formatDate(new Date(audioFile.created_at))
          }
        }
      };
      
    } catch (error) {
      console.error('TTS generation error:', error);
      return {
        status: 500,
        body: { error: 'Failed to generate audio' }
      };
    }
  }
});

// Simulate TTS generation with Sesame AI
async function generateTTSAudio(text, voiceRole, speechRate) {
  // TODO: Replace with actual Sesame AI integration
  // For now, generate a simple audio file
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
  
  // Generate a simple WAV file with sine wave
  const duration = Math.max(2, text.length * 0.1); // Rough duration estimate
  const sampleRate = 44100;
  const frequency = 440; // A4 note
  
  const samples = Math.floor(duration * sampleRate);
  const audioBuffer = new ArrayBuffer(44 + samples * 2);
  const view = new DataView(audioBuffer);
  
  // WAV header
  const writeString = (offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + samples * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, samples * 2, true);
  
  // Generate audio samples with variation based on voice role
  const baseFreq = voiceRole === '1' ? 350 : voiceRole === '2' ? 500 : 440;
  const rate = speechRate;
  
  for (let i = 0; i < samples; i++) {
    const t = i / sampleRate * rate;
    const sample = Math.sin(2 * Math.PI * baseFreq * t) * 0.3 * Math.exp(-t * 0.5);
    view.setInt16(44 + i * 2, sample * 32767, true);
  }
  
  return new Uint8Array(audioBuffer);
}

function getTitle(text) {
  const words = text.trim().split(/\s+/).slice(0, 3);
  return words.join(' ') + (text.trim().split(/\s+/).length > 3 ? '...' : '');
}

function estimateDuration(text) {
  const words = text.trim().split(/\s+/).length;
  const minutes = words / 150;
  const seconds = Math.round(minutes * 60);
  
  if (seconds < 60) {
    return `${seconds}s`;
  } else {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  }
}

function estimateFileSize(text) {
  const words = text.trim().split(/\s+/).length;
  const estimatedSeconds = (words / 150) * 60;
  const sizeKB = Math.round(estimatedSeconds * 24);
  
  if (sizeKB < 1024) {
    return `${sizeKB} KB`;
  } else {
    return `${(sizeKB / 1024).toFixed(1)} MB`;
  }
}

function formatDate(date) {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
