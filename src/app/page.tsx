'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { PodcastEpisode, PodcastVibe, StudyImage } from '@/types/podcast';
import { DEMO_EPISODE } from '@/data/demoEpisode';
import { Navbar } from '@/components/Navbar';
import { ImageUploader } from '@/components/ImageUploader';
import { EpisodeConfig } from '@/components/EpisodeConfig';
import { PodcastPlayer } from '@/components/PodcastPlayer';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { SavedEpisodesDrawer } from '@/components/SavedEpisodesDrawer';
import { VoiceSettingsModal } from '@/components/VoiceSettingsModal';
import {
  Sparkles,
  AlertCircle,
  ArrowLeft,
  Headphones,
  SlidersHorizontal,
  CheckCircle2,
  AudioWaveform,
  Layers,
  Zap,
} from 'lucide-react';

const STORAGE_KEY_API = 'chismestudy_gemini_api_key';
const STORAGE_KEY_SAVED = 'chismestudy_saved_episodes';
const STORAGE_KEY_VOICE_A = 'chismestudy_eleven_voice_a';
const STORAGE_KEY_VOICE_B = 'chismestudy_eleven_voice_b';
const STORAGE_KEY_ELEVEN_KEY = 'chismestudy_eleven_api_key';

const DEFAULT_VOICE_A = '7DsPNelW3gSv6Oxki5sa'; // Valeria (voz femenina)
const DEFAULT_VOICE_B = '3mmJ2Z5SLZ9OkeZZcv5p'; // Mateo (voz masculina)

