import type { APIRoute } from 'astro';

export const prerender = false;

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'File ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Here you would delete from the database
    // For now, just return success
    
    return new Response(JSON.stringify({
      success: true,
      message: 'File deleted successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to delete file'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
