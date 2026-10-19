/**
 * Procedural Web Audio API sound generator for Disney-Pixel Creation of the World
 * High quality fairy chimes, fanfares, interactive pops, and gentle ambient background lullaby
 */

class AudioService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgmPlaying: boolean = false;
  private bgmTimer: number | null = null;
  private masterGain: GainNode | null = null;

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(1, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 1, this.ctx.currentTime);
    }
    if (muted && this.bgmPlaying) {
      this.stopBackgroundMusic();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsBgmPlaying(): boolean {
    return this.bgmPlaying;
  }

  /**
   * Bubbly pop for regular button clicks
   */
  public playClick() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(840, now + 0.08);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    if (this.masterGain) gain.connect(this.masterGain);
    else gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  /**
   * Disney fairy magic sparkle / celestial harp arpeggio
   */
  public playMagicChime() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.51, 1567.98]; // C5, E5, G5, B5, C6, E6, G6
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      const startTime = now + idx * 0.055;
      const duration = 0.45;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, startTime); // Octave sparkle overtone

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.09, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0005, startTime + duration);

      osc.connect(gain);
      osc2.connect(gain);
      if (this.masterGain) gain.connect(this.masterGain);
      else gain.connect(ctx.destination);

      osc.start(startTime);
      osc2.start(startTime);
      osc.stop(startTime + duration);
      osc2.stop(startTime + duration);
    });
  }

  /**
   * Star earned sparkle ding
   */
  public playStarEarned() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const notes = [880, 1174.66, 1760]; // A5, D6, A6
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + idx * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.14, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);

      osc.connect(gain);
      if (this.masterGain) gain.connect(this.masterGain);
      else gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.55);
    });
  }

  /**
   * Joyful, triumphant Disney fanfare for correct answer
   */
  public playCorrect() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    // Rich C-major triumphant arpeggio with celebratory bell chords
    const chordSeq = [
      { notes: [523.25, 659.25], delay: 0 },       // C5, E5
      { notes: [659.25, 783.99], delay: 0.1 },     // E5, G5
      { notes: [783.99, 1046.5], delay: 0.2 },     // G5, C6
      { notes: [1046.5, 1318.51, 1567.98], delay: 0.35, sustain: 0.8 } // High triumph chord
    ];

    const now = ctx.currentTime;
    chordSeq.forEach(step => {
      const startTime = now + step.delay;
      const duration = step.sustain || 0.35;

      step.notes.forEach(freq => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.12, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        if (this.masterGain) gain.connect(this.masterGain);
        else gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.05);
      });
    });
  }

  /**
   * Gentle, encouraging retry chime (warm marimba tone, friendly and warm)
   */
  public playEncouragement() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const notes = [392.00, 440.00]; // G4, A4 (warm friendly step)
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + idx * 0.12;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.1, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

      osc.connect(gain);
      if (this.masterGain) gain.connect(this.masterGain);
      else gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  }

  /**
   * Magic burst whoosh & sparkles
   */
  public playMagicBurst() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.28);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    if (this.masterGain) gain.connect(this.masterGain);
    else gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);

    // Followed by shimmering twinkle
    setTimeout(() => {
      this.playMagicChime();
    }, 120);
  }

  /**
   * Grand victory celebration fanfare
   */
  public playCelebration() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const notes = [
      { f: 523.25, d: 0.15 },
      { f: 659.25, d: 0.15 },
      { f: 783.99, d: 0.15 },
      { f: 1046.5, d: 0.4 },
      { f: 880,    d: 0.15 },
      { f: 1046.5, d: 0.15 },
      { f: 1318.5, d: 0.6 }
    ];

    let t = ctx.currentTime;
    notes.forEach(n => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, t);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.16, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + n.d);

      osc.connect(gain);
      if (this.masterGain) gain.connect(this.masterGain);
      else gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + n.d + 0.05);
      t += n.d * 0.9;
    });
  }

  /**
   * Gentle, soft Disney fairytale music box / ambient arpeggios
   */
  public toggleBackgroundMusic(): boolean {
    if (this.bgmPlaying) {
      this.stopBackgroundMusic();
      return false;
    } else {
      this.startBackgroundMusic();
      return true;
    }
  }

  public startBackgroundMusic() {
    if (this.bgmPlaying) return;
    this.bgmPlaying = true;
    const ctx = this.initContext();
    if (!ctx) return;

    // Peaceful lullaby pentatonic melody: C4, E4, G4, A4, C5, D5, E5, G5
    const melody = [
      523.25, 659.25, 783.99, 659.25, 880.00, 783.99, 659.25, 523.25,
      587.33, 783.99, 880.00, 1046.5, 880.00, 783.99, 659.25, 587.33
    ];
    let noteIdx = 0;

    const playStep = () => {
      if (!this.bgmPlaying || this.isMuted) return;
      const currentCtx = this.initContext();
      if (!currentCtx) return;

      const freq = melody[noteIdx % melody.length];
      noteIdx++;

      const osc = currentCtx.createOscillator();
      const gain = currentCtx.createGain();
      const now = currentCtx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Very soft ambient volume (0.03) so speech is crystal clear
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.035, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(gain);
      if (this.masterGain) gain.connect(this.masterGain);
      else gain.connect(currentCtx.destination);

      osc.start(now);
      osc.stop(now + 1.3);

      this.bgmTimer = window.setTimeout(playStep, 700);
    };

    playStep();
  }

  public stopBackgroundMusic() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

export const audioService = new AudioService();
