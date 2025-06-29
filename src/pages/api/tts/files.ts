import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    // Fetch files from the TTS server
    const ttsResponse = await fetch('http://localhost:5001/files');
    
    if (!ttsResponse.ok) {
      throw new Error('Failed to fetch from TTS server');
    }
    
    const ttsData = await ttsResponse.json();
    
    // Transform TTS server data to frontend format
    const audioFiles = ttsData.files.map((file: any) => ({
      id: file.filename.replace('.wav', '').split('_').pop(), // Extract ID from filename
      title: `Audio ${file.filename.substring(4, 19)}`, // Extract timestamp part for title
      fullText: `Generated audio file`, // We don't have the original text, so use placeholder
      audioUrl: `http://localhost:5001${file.url}`, // Full URL to audio file
      voiceRole: '0', // Default voice role
      speechRate: 1, // Default speech rate
      duration: Math.round(file.size / 16000) + 's', // Rough duration estimate based on file size
      size: Math.round(file.size / 1024) + ' KB', // Convert bytes to KB
      createdAt: new Date(file.created).toLocaleString('en-GB', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      timestamp: new Date(file.created).getTime()
    }));

    return new Response(JSON.stringify({
      success: true,
      audioFiles: audioFiles
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching audio files:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Failed to fetch audio files',
      audioFiles: []
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
