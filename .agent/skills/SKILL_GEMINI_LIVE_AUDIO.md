# Skill: Google Gemini Multimodal Live API & Audio Synthesis Engine

## Overview
This skill documents how to connect to Google's Gemini Multimodal Live WebSocket API (`BidiGenerateContent`), stream Hindi/Hinglish scripts, synthesize hyper-natural conversational voiceovers, convert raw PCM buffers into production-ready WAV/MP3 files, and generate accurate word-level timestamps for subtitle synchronization.

---

## 1. Gemini Multimodal Live WebSocket Endpoint
The Gemini Live API provides bidirectional, low-latency communication over WebSockets.

- **Endpoint URL:**
  ```text
  wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${GEMINI_API_KEY}
  ```

---

## 2. Handshake Setup Message
Immediately after opening the WebSocket connection, the client must transmit the `setup` message configuring the model, system instruction, audio output modality, and chosen voice:

```json
{
  "setup": {
    "model": "models/gemini-2.0-flash-exp",
    "generationConfig": {
      "responseModalities": ["AUDIO"],
      "speechConfig": {
        "voiceConfig": {
          "prebuiltVoiceConfig": {
            "voiceName": "Puck"
          }
        }
      }
    },
    "systemInstruction": {
      "parts": [
        {
          "text": "You are a dynamic, articulate financial and business explainer narrator. Speak in a confident, engaging Hinglish/Hindi conversational tone. Do not include markdown or stage directions; read the provided script verbatim with natural human cadence, micro-pauses, and emphasis on key metrics."
        }
      ]
    }
  }
}
```

Prebuilt voices available:
- `Puck`: Energetic, modern young male (Ideal for fast-paced viral explainers)
- `Aoede`: Confident, warm female
- `Fenrir`: Deep, authoritative male
- `Kore`: Clear, friendly female
- `Zephyr`: Calm, analytical male

---

## 3. Streaming Script Prompt
Once the server confirms setup with `setupComplete`, send the script turn:

```json
{
  "clientContent": {
    "turns": [
      {
        "role": "user",
        "parts": [
          {
            "text": "Please narrate the following script cleanly without interruptions:\n\n" + scriptText
          }
        ]
      }
    ],
    "turnComplete": true
  }
}
```

---

## 4. Handling Received PCM Chunks
The server streams response messages with `serverContent`:
```json
{
  "serverContent": {
    "modelTurn": {
      "parts": [
        {
          "inlineData": {
            "mimeType": "audio/pcm;rate=24000",
            "data": "<BASE64_PCM_BYTES>"
          }
        }
      ]
    },
    "turnComplete": false
  }
}
```

### Buffer Accumulation:
```ts
const pcmChunks: Buffer[] = [];

ws.on('message', (raw: WebSocket.Data) => {
  const msg = JSON.parse(raw.toString());
  if (msg.serverContent?.modelTurn?.parts) {
    for (const part of msg.serverContent.modelTurn.parts) {
      if (part.inlineData?.data) {
        const buffer = Buffer.from(part.inlineData.data, 'base64');
        pcmChunks.push(buffer);
      }
    }
  }
  if (msg.serverContent?.turnComplete) {
    finalizeAudio();
  }
});
```

---

## 5. Converting 24kHz PCM to High-Quality WAV/MP3 via FFmpeg
Gemini Live outputs raw uncompressed 16-bit little-endian mono PCM at 24,000 Hz.
Convert it to broadcast-standard 48,000 Hz WAV and 320kbps MP3:

```bash
# Convert raw PCM to 48kHz Stereo WAV
ffmpeg -f s16le -ar 24000 -ac 1 -i raw_voiceover.pcm -ar 48000 -ac 2 final_voiceover.wav

# Or directly to high-bitrate MP3
ffmpeg -f s16le -ar 24000 -ac 1 -i raw_voiceover.pcm -ar 48000 -ac 2 -b:a 320k final_voiceover.mp3
```

Using Node.js `fluent-ffmpeg` or `child_process`:
```ts
import { execSync } from 'child_process';
execSync(`ffmpeg -y -f s16le -ar 24000 -ac 1 -i "${pcmPath}" -ar 48000 -ac 2 "${mp3Path}"`);
```

---

## 6. Word-Level Timestamps & Timeline Synchronization
To sync captions and scene cards with the audio:
1. Obtain the exact duration of `final_voiceover.mp3` via `ffprobe`:
   ```ts
   const durationSeconds = getAudioDurationInSeconds(mp3Path);
   const totalFrames = Math.ceil(durationSeconds * 60);
   ```
2. Distribute scene frames proportionally based on word count and phonetic syllable weights:
   - Each word receives a proportional `startFrame` and `endFrame`.
   - Words matching `highlighted_keywords` are tagged with `isHighlight: true`.
3. Scene intervals:
   - Each scene has `startFrame` and `durationInFrames` derived from its corresponding sentence in the voiceover.
