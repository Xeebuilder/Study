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

// Extracts ElevenLabs Voice ID from URLs or raw IDs
export function extractElevenLabsVoiceId(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  // If it's a URL like https://elevenlabs.io/app/voice-lab/share/... or query param ?voice=...
  if (trimmed.includes('elevenlabs.io')) {
    const urlObj = new URL(trimmed);
    const voiceParam = urlObj.searchParams.get('voice');
    if (voiceParam) return voiceParam;

    const segments = urlObj.pathname.split('/').filter(Boolean);
    const last = segments[segments.length - 1];
    if (last && last.length >= 10) return last;
  }
  return trimmed;
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

      const spanishVoices = allVoices.filter((v) =>
        v.lang.toLowerCase().startsWith('es')
      );

      const femaleKeywords = ['monica', 'paulina', 'lucia', 'laura', 'helena', 'victoria', 'rosa', 'elena', 'female', 'mujer', 'sabina', 'soledad'];
      const maleKeywords = ['jorge', 'juan', 'diego', 'carlos', 'mateo', 'pablo', 'miguel', 'enrique', 'male', 'hombre', 'alvaro', 'raul'];

      let hostAVoice: SpeechSynthesisVoice | null = null;
      let hostBVoice: SpeechSynthesisVoice | null = null;

      if (spanishVoices.length > 0) {
        hostAVoice =
          spanishVoices.find((v) =>
            femaleKeywords.some((k) => v.name.toLowerCase().includes(k))
          ) || spanishVoices[0];

        hostBVoice =
          spanishVoices.find(
            (v) =>
              v !== hostAVoice &&
              maleKeywords.some((k) => v.name.toLowerCase().includes(k))
          ) ||
          spanishVoices.find((v) => v !== hostAVoice) ||
          spanishVoices[0];
      } else {
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

    const handleVoicesChanged = () => {
      const result = findVoices();
      window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      resolve(result || { hostAVoice: null, hostBVoice: null });
    };

    window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);

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
  private currentAudioElement: HTMLAudioElement | null = null;
  private elevenLabsApiKey?: string;

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
    },
    elevenLabsApiKey?: string
  ) {
    this.dialogue = dialogue;
    this.hosts = hosts;
    this.elevenLabsApiKey = elevenLabsApiKey;

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

  public setElevenLabsApiKey(key: string) {
    this.elevenLabsApiKey = key;
  }

  public updateDialogue(dialogue: DialogueLine[]) {
    this.stop();
    this.dialogue = dialogue;
    this.currentIndex = 0;
  }

  public setSpeed(rate: number) {
    this.speed = Math.max(0.5, Math.min(rate, 2.5));
    if (this.currentAudioElement) {
      this.currentAudioElement.playbackRate = this.speed;
    }
    if (this.isPlaying && !this.isPaused) {
      this.speakCurrentLine();
    }
  }

  public getSpeed(): number {
    return this.speed;
  }

  public play(fromIndex?: number) {
    if (typeof window === 'undefined') return;

    if (fromIndex !== undefined && fromIndex >= 0 && fromIndex < this.dialogue.length) {
      this.currentIndex = fromIndex;
    }

    if (this.isPaused) {
      if (this.currentAudioElement) {
        this.currentAudioElement.play();
      } else if ('speechSynthesis' in window) {
        window.speechSynthesis.resume();
      }
      this.isPaused = false;
      this.isPlaying = true;
      this.notifyState();
      return;
    }

    this.stopCurrentPlayback();
    this.isPlaying = true;
    this.isPaused = false;
    this.notifyState();
    this.speakCurrentLine();
  }

  public pause() {
    if (typeof window === 'undefined') return;
    if (this.isPlaying && !this.isPaused) {
      if (this.currentAudioElement) {
        this.currentAudioElement.pause();
      } else if ('speechSynthesis' in window) {
        window.speechSynthesis.pause();
      }
      this.isPaused = true;
      this.notifyState();
    }
  }

  public resume() {
    if (typeof window === 'undefined') return;
    if (this.isPaused) {
      if (this.currentAudioElement) {
        this.currentAudioElement.play();
      } else if ('speechSynthesis' in window) {
        window.speechSynthesis.resume();
      }
      this.isPaused = false;
      this.notifyState();
    } else if (!this.isPlaying) {
      this.play(this.currentIndex);
    }
  }

  public stop() {
    if (typeof window === 'undefined') return;
    this.stopCurrentPlayback();
    this.isPlaying = false;
    this.isPaused = false;
    this.notifyState();
  }

  private stopCurrentPlayback() {
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public jumpToLine(index: number) {
    if (index < 0 || index >= this.dialogue.length) return;
    this.currentIndex = index;
    if (this.isPlaying) {
      this.stopCurrentPlayback();
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

  private async speakCurrentLine() {
    if (typeof window === 'undefined') return;
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

    this.stopCurrentPlayback();

    const isHostA = currentLine.speaker === 'hostA';
    const host = isHostA ? this.hosts.hostA : this.hosts.hostB;
    const elevenVoiceId = host.elevenLabsVoiceId ? extractElevenLabsVoiceId(host.elevenLabsVoiceId) : null;

    // Check if line already has pre-cached audioUrl or if we can fetch ElevenLabs TTS
    if (currentLine.audioUrl) {
      this.playAudioUrl(currentLine.audioUrl);
      return;
    }

    // Attempt ElevenLabs synthesis if voiceId and API key are available
    if (elevenVoiceId) {
      try {
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: currentLine.text,
            voiceId: elevenVoiceId,
            apiKey: this.elevenLabsApiKey || undefined,
          }),
        });

        if (res.ok) {
          const blob = await res.blob();
          const audioUrl = URL.createObjectURL(blob);
          currentLine.audioUrl = audioUrl; // Cache for immediate replay
          if (this.isPlaying && !this.isPaused) {
            this.playAudioUrl(audioUrl);
            return;
          }
        }
      } catch (err) {
        console.warn('ElevenLabs TTS fallback to Web Speech:', err);
      }
    }

    // Fallback: Web Speech synthesis in Spanish
    this.speakWithWebSpeech(currentLine, host, isHostA);
  }

  private playAudioUrl(url: string) {
    const audio = new Audio(url);
    this.currentAudioElement = audio;
    audio.playbackRate = this.speed;

    audio.onended = () => {
      if (!this.isPlaying || this.isPaused) return;
      setTimeout(() => {
        if (!this.isPlaying || this.isPaused) return;
        this.currentIndex++;
        this.speakCurrentLine();
      }, 350);
    };

    audio.onerror = () => {
      if (this.isPlaying && !this.isPaused) {
        this.currentIndex++;
        this.speakCurrentLine();
      }
    };

    audio.play().catch((err) => {
      console.warn('Audio play error:', err);
      // Fallback to web speech if autoplay was blocked
      const currentLine = this.dialogue[this.currentIndex];
      const isHostA = currentLine?.speaker === 'hostA';
      const host = isHostA ? this.hosts.hostA : this.hosts.hostB;
      if (currentLine) this.speakWithWebSpeech(currentLine, host, isHostA);
    });
  }

  private speakWithWebSpeech(currentLine: DialogueLine, host: HostPersona, isHostA: boolean) {
    if (!('speechSynthesis' in window)) return;

    const cleanText = currentLine.text
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText || currentLine.text);
    utterance.lang = 'es-MX';

    if (isHostA && this.hostAVoice) {
      utterance.voice = this.hostAVoice;
    } else if (!isHostA && this.hostBVoice) {
      utterance.voice = this.hostBVoice;
    }

    if (isHostA) {
      utterance.pitch = host.defaultPitch || 1.15;
    } else {
      utterance.pitch = host.defaultPitch || 0.90;
    }

    utterance.rate = this.speed * (host.defaultRate || 1.05);

    utterance.onend = () => {
      if (!this.isPlaying || this.isPaused) return;
      setTimeout(() => {
        if (!this.isPlaying || this.isPaused) return;
        this.currentIndex++;
        this.speakCurrentLine();
      }, 400);
    };

    utterance.onerror = (e) => {
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
