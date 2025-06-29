# 🎭 Sesame AI Text-to-Speech Studio

An advanced text-to-speech web application built with the Freedom Stack v2, featuring the Sesame CSM Elise LoRA voice model for natural speech generation.

## ✨ Features

### 🎤 **Advanced TTS Generation**

- **Sesame AI Integration** - High-quality speech synthesis using the Elise voice model
- **Multiple Voice Roles** - Neutral, Conversational, and Expressive modes
- **Speech Rate Control** - Adjustable playback speed from 0.5x to 2x
- **Real-time Preview** - Instant audio generation and playback

### 🎵 **Audio Management**

- **Local Storage** - Audio files stored securely on the server
- **Smart Grid View** - Beautiful card-based layout with file previews
- **Advanced Sorting** - Sort by date, title, or duration
- **File Operations** - Download, share, delete, and reuse text
- **European Date Format** - DD/MM/YYYY HH:MM display

### 🎨 **Beautiful UI/UX**

- **Basecoat UI Components** - Professional shadcn/ui-style components
- **Responsive Design** - Works perfectly on mobile and desktop
- **Real-time Updates** - Live file counts and status indicators
- **Toast Notifications** - User-friendly feedback system

### 🚀 **Modern Tech Stack**

- **Astro** - Ultra-fast static site generation
- **Alpine.js** - Lightweight reactive functionality
- **TailwindCSS v4** - Modern utility-first styling
- **Basecoat UI** - Pre-built UI components
- **Bknd Backend** - Powerful backend-as-a-service

## 🎯 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Application

```bash
# Quick start - just the frontend
npm run dev

# For full-stack with backend (optional):
npm run dev:full

# Or start them separately:
npm run backend  # Start Bknd backend (optional)
npm run dev      # Start Astro frontend
```

### 3. Open the Application

- **Main App**: http://localhost:4321 (or 4322 if port is busy)
- **TTS Studio**: http://localhost:4321/tts
- **Backend API**: http://localhost:3000/api (if running backend)

## 🎭 Using the TTS Studio

### **Text Input**

1. Navigate to `/tts` or click "TTS Studio" in the navigation
2. Enter your text (up to 500 characters)
3. Select voice role (Neutral, Conversational, Expressive)
4. Adjust speech rate if desired
5. Click "Generate Speech"

### **Voice Roles**

- **Neutral (Default)** - Clear, professional voice
- **Conversational** - Friendly, warm tone
- **Expressive** - Dynamic, emotional delivery

### **Quick Presets**

Try these pre-configured text samples:

- **Welcome Message** - Greeting and introduction
- **Product Demo** - Technology showcase text
- **Storytelling** - Creative narrative sample
- **News Reading** - Professional news format

### **Audio File Management**

- **Play** - Click the audio player to listen
- **Download** - Save WAV files locally
- **Share** - Copy shareable links
- **Reuse Text** - Copy text back to input
- **Delete** - Remove unwanted files
- **Sort** - Organize by date or title

## 🔧 Technical Architecture

### **Frontend (Astro + Alpine.js)**

```
src/pages/
├── index.astro          # Landing page
├── tts.astro           # TTS application
└── styles/
    └── global.css      # TailwindCSS + Basecoat UI
```

### **Backend (Bknd)**

```
api/
├── tts-generate.js     # TTS generation endpoint
├── tts-files.js       # File listing endpoint
└── tts-delete.js      # File deletion endpoint

bknd.config.js         # Bknd configuration
```

### **API Endpoints**

#### `POST /api/tts/generate`

Generate speech from text

```json
{
  "text": "Hello world",
  "voiceRole": "0",
  "speechRate": 1.0
}
```

#### `GET /api/tts/files`

List generated audio files

```json
{
  "success": true,
  "audioFiles": [...],
  "pagination": {...}
}
```

#### `DELETE /api/tts/files/:id`

Delete an audio file

```json
{
  "success": true,
  "message": "Audio file deleted successfully"
}
```

## 🎵 Sesame AI Integration

