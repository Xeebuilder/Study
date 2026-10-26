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
import { Sparkles, Coffee, AlertCircle, ArrowLeft, Headphones, CheckCircle, Brain, Volume2 } from 'lucide-react';

const STORAGE_KEY_API = 'chismestudy_gemini_api_key';
const STORAGE_KEY_SAVED = 'chismestudy_saved_episodes';

export default function Home() {
  const [apiKey, setApiKey] = useState<string>('');
  const [images, setImages] = useState<StudyImage[]>([]);
  const [topic, setTopic] = useState<string>('');
  const [vibe, setVibe] = useState<PodcastVibe>('puro-chisme');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [loadingStepText, setLoadingStepText] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [activeEpisode, setActiveEpisode] = useState<PodcastEpisode | null>(null);
  const [savedEpisodes, setSavedEpisodes] = useState<PodcastEpisode[]>([]);

  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);

  // Load API key and saved episodes from localStorage on mount
  useEffect(() => {
    try {
      const storedKey = localStorage.getItem(STORAGE_KEY_API);
      if (storedKey) setApiKey(storedKey);

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
    setActiveEpisode(DEMO_EPISODE);
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
      '🔍 Leyendo y analizando tus diapositivas con visión artificial...',
      '☕ Preparando el cafecito para Valeria y Mateo...',
      '🎭 Encontrando el drama y las analogías del chisme...',
      '📝 Redactando el guion educativo en español...',
      '💡 Extrayendo los puntos fijos para el examen...',
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

      setActiveEpisode(data.episode);

      // Save to saved list automatically
      handleSaveEpisode(data.episode);

      // Confetti celebratory burst!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f43f5e', '#fbbf24', '#a855f7'],
        });
      } catch {}

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      clearInterval(stepInterval);
      setErrorMessage(
        err.message || 'No se pudo generar el podcast. Verifica tu clave de API o conexión.'
      );
    } finally {
      setIsGenerating(false);
      setLoadingStepText('');
    }
  };

  const isCurrentSaved = activeEpisode
    ? savedEpisodes.some((e) => e.id === activeEpisode.id)
    : false;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-rose-500/30 selection:text-rose-200">
      {/* Top Navbar */}
      <Navbar
        onNewPodcast={() => setActiveEpisode(null)}
        onLoadDemo={handleLoadDemo}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenSavedModal={() => setIsSavedModalOpen(true)}
        savedCount={savedEpisodes.length}
        hasApiKey={Boolean(apiKey)}
        isPlayerActive={Boolean(activeEpisode)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeEpisode ? (
          /* Active Podcast Player View */
          <div className="space-y-6">
            <button
              onClick={() => setActiveEpisode(null)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors px-3 py-1.5 rounded-xl bg-neutral-900/60 border border-neutral-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a subir diapositivas / Crear otro podcast</span>
            </button>

            <PodcastPlayer
              episode={activeEpisode}
              onSaveEpisode={handleSaveEpisode}
              isSaved={isCurrentSaved}
            />
          </div>
        ) : (
          /* Studio Creation View */
          <div className="space-y-10 max-w-4xl mx-auto">
            {/* Hero Banner */}
            <div className="text-center space-y-4 pt-4 sm:pt-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                <Coffee className="w-3.5 h-3.5 text-amber-400" />
                <span>Estudia con el chisme y aprueba tu examen</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                Convierte tus apuntes en un{' '}
                <span className="bg-gradient-to-r from-amber-300 via-rose-400 to-pink-500 bg-clip-text text-transparent">
                  podcast de chisme
                </span>{' '}
                en español 🎙️
              </h1>

              <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                Sube fotos de tus diapositivas o libro. Valeria y Mateo te sueltan la sopa
                con todo el drama de una telenovela pero con los datos exactos que necesitas para memorizarlo todo.
              </p>

              {/* Quick Demo CTA */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleLoadDemo}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-200 transition-all hover:scale-105 active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>¿Tienes prisa? Escucha el Demo: Fotosíntesis vs Mitocondria 🍃⚡</span>
                </button>
              </div>
            </div>

            {/* Error Notification */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-red-950/60 border border-red-500/50 text-red-200 text-sm flex items-start justify-between gap-3 shadow-lg">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold block mb-0.5">Atención:</strong>
                    <span>{errorMessage}</span>
                  </div>
                </div>
                <button
                  onClick={() => setErrorMessage(null)}
                  className="text-red-400 hover:text-white text-xs px-2 py-1"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Step 1: Upload Images */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-rose-500 text-white font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Sube tus diapositivas o fotos del tema
                </h2>
              </div>

              <ImageUploader
                images={images}
                onImagesChange={setImages}
                disabled={isGenerating}
              />
            </div>

            {/* Step 2: Configure Tone & Generate */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Elige el tono de chisme y genera
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

            {/* Feature Highlights Footer Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-neutral-900">
              <div className="p-4 rounded-2xl bg-neutral-900/30 border border-neutral-900 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-200">Doble Voz en Español</h4>
                  <p className="text-[11px] text-neutral-400 leading-relaxed mt-0.5">
                    Conversación natural entre Valeria y Mateo con voces diferenciadas y sincronizadas.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-900/30 border border-neutral-900 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-200">Diapositivas en Vivo</h4>
                  <p className="text-[11px] text-neutral-400 leading-relaxed mt-0.5">
                    La pantalla muestra automáticamente la diapositiva exacta de la que están hablando.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-900/30 border border-neutral-900 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-200">Puntos para el Examen</h4>
                  <p className="text-[11px] text-neutral-400 leading-relaxed mt-0.5">
                    Acordeón con los datos clave, mnemotecnias y tips para responder preguntas fijas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-6 text-center text-xs text-neutral-500">
        <p>
          ChismeStudy ☕🎙️ • Tu compañero de estudio en español listo para desplegar en Vercel.
        </p>
      </footer>

      {/* Modals */}
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
