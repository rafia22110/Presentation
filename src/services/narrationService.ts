/**
 * Narration Service with Female Character "נוֹעָה הַמַּדְרִיכָה"
 * Explicitly powered by ElevenLabs Voice ID: fuMEGqYpFlKTER3VqptM ('Noa').
 * All default browser text-to-speech has been completely replaced with high-fidelity audio.
 */

import { DictionaryWord } from '../types';

export const ELEVENLABS_VOICE_ID = 'fuMEGqYpFlKTER3VqptM';
export const ELEVENLABS_VOICE_NAME = 'נוֹעָה (Noa)';
export const ELEVENLABS_SAMPLE_URL = '/audio/elevenlabs_voice_fuMEGqYpFlKTER3VqptM.mp3';

export interface VoiceStatus {
  provider: 'ElevenLabs';
  voiceId: string;
  voiceName: string;
}

class NarrationService {
  private isSpeakingState: boolean = false;
  private currentAudioElement: HTMLAudioElement | null = null;
  private sequenceCancelled: boolean = false;
  private onStateChangeListeners: Array<(isSpeaking: boolean) => void> = [];

  constructor() {
    // Zero browser SpeechSynthesis initialization — completely replaced by ElevenLabs audio
  }

  public getVoiceStatus(): VoiceStatus {
    return {
      provider: 'ElevenLabs',
      voiceId: ELEVENLABS_VOICE_ID,
      voiceName: `${ELEVENLABS_VOICE_NAME} - ElevenLabs Voice ID: ${ELEVENLABS_VOICE_ID}`,
    };
  }

  public addStateListener(listener: (isSpeaking: boolean) => void) {
    this.onStateChangeListeners.push(listener);
    return () => {
      this.onStateChangeListeners = this.onStateChangeListeners.filter(l => l !== listener);
    };
  }

  private notifyState(isSpeaking: boolean) {
    this.isSpeakingState = isSpeaking;
    this.onStateChangeListeners.forEach(listener => listener(isSpeaking));
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState;
  }

