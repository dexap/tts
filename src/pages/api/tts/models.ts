import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    // Get model information from TTS server
    const response = await fetch('http://localhost:5001/models', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ 
        error: 'Failed to fetch models from TTS service' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const modelsData = await response.json();
    
    return new Response(JSON.stringify({
      success: true,
      models: modelsData
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching models:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to connect to TTS service' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request, params }) => {
  try {
    const { action, modelId } = await request.json();
    
    if (!action || !modelId) {
      return new Response(JSON.stringify({ 
        error: 'Action and modelId are required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const endpoint = action === 'load' 
      ? `http://localhost:5001/models/${modelId}/load`
      : `http://localhost:5001/models/${modelId}/switch`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return new Response(JSON.stringify({ 
        error: errorData.error || `Failed to ${action} model` 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await response.json();
    
    return new Response(JSON.stringify({
      success: true,
      ...result
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error(`Error managing models:`, error);
    return new Response(JSON.stringify({ 
      error: 'Failed to connect to TTS service' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
