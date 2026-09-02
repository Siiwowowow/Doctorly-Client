// src/lib/ringtone.ts

/**
 * Zero-dependency Web Audio API Ringtone generator.
 * Creates an elegant, melodious incoming call ringtone that works
 * in all modern browsers without requiring external audio assets.
 */
class RingtonePlayer {
  private audioCtx: AudioContext | null = null;
  private isPlaying = false;
  private loopTimer: NodeJS.Timeout | null = null;

  private initContext(): AudioContext {
    if (!this.audioCtx || this.audioCtx.state === 'closed') {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  private playTonePair(freq1: number, freq2: number, startTime: number, duration: number) {
    if (!this.audioCtx || !this.isPlaying) return;

    try {
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(freq1, startTime);
      osc2.frequency.setValueAtTime(freq2, startTime);

      // Smooth attack and release envelope to prevent clicking
      gainNode.gain.setValueAtTime(0.0001, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.2, startTime + 0.05);
      gainNode.gain.setValueAtTime(0.2, startTime + duration - 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);

      osc1.start(startTime);
      osc2.start(startTime);

      osc1.stop(startTime + duration);
      osc2.stop(startTime + duration);
    } catch {
      // Ignore Web Audio errors if context closed
    }
  }

  private playChimeCycle() {
    if (!this.isPlaying) return;
    const ctx = this.initContext();
    const now = ctx.currentTime;

    // Harmonic medical telemedicine chime (E5 -> G#5 -> B5 sequence)
    this.playTonePair(659.25, 830.61, now + 0.0, 0.35); // E5 + G#5
    this.playTonePair(830.61, 987.77, now + 0.4, 0.35); // G#5 + B5
    this.playTonePair(659.25, 987.77, now + 0.8, 0.65); // E5 + B5 chord

    // Schedule next ring cycle in 2.8 seconds
    if (this.isPlaying) {
      this.loopTimer = setTimeout(() => {
        if (this.isPlaying) {
          this.playChimeCycle();
        }
      }, 2800);
    }
  }

  public start() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    try {
      this.initContext();
      this.playChimeCycle();
    } catch (e) {
      console.warn('Could not start ringtone:', e);
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.loopTimer) {
      clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }
  }
}

export const ringtonePlayer = new RingtonePlayer();