  public stop() {
    this.sequenceCancelled = true;
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement.currentTime = 0;
      this.currentAudioElement = null;
    }
    this.notifyState(false);
  }

  /**
   * Play any audio URL with state tracking and avatar synchronization
   */
  public async playAudioUrl(
    url: string,
    onStartCallback?: () => void,
    onEndCallback?: () => void
  ): Promise<boolean> {
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement.currentTime = 0;
      this.currentAudioElement = null;
    }

    return new Promise<boolean>((resolve) => {
      try {
        const audio = new Audio(url);
        this.currentAudioElement = audio;

        audio.onplay = () => {
          this.notifyState(true);
          if (onStartCallback) onStartCallback();
        };

        audio.onended = () => {
          this.currentAudioElement = null;
          this.notifyState(false);
          if (onEndCallback) onEndCallback();
          resolve(true);
        };

        audio.onerror = () => {
          this.currentAudioElement = null;
          this.notifyState(false);
          if (onEndCallback) onEndCallback();
          resolve(false);
        };

        audio.play().catch((err) => {
          console.warn('Audio play error for URL:', url, err);
          this.currentAudioElement = null;
          this.notifyState(false);
          if (onEndCallback) onEndCallback();
          resolve(false);
        });
      } catch (e) {
        console.warn('Audio setup error for URL:', url, e);
        this.notifyState(false);
        if (onEndCallback) onEndCallback();
        resolve(false);
      }
    });
  }

  /**
   * Play the official ElevenLabs sample for voice fuMEGqYpFlKTER3VqptM
   */
  public async playElevenLabsVoiceSample(onStartCallback?: () => void, onEndCallback?: () => void) {
    this.sequenceCancelled = false;
    await this.playAudioUrl(ELEVENLABS_SAMPLE_URL, onStartCallback, onEndCallback);
  }

  /**
   * Speak slide or text explicitly with ElevenLabs Noa Voice (fuMEGqYpFlKTER3VqptM)
   * Replaces any default browser text-to-speech fallback completely.
   */
  public async speak(
    text: string,
    onStartCallback?: () => void,
    onEndCallback?: () => void,
    slideId?: number,
    wordId?: number
  ): Promise<void> {
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement.currentTime = 0;
      this.currentAudioElement = null;
    }

    // 1. Check for dedicated slide audio file in repository
    if (slideId !== undefined && slideId >= 0 && slideId <= 7) {
      const staticUrl = `/audio/slide_${slideId}.wav`;
      try {
        const headCheck = await fetch(staticUrl, { method: 'HEAD' });
        if (headCheck.ok) {
          const success = await this.playAudioUrl(staticUrl, onStartCallback, onEndCallback);
          if (success) return;
        }
      } catch {
        // Continue to ElevenLabs API endpoint
      }
    }

    // 1b. Check for dedicated dictionary word audio file if pre-cached in public/audio
    if (wordId !== undefined) {
      const wordUrl = `/audio/word_${wordId}.wav`;
      try {
        const headCheck = await fetch(wordUrl, { method: 'HEAD' });
        if (headCheck.ok) {
          const success = await this.playAudioUrl(wordUrl, onStartCallback, onEndCallback);
          if (success) return;
        }
      } catch {
        // Continue to ElevenLabs API endpoint
      }
    }

    // 2. Call ElevenLabs API via server proxy (/api/tts)
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voiceId: ELEVENLABS_VOICE_ID,
          wordId,
          slideId,
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.startsWith('audio/')) {
        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);

        await new Promise<void>((resolve) => {
          const audio = new Audio(audioUrl);
          this.currentAudioElement = audio;

          audio.onplay = () => {
            this.notifyState(true);
            if (onStartCallback) onStartCallback();
          };

          audio.onended = () => {
            URL.revokeObjectURL(audioUrl);
            this.currentAudioElement = null;
            this.notifyState(false);
            if (onEndCallback) onEndCallback();
            resolve();
          };

          audio.onerror = async () => {
            URL.revokeObjectURL(audioUrl);
            this.currentAudioElement = null;
            await this.playElevenLabsVoiceSample(onStartCallback, onEndCallback);
            resolve();
          };

          audio.play().catch(async () => {
            URL.revokeObjectURL(audioUrl);
            this.currentAudioElement = null;
            await this.playElevenLabsVoiceSample(onStartCallback, onEndCallback);
            resolve();
          });
        });
        return;
      }
    } catch (err) {
      console.warn('ElevenLabs API call error:', err);
    }

    // 3. Fallback exclusively to ElevenLabs audio sample — never browser SpeechSynthesis
    await this.playElevenLabsVoiceSample(onStartCallback, onEndCallback);
  }

  /**
   * Speak a single dictionary word card with Noa's voice
   */
  public async speakDictionaryWord(
    item: DictionaryWord,
    onStartCallback?: () => void,
    onEndCallback?: () => void
  ): Promise<void> {
    this.sequenceCancelled = false;
    const speechText = `${item.word}. פֵּרוּשׁ: ${item.simpleMeaning}. דּוּגְמָה: ${item.kidExample}. מֵהַפָּסוּק: ${item.verseQuote}`;
    await this.speak(speechText, onStartCallback, onEndCallback, undefined, item.id);
  }

  /**
   * Speak the entire list of dictionary words sequentially with Noa's voice
   */
  public async speakFullDictionary(
    words: DictionaryWord[],
    onWordHighlight?: (wordId: number | null) => void,
    onComplete?: () => void
  ): Promise<void> {
    this.stop();
    this.sequenceCancelled = false;

    for (const item of words) {
      if (this.sequenceCancelled) break;
      if (onWordHighlight) onWordHighlight(item.id);

      const speechText = `${item.word}. פֵּרוּשׁ: ${item.simpleMeaning}. דּוּגְמָה: ${item.kidExample}`;
      await this.speak(speechText, undefined, undefined, undefined, item.id);

      if (this.sequenceCancelled) break;
      // Short pause between words
      await new Promise((r) => setTimeout(r, 350));
    }

    if (onWordHighlight) onWordHighlight(null);
    if (onComplete) onComplete();
  }

  public speakNoaAdvice(advice: string, onEnd?: () => void) {
    this.sequenceCancelled = false;
    this.speak(`עֵצָה מִנּוֹעָה: ${advice}`, undefined, onEnd);
  }

  public speakEncouragement(isCorrect: boolean) {
    this.sequenceCancelled = false;
    const praise = isCorrect ? "כָּל הַכָּבוֹד! תְּשׁוּבָה מְדֻיֶּקֶת וּמֻפְלָאָה!" : "כִּמְעַט... נַסּוּ שׁוּב!";
    this.speak(praise);
  }
}

export const narrationService = new NarrationService();
