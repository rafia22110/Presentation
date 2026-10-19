import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ELEVENLABS_VOICE_ID = 'fuMEGqYpFlKTER3VqptM';
const audioCache = new Map<string, { buffer: Buffer; mimeType: string }>();

const ai = new GoogleGenAI();

function pcmToWav(pcmBuffer: Buffer, sampleRate = 24000, numChannels = 1, bitsPerSample = 16): Buffer {
  if (pcmBuffer.length >= 4 && pcmBuffer.subarray(0, 4).toString('ascii') === 'RIFF') {
    return pcmBuffer;
  }
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = pcmBuffer.length;
  const header = Buffer.alloc(44);

  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  header.writeUInt16LE(1, 20);  // AudioFormat (1 = PCM)
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, pcmBuffer]);
}

async function generateGeminiSpeech(text: string): Promise<Buffer | null> {
  const models = ['gemini-2.5-flash-preview-tts', 'gemini-3.8-flash-tts', 'gemini-3.8-flash-lite-tts'];
  for (const modelName of models) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `קראי בקול נשי חם, נעים, שמח וברור המותאם לילדים בכיתה ב': ${text}`,
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Aoede' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const rawBuffer = Buffer.from(base64Audio, 'base64');
        return pcmToWav(rawBuffer, 24000, 1, 16);
      }
    } catch (err) {
      console.warn(`Gemini TTS generation error with ${modelName}:`, err);
    }
  }
  return null;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Status check endpoint for voice integration
  app.get('/api/tts/status', (_req, res) => {
    const apiKey = process.env.ELEVENLABS_API_KEY || '';
    const isElevenLabsReady = apiKey.startsWith('sk_');

    res.json({
      elevenLabsConfigured: Boolean(apiKey),
      elevenLabsValidPrefix: isElevenLabsReady,
      voiceId: ELEVENLABS_VOICE_ID,
      activeProvider: isElevenLabsReady ? 'ElevenLabs' : 'Gemini Neural TTS',
      voiceName: isElevenLabsReady
        ? 'ElevenLabs (נוֹעָה: fuMEGqYpFlKTER3VqptM)'
        : 'נוֹעָה (קול נשי חם וטבעי - Gemini Neural AI)',
    });
  });

  // TTS Proxy endpoint
  app.post('/api/tts', async (req, res) => {
    try {
      const { text, voiceId = ELEVENLABS_VOICE_ID } = req.body;
      if (!text || typeof text !== 'string') {
        res.status(400).json({ error: 'Text is required', fallback: true });
        return;
      }

      const trimmedText = text.trim();
      const cacheKey = `${voiceId}:${trimmedText}`;

      // Check cache first
      if (audioCache.has(cacheKey)) {
        const cached = audioCache.get(cacheKey)!;
        res.setHeader('Content-Type', cached.mimeType);
        res.setHeader('Content-Length', cached.buffer.length);
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.send(cached.buffer);
        return;
      }

      const apiKey = process.env.ELEVENLABS_API_KEY || '';

      // 1. Try ElevenLabs if a valid secret API key (starting with sk_) is provided
      if (apiKey.startsWith('sk_')) {
        try {
          const elevenResponse = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}?output_format=mp3_44100_128`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'xi-api-key': apiKey,
              },
              body: JSON.stringify({
                text: trimmedText,
                model_id: 'eleven_multilingual_v2',
                voice_settings: {
                  stability: 0.5,
                  similarity_boost: 0.8,
                  style: 0.25,
                  use_speaker_boost: true,
                },
              }),
            }
          );

          if (elevenResponse.ok) {
            const arrayBuffer = await elevenResponse.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            audioCache.set(cacheKey, { buffer, mimeType: 'audio/mpeg' });

            res.setHeader('Content-Type', 'audio/mpeg');
            res.setHeader('Content-Length', buffer.length);
            res.setHeader('Cache-Control', 'public, max-age=86400');
            res.send(buffer);
            return;
          } else {
            const errText = await elevenResponse.text();
            console.warn('ElevenLabs API response not ok, switching to Gemini TTS:', errText);
          }
        } catch (elevenErr) {
          console.warn('ElevenLabs fetch failed, switching to Gemini TTS:', elevenErr);
        }
      } else if (apiKey) {
        console.warn(
          'ELEVENLABS_API_KEY does not start with "sk_". ElevenLabs keys must be secret keys starting with "sk_". Falling back to Gemini Neural TTS.'
        );
      }

      // 2. High-Fidelity Neural Fallback: Gemini TTS (Aoede female voice)
      const geminiWavBuffer = await generateGeminiSpeech(trimmedText);
      if (geminiWavBuffer) {
        audioCache.set(cacheKey, { buffer: geminiWavBuffer, mimeType: 'audio/wav' });

        if (typeof req.body.wordId === 'number' && req.body.wordId >= 0 && req.body.wordId <= 16) {
          try {
            const wordFilePath = path.resolve(__dirname, `public/audio/word_${req.body.wordId}.wav`);
            if (!fs.existsSync(wordFilePath)) {
              fs.writeFileSync(wordFilePath, geminiWavBuffer);
            }
          } catch (writeErr) {
            console.warn('Could not write word audio file:', writeErr);
          }
        }

        res.setHeader('Content-Type', 'audio/wav');
        res.setHeader('Content-Length', geminiWavBuffer.length);
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.send(geminiWavBuffer);
        return;
      }

      // 3. Fallback to ElevenLabs voice sample audio file
      const fallbackFile = path.resolve(__dirname, 'public/audio/elevenlabs_voice_fuMEGqYpFlKTER3VqptM.mp3');
      if (fs.existsSync(fallbackFile)) {
        const fallbackBuf = fs.readFileSync(fallbackFile);
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Length', fallbackBuf.length);
        res.send(fallbackBuf);
        return;
      }

      res.status(500).json({ error: 'Audio unavailable' });
    } catch (err: unknown) {
      console.error('Error in /api/tts endpoint:', err);
      const fallbackFile = path.resolve(__dirname, 'public/audio/elevenlabs_voice_fuMEGqYpFlKTER3VqptM.mp3');
      if (fs.existsSync(fallbackFile)) {
        const fallbackBuf = fs.readFileSync(fallbackFile);
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Length', fallbackBuf.length);
        res.send(fallbackBuf);
        return;
      }
      res.status(500).json({ error: (err as Error).message });
    }
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
