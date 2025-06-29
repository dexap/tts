import { defineEndpoint } from 'bknd';

export default defineEndpoint({
  method: 'DELETE',
  path: '/api/tts/files/:id',
  handler: async (req, { database, storage }) => {
    try {
      const { id } = req.params;
      
      if (!id) {
        return {
          status: 400,
          body: { error: 'File ID is required' }
        };
      }
      
      // Get the file record first to get the file path
      const audioFile = await database.findOne('tts_audio_files', { id });
      
      if (!audioFile) {
        return {
          status: 404,
          body: { error: 'Audio file not found' }
        };
      }
      
      // Delete the file from storage
      try {
        await storage.delete(audioFile.file_path);
      } catch (storageError) {
        console.warn('Failed to delete file from storage:', storageError);
        // Continue with database deletion even if storage deletion fails
      }
      
      // Delete the record from database
      await database.delete('tts_audio_files', { id });
      
      return {
        status: 200,
        body: { 
          success: true, 
          message: 'Audio file deleted successfully'
        }
      };
      
    } catch (error) {
      console.error('Error deleting audio file:', error);
      return {
        status: 500,
        body: { error: 'Failed to delete audio file' }
      };
    }
  }
});
