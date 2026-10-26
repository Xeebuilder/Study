export type PodcastVibe = 
  | 'puro-chisme'      // El cafecito y el té más picante
  | 'estudio-relajado'  // Amigos estudiando con buena onda
  | 'el-esceptico'     // Uno que duda de todo y el cerebrito que explica
  | 'repaso-expres';   // Modo examen mañana a primera hora

export type SpeakerId = 'hostA' | 'hostB';

export interface HostPersona {
  id: SpeakerId;
  name: string;
  role: string;
  avatar: string;
  voiceGender: 'female' | 'male';
  defaultPitch: number;
  defaultRate: number;
}

export interface DialogueLine {
  id: string;
  speaker: SpeakerId;
  speakerName: string;
  text: string;
  emotion?: 'chismoso' | 'sorprendido' | 'riendo' | 'explicando' | 'dudoso' | 'enfatico';
  referencedImageIndex?: number; // Index of the uploaded image/slide this line talks about
}

export interface StudyImage {
  id: string;
  name: string;
  dataUrl: string; // Base64 data URL
  mimeType: string;
}

export interface KeyTakeaway {
  concept: string;
  explanation: string;
  examTip?: string;
}

export interface PodcastEpisode {
  id: string;
  title: string;
  subtitle: string;
  topic: string;
  vibe: PodcastVibe;
  createdAt: string;
  hosts: {
    hostA: HostPersona;
    hostB: HostPersona;
  };
  dialogue: DialogueLine[];
  keyTakeaways: KeyTakeaway[];
  images: StudyImage[];
  durationMinutesEstimate: number;
}
