/**
 * Narration Service with Female Character "נוֹעָה הַמַּדְרִיכָה"
 * Explicitly powered by ElevenLabs Voice ID: fuMEGqYpFlKTER3VqptM ('Noa').
 * All default browser text-to-speech has been completely replaced with high-fidelity audio.
 */

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
    this.stop();
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
      };

      audio.onerror = () => {
        this.currentAudioElement = null;
        this.notifyState(false);
        if (onEndCallback) onEndCallback();
      };

      await audio.play();
      return true;
    } catch (e) {
      console.warn('Audio play error for URL:', url, e);
      this.notifyState(false);
      if (onEndCallback) onEndCallback();
      return false;
    }
  }

  /**
   * Play the official ElevenLabs sample for voice fuMEGqYpFlKTER3VqptM
   */
  public async playElevenLabsVoiceSample(onStartCallback?: () => void, onEndCallback?: () => void) {
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
    slideId?: number
  ) {
    this.stop();

    // 1. Check for dedicated slide audio file in repository
    if (slideId !== undefined) {
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

    // 2. Call ElevenLabs API via server proxy (/api/tts)
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voiceId: ELEVENLABS_VOICE_ID,
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.startsWith('audio/')) {
        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);
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
        };

        audio.onerror = () => {
          URL.revokeObjectURL(audioUrl);
          this.currentAudioElement = null;
          this.playElevenLabsVoiceSample(onStartCallback, onEndCallback);
        };

        await audio.play();
        return;
      }
    } catch (err) {
      console.warn('ElevenLabs API call error:', err);
    }

    // 3. Fallback exclusively to ElevenLabs audio sample — never browser SpeechSynthesis
    await this.playElevenLabsVoiceSample(onStartCallback, onEndCallback);
  }

  public speakNoaAdvice(advice: string, onEnd?: () => void) {
    this.speak(`עֵצָה מִנּוֹעָה: ${advice}`, undefined, onEnd);
  }

  public speakEncouragement(isCorrect: boolean) {
    const praise = isCorrect ? "כָּל הַכָּבוֹד! תְּשׁוּבָה מְדֻיֶּקֶת וּמֻפְלָאָה!" : "כִּמְעַט... נַסּוּ שׁוּב!";
    this.speak(praise);
  }
}

export const narrationService = new NarrationService();
