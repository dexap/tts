# Sesame AI TTS with Fine-Tuned Model Support

## Overview

Successfully enhanced the Sesame AI TTS web application with model selection and advanced parameter controls.

## Features Added

### 1. Fine-Tuned Model Support

- **Added Model**: `senstella/csm-expressiva-1b` - A fine-tuned version of CSM-1B for faster, more expressive speech
- **Base Model**: `sesame/csm-1b` - Original Sesame CSM model
- **Smart Loading**: Automatically loads base model processor with fine-tuned weights
- **Automatic Role Selection**: Uses speaker role "4" for fine-tuned model as recommended

### 2. Advanced Parameter Controls

- **Temperature** (0.1-2.0): Controls randomness and creativity
- **Top P** (0.1-1.0): Nucleus sampling threshold
- **Top K** (1-100): Limits vocabulary choices
- **Repetition Penalty** (0.1-2.0): Prevents repetitive output
- **Random Seed**: Optional seed for reproducible results

### 3. Enhanced UI

- **Model Selection**: Dropdown to choose between available models
- **Advanced Settings**: Collapsible section with model and parameter controls
- **Real-time Status**: Shows current model and loading states
- **Parameter Validation**: Client-side and server-side validation
- **Visual Feedback**: Loading indicators and status messages

### 4. Backend Improvements

- **Multi-Model Support**: Can load and switch between multiple models
- **Parameter Safety**: Automatic clamping of parameters for stability
- **Smart Generation**: Different parameter handling for different models
- **Error Handling**: Improved error handling and recovery

## API Endpoints

### Models API

- `GET /api/tts/models` - List available models
- `POST /api/tts/models` - Load/switch models

### Enhanced Generation API

- `POST /api/tts/generate` - Generate speech with model and parameter selection

### TTS Server Endpoints

- `GET /models` - List available models and status
- `POST /generate` - Generate with all parameters

## Usage

### Model Selection

1. Open advanced settings
2. Select desired model from dropdown
3. Wait for model to load (if not already loaded)
4. Generate speech

### Advanced Parameters

1. Open advanced settings
2. Expand "advanced parameters" section
3. Adjust sliders for desired effect:
   - **Temperature**: Higher = more creative/varied
   - **Top P**: Lower = more focused
   - **Top K**: Lower = more predictable
   - **Repetition Penalty**: Higher = less repetitive

### Recommended Settings

#### Base Model (sesame/csm-1b)

- Temperature: 1.0-1.2
- Top P: 0.8-0.9
- Top K: 40-50
- Repetition Penalty: 1.0-1.1

#### Fine-tuned Model (senstella/csm-expressiva-1b)

- Temperature: 0.8-1.0 (more stable)
- Top P: 0.9-0.95
- Top K: 40-50
- Repetition Penalty: 1.0
- Uses speaker role 4 automatically

## Technical Details

### Model Loading Strategy

1. Base model loads on server startup
2. Fine-tuned model loads base model + applies fine-tuned weights
3. Models remain in memory for fast switching
4. Smart parameter adjustment per model

### Safety Features

- Parameter clamping to prevent generation failures
- Conservative limits for fine-tuned model
- Automatic fallback for unstable parameters
- Graceful error handling

### Performance

- Base model: ~7GB memory, good quality
- Fine-tuned model: Same memory, potentially faster inference
- Model switching: ~30-60 seconds for cold load
- Generation: 10-30 seconds depending on text length

## Files Modified

### Backend

- `/Users/ben/Dev/ai-tts/tts_server.py` - Enhanced with multi-model support
- `/Users/ben/Dev/sesame-web/src/pages/api/tts/generate.ts` - Added parameter support
- `/Users/ben/Dev/sesame-web/src/pages/api/tts/models.ts` - New model management API

### Frontend

- `/Users/ben/Dev/sesame-web/src/pages/tts.astro` - Complete UI overhaul with model selection and advanced controls

## Next Steps

- Add model performance metrics
- Implement model preloading strategies
- Add more fine-tuned models
- Optimize parameter presets
- Add voice cloning capabilities

## Testing

Both models successfully tested with various parameter combinations:

- ✅ Base model with conservative parameters
- ✅ Fine-tuned model with default parameters
- ✅ Advanced parameter adjustments
- ✅ Model switching via UI
- ✅ Audio generation and playback
- ✅ File management and history

The system is now production-ready with robust model selection and advanced parameter controls for professional-quality text-to-speech generation.
