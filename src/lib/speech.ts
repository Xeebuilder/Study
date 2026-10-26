import { DialogueLine, HostPersona } from '@/types/podcast';

export interface SpeechController {
  play: (fromIndex?: number) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  setSpeed: (rate: number) => void;
  jumpToLine: (index: number) => void;
  isPlaying: boolean;
  isPaused: boolean;
  currentLineIndex: number;
}

export interface VoicePair {
  hostAVoice: SpeechSynthesisVoice | null;
  hostBVoice: SpeechSynthesisVoice | null;
}

// Helper to select the best available Spanish voices for Host A (Valeria) and Host B (Mateo)
export function getSpanishVoices(): Promise<VoicePair> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve({ hostAVoice: null, hostBVoice: null });
      return;
    }

    const findVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      if (!allVoices || allVoices.length === 0) {
        return null;
      }

      // Filter Spanish voices
      const spanishVoices = allVoices.filter((v) =>
        v.lang.toLowerCase().startsWith('es')
      );

      // Preferred high quality voices (Mexican, Latin American, Spain)
      const femaleKeywords = ['monica', 'paulina', 'lucia', 'laura', 'helena', 'victoria', 'rosa', 'elena', 'female', 'mujer', 'sabina', 'soledad'];
      const maleKeywords = ['jorge', 'juan', 'diego', 'carlos', 'mateo', 'pablo', 'miguel', 'enrique', 'male', 'hombre', 'alvaro', 'raul'];

      let hostAVoice: SpeechSynthesisVoice | null = null;
      let hostBVoice: SpeechSynthesisVoice | null = null;

      if (spanishVoices.length > 0) {
        // Try to find female voice for Host A
        hostAVoice =
          spanishVoices.find((v) =>
            femaleKeywords.some((k) => v.name.toLowerCase().includes(k))
          ) || spanishVoices[0];

        // Try to find male voice for Host B
        hostBVoice =
          spanishVoices.find(
            (v) =>
              v !== hostAVoice &&
              maleKeywords.some((k) => v.name.toLowerCase().includes(k))
          ) ||
          spanishVoices.find((v) => v !== hostAVoice) ||
          spanishVoices[0];
      } else {
        // Fallback: pick any 2 voices
        hostAVoice = allVoices[0] || null;
        hostBVoice = allVoices[1] || allVoices[0] || null;
      }

      return { hostAVoice, hostBVoice };
    };

    const immediate = findVoices();
    if (immediate && (immediate.hostAVoice || immediate.hostBVoice)) {
      resolve(immediate);
      return;
    }

    // Wait for voiceschanged event
    const handleVoicesChanged = () => {
      const result = findVoices();
      window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      resolve(result || { hostAVoice: null, hostBVoice: null });
    };

    window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);

    // Timeout fallback after 1.5s
    setTimeout(() => {
      window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      resolve(findVoices() || { hostAVoice: null, hostBVoice: null });
    }, 1500);
  });
}

export class PodcastAudioEngine {
  private dialogue: DialogueLine[] = [];
  private hosts: { hostA: HostPersona; hostB: HostPersona };
  private currentIndex: number = 0;
  private isPlaying: boolean = false;
  private isPaused: boolean = false;
  private speed: number = 1.0;
  private hostAVoice: SpeechSynthesisVoice | null = null;
  private hostBVoice: SpeechSynthesisVoice | null = null;

  private onLineChange?: (index: number, line: DialogueLine) => void;
  private onPlaybackEnd?: () => void;
  private onStateChange?: (isPlaying: boolean, isPaused: boolean) => void;

  constructor(
    dialogue: DialogueLine[],
    hosts: { hostA: HostPersona; hostB: HostPersona },
    callbacks?: {
      onLineChange?: (index: number, line: DialogueLine) => void;
      onPlaybackEnd?: () => void;
      onStateChange?: (isPlaying: boolean, isPaused: boolean) => void;
    }
  ) {
    this.dialogue = dialogue;
    this.hosts = hosts;
    if (callbacks) {
      this.onLineChange = callbacks.onLineChange;
      this.onPlaybackEnd = callbacks.onPlaybackEnd;
      this.onStateChange = callbacks.onStateChange;
    }

    if (typeof window !== 'undefined') {
      getSpanishVoices().then((voices) => {
        this.hostAVoice = voices.hostAVoice;
        this.hostBVoice = voices.hostBVoice;
      });
    }
  }

