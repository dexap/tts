export default {
  connection: {
    url: "file:data.db"
  },
  data: {
    entities: {
      tts_audio_files: {
        fields: {
          id: { type: 'text', primaryKey: true },
          title: { type: 'text' },
          full_text: { type: 'text' },
          voice_role: { type: 'text' },
          speech_rate: { type: 'number' },
          audio_url: { type: 'text' },
          file_path: { type: 'text' },
          duration: { type: 'text' },
          file_size: { type: 'text' },
          created_at: { type: 'text' },
          user_id: { type: 'text' }
        }
      }
    }
  },
  media: {
    storage: {
      type: 'local',
      basePath: './uploads'
    }
  }
};
