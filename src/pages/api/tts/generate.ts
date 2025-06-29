import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { 
      text, 
      voiceRole = '0', 
      speechRate = 1.0,
      modelId = 'sesame/csm-1b',
      temperature = 1.0,
      topP = 0.9,
      topK = 50,
      repetitionPenalty = 1.0,
      randomSeed = null
    } = await request.json();
    
    if (!text || text.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Text is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (text.length > 500) {
      return new Response(JSON.stringify({ error: 'Text must be 500 characters or less' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Validate advanced parameters
    if (temperature < 0.1 || temperature > 2.0) {
      return new Response(JSON.stringify({ error: 'Temperature must be between 0.1 and 2.0' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (topP < 0.1 || topP > 1.0) {
      return new Response(JSON.stringify({ error: 'Top P must be between 0.1 and 1.0' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (topK < 1 || topK > 100) {
      return new Response(JSON.stringify({ error: 'Top K must be between 1 and 100' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (repetitionPenalty < 0.1 || repetitionPenalty > 2.0) {
      return new Response(JSON.stringify({ error: 'Repetition penalty must be between 0.1 and 2.0' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Call the local Sesame TTS server
    try {
      const ttsResponse = await fetch('http://localhost:5001/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          role: voiceRole,
          model_id: modelId,
          temperature: temperature,
          top_p: topP,
          top_k: topK,
          repetition_penalty: repetitionPenalty,
          random_seed: randomSeed
        })
      });

      if (!ttsResponse.ok) {
        const errorData = await ttsResponse.json();
        return new Response(JSON.stringify({ 
          error: errorData.error || 'TTS service error' 
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const ttsResult = await ttsResponse.json();
      
      if (!ttsResult.success || !ttsResult.audio) {
        return new Response(JSON.stringify({ 
          error: 'Invalid response from TTS service' 
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Create audio file data for frontend
      const audioFile = {
        id: ttsResult.audio.id,
        title: getTitle(text),
        fullText: text,
        audioUrl: `http://localhost:5001/audio/${ttsResult.audio.filename}`,
        voiceRole: voiceRole,
        speechRate: parseFloat(speechRate),
        duration: estimateDuration(text),
        size: estimateFileSize(text),
        createdAt: formatDate(new Date()),
        timestamp: Date.now()
      };

      return new Response(JSON.stringify({
        success: true,
        audioFile: audioFile,
        message: 'Speech generated successfully'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (fetchError: any) {
      console.error('TTS Server connection error:', fetchError);
      return new Response(JSON.stringify({ 
        error: 'TTS service unavailable. Please make sure the TTS server is running on localhost:5001.',
        details: fetchError?.message || 'Connection failed'
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
  } catch (error: any) {
    console.error('TTS Generation Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate speech',
      details: error?.message || 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Helper functions
function generateMockAudioDataUrl() {
  // Create a simple tone as mock audio
  const duration = 2; // seconds
  const sampleRate = 44100;
  const frequency = 440; // A4 note
  
  const samples = duration * sampleRate;
  const audioBuffer = new ArrayBuffer(44 + samples * 2);
  const view = new DataView(audioBuffer);
  
  // WAV header
  const writeString = (offset: number, string: string) => {
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
  
  // Generate audio samples
  for (let i = 0; i < samples; i++) {
    const sample = Math.sin(2 * Math.PI * frequency * i / sampleRate) * 0.5;
    view.setInt16(44 + i * 2, sample * 32767, true);
  }
  
  const blob = new Blob([audioBuffer], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
}

function getTitle(text: string) {
  const words = text.trim().split(/\s+/).slice(0, 3);
  return words.join(' ') + (text.trim().split(/\s+/).length > 3 ? '...' : '');
}

function estimateDuration(text: string) {
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

function estimateFileSize(text: string) {
  const words = text.trim().split(/\s+/).length;
  const estimatedSeconds = (words / 150) * 60;
  const sizeKB = Math.round(estimatedSeconds * 24);
  
  if (sizeKB < 1024) {
    return `${sizeKB} KB`;
  } else {
    return `${(sizeKB / 1024).toFixed(1)} MB`;
  }
}

function formatDate(date: Date) {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
