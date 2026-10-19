/**
 * Narration Service with Female Character ("נוֹעָה הַמַּדְרִיכָה") Voice Engine
 * Specifically configured for ElevenLabs Voice ID: fuMEGqYpFlKTER3VqptM
 * Supports ElevenLabs streaming audio with seamless, automatic fallback to calibrated Web Speech API.
 */

export const ELEVENLABS_VOICE_ID = 'fuMEGqYpFlKTER3VqptM';

export interface VoiceStatus {
  provider: 'ElevenLabs' | 'WebSpeech';
  voiceId: string;
  isConfigured: boolean;
  voiceName: string;
}

class NarrationService {
  private isSpeakingState: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private currentAudioElement: HTMLAudioElement | null = null;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private voicesLoaded: boolean = false;
  private isElevenLabsAvailable: boolean = false;
  private statusChecked: boolean = false;
  private onStateChangeListeners: Array<(isSpeaking: boolean) => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.checkStatus();
      if ('speechSynthesis' in window) {
        this.initVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
          window.speechSynthesis.onvoiceschanged = () => this.initVoices();
        }
      }
    }
  }

  public async checkStatus(): Promise<boolean> {
    try {
      const res = await fetch('/api/tts/status');
      if (res.ok) {
        const data = await res.json();
        this.isElevenLabsAvailable = Boolean(data.configured);
        this.statusChecked = true;
        return this.isElevenLabsAvailable;
      }
    } catch {
      this.isElevenLabsAvailable = false;
      this.statusChecked = true;
    }
    return false;
  }

  public getVoiceStatus(): VoiceStatus {
    return {
      provider: this.isElevenLabsAvailable ? 'ElevenLabs' : 'WebSpeech',
      voiceId: ELEVENLABS_VOICE_ID,
      isConfigured: this.isElevenLabsAvailable,
      voiceName: this.isElevenLabsAvailable
        ? `ElevenLabs (נוֹעָה: ${ELEVENLABS_VOICE_ID.slice(0, 8)}...)`
        : 'נוֹעָה (Web Speech מְכֻוָּן לִילָדִים)',
    };
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return;

    this.voicesLoaded = true;

    // Look for Hebrew female voices first
    const hebrewVoices = voices.filter(v => v.lang.startsWith('he') || v.lang === 'iw-IL');

    const femaleHebrew = hebrewVoices.find(v => 
      /carmit|hila|sara|michal|yael|female|woman|he-il-female/i.test(v.name)
    );

    const anyHebrew = hebrewVoices[0];
    const anyFemale = voices.find(v => /female|girl|samantha|zira|victoria/i.test(v.name));

    this.selectedVoice = femaleHebrew || anyHebrew || anyFemale || voices[0] || null;
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
    // Stop any ongoing HTML5 audio playback
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement.currentTime = 0;
      this.currentAudioElement = null;
    }

    // Stop any ongoing SpeechSynthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }

    this.notifyState(false);
  }

  /**
   * Speak text with the cheerful female character voice ("נוֹעָה")
   * Tries ElevenLabs voice ZiofZHcEBTn5sRySe5h8 via /api/tts first,
   * falling back automatically to the calibrated browser voice if key is not configured.
   */
  public async speak(
    text: string, 
    onStartCallback?: () => void, 
    onEndCallback?: () => void
  ) {
    this.stop();

    // 1. Try ElevenLabs API proxy
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
          // Fall back to SpeechSynthesis
          this.speakWebSpeech(text, onStartCallback, onEndCallback);
        };

        await audio.play();
        return;
      }
    } catch {
      // Fall through to Web Speech fallback
    }

    // 2. Fallback to Web Speech API
    this.speakWebSpeech(text, onStartCallback, onEndCallback);
  }

  private speakWebSpeech(
    text: string,
    onStartCallback?: () => void,
    onEndCallback?: () => void
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEndCallback) onEndCallback();
      return;
    }

    if (!this.voicesLoaded) {
      this.initVoices();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'he-IL';

    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }

    // Child-friendly warm female educator tone:
    utterance.pitch = 1.22;
    utterance.rate = 0.86;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      this.notifyState(true);
      if (onStartCallback) onStartCallback();
    };

    utterance.onend = () => {
      this.notifyState(false);
      this.currentUtterance = null;
      if (onEndCallback) onEndCallback();
    };

    utterance.onerror = (e) => {
      if (e.error !== 'canceled') {
        console.warn('SpeechSynthesis error:', e);
      }
      this.notifyState(false);
      this.currentUtterance = null;
      if (onEndCallback) onEndCallback();
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  public speakNoaAdvice(advice: string, onEnd?: () => void) {
    const intro = "שִׂימוּ לֵב לַהֶסְבֵּר שֶׁלִּי:";
    this.speak(`${intro} ${advice}`, undefined, onEnd);
  }

  public speakEncouragement(isCorrect: boolean) {
    const praiseList = [
      "כָּל הַכָּבוֹד! תְּשׁוּבָה מְדֻיֶּקֶת וּמֻפְלָאָה!",
      "אֵיזֶה יֹפִי! אַתֶּם מַמָּשׁ חֲכָמִים!",
      "מְצֻיָּן! זְכִיתֶם בְּכוֹכָב זָהָב זוֹהֵר!"
    ];
    const tryAgainList = [
      "כִּמְעַט... נַסּוּ שׁוּב, אֲנִי בְּטוּחָה שֶׁתַּצְלִיחוּ!",
      "לֹא נוֹרָא, נַחְשְׁבוּ עוֹד רֶגַע וּבַחֲרוּ שׁוּב!"
    ];

    const pick = isCorrect 
      ? praiseList[Math.floor(Math.random() * praiseList.length)]
      : tryAgainList[Math.floor(Math.random() * tryAgainList.length)];

    this.speak(pick);
  }
}

export const narrationService = new NarrationService();
