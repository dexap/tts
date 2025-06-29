import { defineEndpoint } from 'bknd';

export default defineEndpoint({
  method: 'GET',
  path: '/api/tts/files',
  handler: async (req, { database }) => {
    try {
      const { page = 1, limit = 50, sortBy = 'created_at', sortOrder = 'desc' } = req.query;
      
      // Validate sort parameters
      const validSortFields = ['created_at', 'title', 'duration'];
      const validSortOrders = ['asc', 'desc'];
      
      const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
      const order = validSortOrders.includes(sortOrder) ? sortOrder : 'desc';
      
      // Calculate offset
      const offset = (parseInt(page) - 1) * parseInt(limit);
      
      // Get audio files from database
      const audioFiles = await database.select('tts_audio_files', {
        orderBy: `${sortField} ${order.toUpperCase()}`,
        limit: parseInt(limit),
        offset: offset
      });
      
      // Get total count
      const total = await database.count('tts_audio_files');
      
      // Format the response
      const formattedFiles = audioFiles.map(file => ({
        ...file,
        createdAt: formatDate(new Date(file.created_at)),
        timestamp: new Date(file.created_at).getTime()
      }));
      
      return {
        status: 200,
        body: {
          success: true,
          audioFiles: formattedFiles,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: total,
            totalPages: Math.ceil(total / parseInt(limit))
          }
        }
      };
      
    } catch (error) {
      console.error('Error fetching audio files:', error);
      return {
        status: 500,
        body: { error: 'Failed to fetch audio files' }
      };
    }
  }
});

function formatDate(date) {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