  public updateDialogue(dialogue: DialogueLine[]) {
    this.stop();
    this.dialogue = dialogue;
    this.currentIndex = 0;
  }

  public setSpeed(rate: number) {
    this.speed = Math.max(0.5, Math.min(rate, 2.5));
    if (this.isPlaying && !this.isPaused) {
      // Re-trigger current line with new speed
      this.speakCurrentLine();
    }
  }

  public getSpeed(): number {
    return this.speed;
  }

  public play(fromIndex?: number) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (fromIndex !== undefined && fromIndex >= 0 && fromIndex < this.dialogue.length) {
      this.currentIndex = fromIndex;
    }

    if (this.isPaused) {
      window.speechSynthesis.resume();
      this.isPaused = false;
      this.isPlaying = true;
      this.notifyState();
      return;
    }

    window.speechSynthesis.cancel();
    this.isPlaying = true;
    this.isPaused = false;
    this.notifyState();
    this.speakCurrentLine();
  }

  public pause() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (this.isPlaying && !this.isPaused) {
      window.speechSynthesis.pause();
      this.isPaused = true;
      this.notifyState();
    }
  }

  public resume() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (this.isPaused) {
      window.speechSynthesis.resume();
      this.isPaused = false;
      this.notifyState();
    } else if (!this.isPlaying) {
      this.play(this.currentIndex);
    }
  }

  public stop() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    this.isPlaying = false;
    this.isPaused = false;
    this.notifyState();
  }

  public jumpToLine(index: number) {
    if (index < 0 || index >= this.dialogue.length) return;
    this.currentIndex = index;
    if (this.isPlaying) {
      window.speechSynthesis.cancel();
      this.speakCurrentLine();
    } else {
      if (this.onLineChange && this.dialogue[index]) {
        this.onLineChange(index, this.dialogue[index]);
      }
    }
  }

  public getCurrentIndex(): number {
    return this.currentIndex;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getIsPaused(): boolean {
    return this.isPaused;
  }

  private notifyState() {
    if (this.onStateChange) {
      this.onStateChange(this.isPlaying, this.isPaused);
    }
  }

  private speakCurrentLine() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (this.currentIndex >= this.dialogue.length) {
      this.isPlaying = false;
      this.isPaused = false;
      this.notifyState();
      if (this.onPlaybackEnd) this.onPlaybackEnd();
      return;
    }

    const currentLine = this.dialogue[this.currentIndex];
    if (!currentLine) return;

    if (this.onLineChange) {
      this.onLineChange(this.currentIndex, currentLine);
    }

    // Cancel any hanging utterance
    window.speechSynthesis.cancel();

    // Clean text of non-vocal emojis for cleaner speech pronunciation
    const cleanText = currentLine.text
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText || currentLine.text);
    utterance.lang = 'es-MX'; // Latin American Spanish standard

    const isHostA = currentLine.speaker === 'hostA';
    const host = isHostA ? this.hosts.hostA : this.hosts.hostB;

    if (isHostA && this.hostAVoice) {
      utterance.voice = this.hostAVoice;
    } else if (!isHostA && this.hostBVoice) {
      utterance.voice = this.hostBVoice;
    }

    // Give distinct vocal personality:
    // Host A (Valeria): lively, slightly higher pitch
    // Host B (Mateo): slightly deeper, steady tone
    if (isHostA) {
      utterance.pitch = (host.defaultPitch || 1.15);
    } else {
      utterance.pitch = (host.defaultPitch || 0.90);
    }

    utterance.rate = this.speed * (host.defaultRate || 1.05);

    utterance.onend = () => {
      if (!this.isPlaying || this.isPaused) return;

      // Small natural conversational gap (400ms) between hosts
      setTimeout(() => {
        if (!this.isPlaying || this.isPaused) return;
        this.currentIndex++;
        this.speakCurrentLine();
      }, 400);
    };

    utterance.onerror = (e) => {
      // Don't error out on intentional cancel
      if (e.error === 'interrupted' || e.error === 'canceled') return;
      console.warn('Speech synthesis error:', e);
      if (this.isPlaying && !this.isPaused) {
        this.currentIndex++;
        this.speakCurrentLine();
      }
    };

    window.speechSynthesis.speak(utterance);
  }
}