export default function Home() {
  const [apiKey, setApiKey] = useState<string>('');
  const [images, setImages] = useState<StudyImage[]>([]);
  const [topic, setTopic] = useState<string>('');
  const [vibe, setVibe] = useState<PodcastVibe>('puro-chisme');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [loadingStepText, setLoadingStepText] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ElevenLabs Voice configuration with user's selected voices
  const [voiceA, setVoiceA] = useState<string>(DEFAULT_VOICE_A);
  const [voiceB, setVoiceB] = useState<string>(DEFAULT_VOICE_B);
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState<string>('');

  const [activeEpisode, setActiveEpisode] = useState<PodcastEpisode | null>(null);
  const [savedEpisodes, setSavedEpisodes] = useState<PodcastEpisode[]>([]);

  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);

  // Load configuration from localStorage on mount
  useEffect(() => {
    try {
      const storedKey = localStorage.getItem(STORAGE_KEY_API);
      if (storedKey) setApiKey(storedKey);

      let storedVoiceA = localStorage.getItem(STORAGE_KEY_VOICE_A);
      let storedVoiceB = localStorage.getItem(STORAGE_KEY_VOICE_B);

      // Auto-correct previously inverted voice IDs
      if (storedVoiceA === '3mmJ2Z5SLZ9OkeZZcv5p' && storedVoiceB === '7DsPNelW3gSv6Oxki5sa') {
        storedVoiceA = DEFAULT_VOICE_A;
        storedVoiceB = DEFAULT_VOICE_B;
        localStorage.setItem(STORAGE_KEY_VOICE_A, DEFAULT_VOICE_A);
        localStorage.setItem(STORAGE_KEY_VOICE_B, DEFAULT_VOICE_B);
      }

      if (storedVoiceA) {
        setVoiceA(storedVoiceA);
      } else {
        setVoiceA(DEFAULT_VOICE_A);
        localStorage.setItem(STORAGE_KEY_VOICE_A, DEFAULT_VOICE_A);
      }

      if (storedVoiceB) {
        setVoiceB(storedVoiceB);
      } else {
        setVoiceB(DEFAULT_VOICE_B);
        localStorage.setItem(STORAGE_KEY_VOICE_B, DEFAULT_VOICE_B);
      }

      const storedElevenKey = localStorage.getItem(STORAGE_KEY_ELEVEN_KEY);
      if (storedElevenKey) setElevenLabsApiKey(storedElevenKey);

      const storedEpisodes = localStorage.getItem(STORAGE_KEY_SAVED);
      if (storedEpisodes) {
        const parsed = JSON.parse(storedEpisodes);
        if (Array.isArray(parsed)) {
          setSavedEpisodes(parsed);
        }
      }
    } catch (e) {
      console.warn('Storage read error:', e);
    }
  }, []);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    try {
      if (key) {
        localStorage.setItem(STORAGE_KEY_API, key);
      } else {
        localStorage.removeItem(STORAGE_KEY_API);
      }
    } catch (e) {
      console.warn('Storage write error:', e);
    }
  };

  const handleSaveVoices = (newVoiceA: string, newVoiceB: string, newApiKey: string) => {
    setVoiceA(newVoiceA);
    setVoiceB(newVoiceB);
    setElevenLabsApiKey(newApiKey);
    try {
      localStorage.setItem(STORAGE_KEY_VOICE_A, newVoiceA);
      localStorage.setItem(STORAGE_KEY_VOICE_B, newVoiceB);
      localStorage.setItem(STORAGE_KEY_ELEVEN_KEY, newApiKey);
    } catch (e) {
      console.warn('Storage write error:', e);
    }

    // If an episode is currently active, update its host voice settings dynamically
    if (activeEpisode) {
      const updatedEpisode = {
        ...activeEpisode,
        hosts: {
          ...activeEpisode.hosts,
          hostA: { ...activeEpisode.hosts.hostA, elevenLabsVoiceId: newVoiceA },
          hostB: { ...activeEpisode.hosts.hostB, elevenLabsVoiceId: newVoiceB },
        },
      };
      setActiveEpisode(updatedEpisode);
    }
  };

  const handleSaveEpisode = (episode: PodcastEpisode) => {
    const exists = savedEpisodes.some((e) => e.id === episode.id);
    let updated: PodcastEpisode[];
    if (exists) {
      updated = savedEpisodes.filter((e) => e.id !== episode.id);
    } else {
      updated = [episode, ...savedEpisodes];
    }
    setSavedEpisodes(updated);
    try {
      localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(updated));
    } catch (e) {
      console.warn('Storage write error:', e);
    }
  };

  const handleDeleteEpisode = (id: string) => {
    const updated = savedEpisodes.filter((e) => e.id !== id);
    setSavedEpisodes(updated);
    try {
      localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(updated));
    } catch (e) {
      console.warn('Storage write error:', e);
    }
  };

  const handleLoadDemo = () => {
    // Attach current elevenlabs voices if configured
    const demo = {
      ...DEMO_EPISODE,
      hosts: {
        hostA: { ...DEMO_EPISODE.hosts.hostA, elevenLabsVoiceId: voiceA || undefined },
        hostB: { ...DEMO_EPISODE.hosts.hostB, elevenLabsVoiceId: voiceB || undefined },
      },
    };
    setActiveEpisode(demo);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenerate = async () => {
    if (images.length === 0) {
      setErrorMessage('Por favor sube al menos una imagen o apunte de estudio.');
      return;
    }

    setErrorMessage(null);
    setIsGenerating(true);

    const steps = [
      'Analizando material visual y fórmulas...',
      'Estructurando guion de diálogo educativo...',
      'Configurando voces de estudio y modulación...',
      'Generando puntos clave de evaluación...',
    ];

    let stepIndex = 0;
    setLoadingStepText(steps[0]);
    const stepInterval = setInterval(() => {
      stepIndex = (stepIndex + 1) % steps.length;
      setLoadingStepText(steps[stepIndex]);
    }, 2800);

    try {
      const response = await fetch('/api/generate-podcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          images,
          topic,
          vibe,
          apiKey: apiKey || undefined,
        }),
      });

      clearInterval(stepInterval);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400 && data.error?.includes('clave API')) {
          setIsApiKeyModalOpen(true);
        }
        throw new Error(data.error || 'Ocurrió un error al generar el episodio.');
      }

      if (!data.episode) {
        throw new Error('No se recibió el podcast generado.');
      }

      // Attach configured ElevenLabs voices
      const episodeWithVoices: PodcastEpisode = {
        ...data.episode,
        hosts: {
          hostA: { ...data.episode.hosts.hostA, elevenLabsVoiceId: voiceA || undefined },
          hostB: { ...data.episode.hosts.hostB, elevenLabsVoiceId: voiceB || undefined },
        },
      };

      setActiveEpisode(episodeWithVoices);
      handleSaveEpisode(episodeWithVoices);

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#ffffff', '#71717a', '#a1a1aa'],
        });
      } catch {}

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      clearInterval(stepInterval);
      setErrorMessage(
        err.message || 'No se pudo generar el podcast. Verifica tu conexión o API Key.'
      );
    } finally {
      setIsGenerating(false);
      setLoadingStepText('');
    }
  };

  const isCurrentSaved = activeEpisode
    ? savedEpisodes.some((e) => e.id === activeEpisode.id)
    : false;

  const hasElevenLabsVoices = Boolean(voiceA || voiceB);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-zinc-800 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onNewPodcast={() => setActiveEpisode(null)}
        onLoadDemo={handleLoadDemo}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        onOpenSavedModal={() => setIsSavedModalOpen(true)}
        savedCount={savedEpisodes.length}
        hasApiKey={Boolean(apiKey)}
        hasElevenLabsVoices={hasElevenLabsVoices}
        isPlayerActive={Boolean(activeEpisode)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {activeEpisode ? (
          /* Active Podcast Player View */
          <div className="space-y-6">
            <button
              onClick={() => setActiveEpisode(null)}
              className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver al Estudio / Cargar otras diapositivas</span>
            </button>

            <PodcastPlayer
              episode={activeEpisode}
              onSaveEpisode={handleSaveEpisode}
              isSaved={isCurrentSaved}
              onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
              elevenLabsApiKey={elevenLabsApiKey}
            />
          </div>
        ) : (
          /* Studio Creation View (DaVinci / Podbean Inspired) */
          <div className="space-y-12 max-w-4xl mx-auto">
            {/* Serious Hero Banner */}
            <div className="text-center space-y-4 pt-2 sm:pt-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-[11px] font-mono tracking-wider uppercase">
                <AudioWaveform className="w-3.5 h-3.5 text-zinc-300" />
                <span>Estudio de Audio con IA para Educación</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                Herramientas de podcast y síntesis de estudio con IA
              </h1>

              <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                Convierte diapositivas, textos y notas visuales en conversaciones de audio hiperrealistas en segundos.
                Domina cualquier tema complejo con narrativa inteligente, rigor académico y voces de alta fidelidad.
              </p>

              {/* ElevenLabs Quick Voice Badge / Configure */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsVoiceModalOpen(true)}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition-all active:scale-95 shadow-sm"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-violet-400" />
                  <span>
                    {hasElevenLabsVoices
                      ? 'Voces ElevenLabs Conectadas'
                      : 'Importar Voces ElevenLabs'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleLoadDemo}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-all active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Probar Demostración (Biología Celular)</span>
                </button>
              </div>
            </div>

            {/* Error Notification */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-start justify-between gap-3 shadow-md">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold block mb-0.5">Aviso del sistema:</strong>
                    <span>{errorMessage}</span>
                  </div>
                </div>
                <button
                  onClick={() => setErrorMessage(null)}
                  className="text-red-400 hover:text-white text-xs px-1"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Studio Workspace Section 1: Upload Images */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-zinc-800 text-zinc-300 font-mono font-bold text-xs flex items-center justify-center border border-zinc-700">
                  01
                </span>
                <h2 className="text-sm sm:text-base font-semibold text-white">
                  Material de Estudio &amp; Diapositivas
                </h2>
              </div>

              <ImageUploader
                images={images}
                onImagesChange={setImages}
                disabled={isGenerating}
              />
            </div>

            {/* Studio Workspace Section 2: Generation Setup */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-zinc-800 text-zinc-300 font-mono font-bold text-xs flex items-center justify-center border border-zinc-700">
                  02
                </span>
                <h2 className="text-sm sm:text-base font-semibold text-white">
                  Parámetros de Síntesis y Enfoque
                </h2>
              </div>

              <EpisodeConfig
                topic={topic}
                onTopicChange={setTopic}
                vibe={vibe}
                onVibeChange={setVibe}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                imageCount={images.length}
                loadingStepText={loadingStepText}
              />
            </div>

            {/* Studio Feature Highlights (Podbean style) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-zinc-900">
              <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-900 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 flex items-center justify-center shrink-0">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-200">Voces ElevenLabs</h4>
                  <p className="text-[11px] text-zinc-500 leading-relaxed mt-0.5">
                    Soporte para enlaces e IDs de voces de ElevenLabs Multilingual y síntesis nativa.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-900 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-200">Sincronización Visual</h4>
                  <p className="text-[11px] text-zinc-500 leading-relaxed mt-0.5">
                    La vista se actualiza automáticamente con la diapositiva en discusión en tiempo real.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-900 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-200">Evaluación y Puntos Clave</h4>
                  <p className="text-[11px] text-zinc-500 leading-relaxed mt-0.5">
                    Extracción estructurada de conceptos indispensables para exámenes académicos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Studio Footer */}
      <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-600 font-mono">
        <p>
          ChismeStudy Studio AI • Next.js &amp; Vercel Ready
        </p>
      </footer>

      {/* Modals */}
      <VoiceSettingsModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        voiceA={voiceA}
        voiceB={voiceB}
        elevenLabsApiKey={elevenLabsApiKey}
        onSave={handleSaveVoices}
      />

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKey={apiKey}
        onSaveKey={handleSaveApiKey}
      />

      <SavedEpisodesDrawer
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedEpisodes={savedEpisodes}
        onSelectEpisode={(ep) => setActiveEpisode(ep)}
        onDeleteEpisode={handleDeleteEpisode}
        onLoadDemo={handleLoadDemo}
      />
    </div>
  );
}