The application uses the **Sesame CSM Elise LoRA** model from Hugging Face:

- **Model**: `keanteng/sesame-csm-elise-lora`
- **Base Model**: `sesame/csm-1b`
- **Training Data**: MrDragonFox/Elise dataset
- **Approach**: Voice cloning through conditional speech generation using LoRA

### **Voice Characteristics**

- **High Quality** - Natural, human-like speech
- **Emotional Range** - Soft and vibrant voice qualities
- **Multilingual** - English language support
- **Fast Generation** - Optimized for real-time usage

## 📁 File Structure

```
sesame-web/
├── api/                    # Bknd API endpoints
│   ├── tts-generate.js
│   ├── tts-files.js
│   └── tts-delete.js
├── src/
│   ├── pages/
│   │   ├── index.astro     # Landing page
│   │   └── tts.astro       # TTS application
│   └── styles/
│       └── global.css      # Global styles
├── storage/                # Audio file storage (created at runtime)
├── bknd.config.js         # Backend configuration
├── tailwind.config.js     # TailwindCSS configuration
├── astro.config.mjs       # Astro configuration
└── package.json
```

## 🔧 Configuration

### **Bknd Backend**

Configure in `bknd.config.js`:

- Database: SQLite with automatic schema creation
- Storage: Local file system
- API: CORS enabled for frontend integration
- Tables: `tts_audio_files` with full CRUD permissions

### **TailwindCSS + Basecoat UI**

- TailwindCSS v4 via Vite plugin
- Basecoat UI for professional components
- Custom theme variables for consistent styling
- Responsive design utilities

### **Alpine.js Data Management**

- Reactive state management
- Local storage fallback
- Real-time UI updates
- Error handling and notifications

## 🚀 Deployment

### **Development**

```bash
npm run dev        # Start frontend only
npm run dev:full   # Start frontend + backend (optional)
```

### **Production Build**

```bash
npm run build
npm run preview
```

### **Hosting Options**

- **Vercel** - Full-stack deployment with API routes
- **Netlify** - Static frontend + Netlify Functions
- **Railway** - Docker-based deployment
- **Self-hosted** - Node.js server with file storage

## 📊 Performance

### **Optimizations**

- **Static Generation** - Pre-built pages for fast loading
- **Component Islands** - Minimal JavaScript bundles
- **Image Optimization** - Automatic image processing
- **File Caching** - Efficient audio file storage
- **API Efficiency** - Optimized database queries

### **Audio Quality**

- **Format**: WAV (uncompressed)
- **Sample Rate**: 44.1kHz
- **Bit Depth**: 16-bit
- **File Size**: ~24KB per second of audio

## 🔒 Security

### **Data Protection**

- **Local Storage** - Files stored on server filesystem
- **Input Validation** - Text length and content validation
- **CORS Protection** - Configured for frontend domain
- **Rate Limiting** - Prevent API abuse (configurable)

### **File Management**

- **Unique IDs** - Prevent filename conflicts
- **Storage Isolation** - Organized file structure
- **Cleanup Options** - Manual and automated cleanup
- **Access Control** - API-based file access

## 🤝 Contributing

1. **Fork the Repository**
2. **Create Feature Branch** - `git checkout -b feature/amazing-feature`
3. **Commit Changes** - `git commit -m 'Add amazing feature'`
4. **Push to Branch** - `git push origin feature/amazing-feature`
5. **Open Pull Request**

## 📝 License

This project is built with the Freedom Stack v2 and follows open-source principles. See individual component licenses for details.

## 🔗 Links

- **Sesame AI Model**: https://huggingface.co/keanteng/sesame-csm-elise-lora
- **Freedom Stack v2**: https://github.com/cameronapak/freedom-stack-v2
- **Basecoat UI**: https://basecoatui.com
- **Bknd Documentation**: https://docs.bknd.io
- **Astro Documentation**: https://docs.astro.build

---

**🎭 Start creating amazing speech content with Sesame AI TTS Studio!**
