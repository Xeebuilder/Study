'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { PodcastEpisode, DialogueLine, HostPersona } from '@/types/podcast';
import { PodcastAudioEngine } from '@/lib/speech';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Maximize2,
  Volume2,
  Share2,
  Download,
  BookOpen,
  MessageSquare,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Copy,
} from 'lucide-react';
import { TranscriptView } from './TranscriptView';
import { KeyTakeaways } from './KeyTakeaways';

interface PodcastPlayerProps {
  episode: PodcastEpisode;
  onSaveEpisode?: (episode: PodcastEpisode) => void;
  isSaved?: boolean;
}

export function PodcastPlayer({ episode, onSaveEpisode, isSaved }: PodcastPlayerProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [activeTab, setActiveTab] = useState<'transcript' | 'takeaways'>('transcript');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [manualSlideIndex, setManualSlideIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const engineRef = useRef<PodcastAudioEngine | null>(null);

  // Initialize audio engine
  useEffect(() => {
    const engine = new PodcastAudioEngine(
      episode.dialogue,
      episode.hosts,
      {
        onLineChange: (index) => {
          setCurrentLineIndex(index);
          // Reset manual slide override when dialogue line advances naturally
          setManualSlideIndex(null);
        },
        onStateChange: (playing, paused) => {
          setIsPlaying(playing);
          setIsPaused(paused);
        },
        onPlaybackEnd: () => {
          setIsPlaying(false);
          setIsPaused(false);
        },
      }
    );

    engineRef.current = engine;

    return () => {
      engine.stop();
    };
  }, [episode]);

  // Handle play / pause toggle
  const togglePlay = () => {
    if (!engineRef.current) return;
    if (isPlaying && !isPaused) {
      engineRef.current.pause();
    } else if (isPaused) {
      engineRef.current.resume();
    } else {
      engineRef.current.play(currentLineIndex);
    }
  };

  const handleStop = () => {
    if (!engineRef.current) return;
    engineRef.current.stop();
    setCurrentLineIndex(0);
  };

  const handlePrevLine = () => {
    if (!engineRef.current) return;
    const target = Math.max(0, currentLineIndex - 1);
    engineRef.current.jumpToLine(target);
    setCurrentLineIndex(target);
  };

  const handleNextLine = () => {
    if (!engineRef.current) return;
    const target = Math.min(episode.dialogue.length - 1, currentLineIndex + 1);
    engineRef.current.jumpToLine(target);
    setCurrentLineIndex(target);
  };

  const handleJumpToLine = (index: number) => {
    if (!engineRef.current) return;
    engineRef.current.jumpToLine(index);
    setCurrentLineIndex(index);
    if (!isPlaying) {
      engineRef.current.play(index);
    }
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (engineRef.current) {
      engineRef.current.setSpeed(newSpeed);
    }
  };

  const currentLine: DialogueLine | undefined = episode.dialogue[currentLineIndex];

  // Current active slide index (dialogue referenced or manual override)
  const currentReferencedSlideIndex =
    manualSlideIndex !== null
      ? manualSlideIndex
      : currentLine?.referencedImageIndex ?? 0;

  const currentSlide = episode.images[currentReferencedSlideIndex] || episode.images[0];

  const handleCopyTranscript = () => {
    const text = episode.dialogue
      .map((l) => `${l.speakerName}: ${l.text}`)
      .join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const progressPercent = episode.dialogue.length > 0
    ? ((currentLineIndex + 1) / episode.dialogue.length) * 100
    : 0;

  return (
    <div className="w-full space-y-6">
      {/* Top Episode Header Card */}
      <div className="relative overflow-hidden rounded-3xl border border-rose-900/40 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                🎙️ {episode.topic}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                ☕ {episode.vibe === 'puro-chisme' ? 'Puro Chisme' : episode.vibe}
              </span>
              <span className="text-xs text-neutral-400">
                ~{episode.durationMinutesEstimate} min de estudio
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {episode.title}
            </h1>
            <p className="text-sm text-neutral-300 italic">
              &ldquo;{episode.subtitle}&rdquo;
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {onSaveEpisode && (
              <button
                onClick={() => onSaveEpisode(episode)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isSaved
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-600/30'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSaved ? 'Guardado en tu biblioteca' : 'Guardar episodio'}</span>
              </button>
            )}

            <button
              onClick={handleCopyTranscript}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-all active:scale-95"
              title="Copiar texto del guion"
            >
              <Copy className="w-4 h-4 text-neutral-400" />
              <span>{copied ? '¡Copiado!' : 'Copiar Guion'}</span>
            </button>
          </div>
        </div>

        {/* Visualizer & Hosts Stage */}
        <div className="relative mt-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Host A (Valeria) */}
          <div
            className={`md:col-span-3 p-4 rounded-2xl border transition-all duration-300 flex items-center gap-3.5 ${
              currentLine?.speaker === 'hostA' && isPlaying && !isPaused
                ? 'bg-rose-950/60 border-rose-500 ring-2 ring-rose-500/50 shadow-xl shadow-rose-950/50 scale-[1.02]'
                : 'bg-neutral-900/60 border-neutral-800 opacity-80'
            }`}
          >
            <div className="relative text-3xl sm:text-4xl select-none">
              {episode.hosts.hostA.avatar}
              {currentLine?.speaker === 'hostA' && isPlaying && !isPaused && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                </span>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-white truncate">
                  {episode.hosts.hostA.name}
                </h3>
                {currentLine?.speaker === 'hostA' && isPlaying && !isPaused && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-rose-500/30 text-rose-300 font-semibold uppercase">
                    Hablando
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-400 truncate">
                {episode.hosts.hostA.role}
              </p>
            </div>
          </div>

          {/* Center Soundwave Visualizer */}
          <div className="md:col-span-6 flex flex-col items-center justify-center space-y-3 py-2">
            <div className="flex items-center justify-center gap-1.5 h-12 w-full max-w-xs">
              {[40, 75, 55, 90, 65, 80, 45, 95, 70, 85, 50, 90, 60, 40].map((height, i) => (
                <span
                  key={i}
                  style={{
                    height: isPlaying && !isPaused ? `${Math.max(15, (height * (0.6 + Math.sin(i * 1.5) * 0.4)))}%` : '18%',
                    transition: 'height 150ms ease-in-out',
                  }}
                  className={`w-1.5 rounded-full ${
                    currentLine?.speaker === 'hostA'
                      ? 'bg-gradient-to-t from-rose-500 to-pink-300'
                      : 'bg-gradient-to-t from-amber-500 to-yellow-300'
                  }`}
                />
              ))}
            </div>

            {/* Currently speaking live line badge */}
            <div className="text-center px-4">
              <span className="text-xs font-medium text-neutral-300 line-clamp-1 italic">
                {isPlaying
                  ? `"${currentLine?.text || '...'}"`
                  : 'Presiona reproducir para comenzar el chisme de estudio'}
              </span>
            </div>
          </div>

          {/* Host B (Mateo) */}
          <div
            className={`md:col-span-3 p-4 rounded-2xl border transition-all duration-300 flex items-center gap-3.5 ${
              currentLine?.speaker === 'hostB' && isPlaying && !isPaused
                ? 'bg-amber-950/60 border-amber-500 ring-2 ring-amber-500/50 shadow-xl shadow-amber-950/50 scale-[1.02]'
                : 'bg-neutral-900/60 border-neutral-800 opacity-80'
            }`}
          >
            <div className="relative text-3xl sm:text-4xl select-none">
              {episode.hosts.hostB.avatar}
              {currentLine?.speaker === 'hostB' && isPlaying && !isPaused && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-white truncate">
                  {episode.hosts.hostB.name}
                </h3>
                {currentLine?.speaker === 'hostB' && isPlaying && !isPaused && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-500/30 text-amber-300 font-semibold uppercase">
                    Hablando
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-400 truncate">
                {episode.hosts.hostB.role}
              </p>
            </div>
          </div>
        </div>

        {/* Player Controls Bar */}
        <div className="mt-8 pt-6 border-t border-neutral-800/80 space-y-4">
          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden cursor-pointer">
              <div
                className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-neutral-400">
              <span>
                Línea {currentLineIndex + 1} de {episode.dialogue.length}
              </span>
              <span>
                {Math.round(progressPercent)}% completado
              </span>
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Speed pills */}
            <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
              {[0.75, 1.0, 1.25, 1.5].map((s) => (
                <button
                  key={s}
                  onClick={() => handleSpeedChange(s)}
                  className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                    speed === s
                      ? 'bg-rose-500 text-white'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            {/* Central playback buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrevLine}
                disabled={currentLineIndex === 0}
                className="p-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 disabled:opacity-40 disabled:hover:bg-neutral-900 transition-colors"
                title="Línea anterior"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={togglePlay}
                className="p-4 rounded-full bg-gradient-to-tr from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-lg shadow-rose-600/30 transition-transform active:scale-95"
                title={isPlaying && !isPaused ? 'Pausar' : 'Reproducir'}
              >
                {isPlaying && !isPaused ? (
                  <Pause className="w-6 h-6 fill-white" />
                ) : (
                  <Play className="w-6 h-6 fill-white translate-x-0.5" />
                )}
              </button>

              <button
                onClick={handleNextLine}
                disabled={currentLineIndex >= episode.dialogue.length - 1}
                className="p-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 disabled:opacity-40 disabled:hover:bg-neutral-900 transition-colors"
                title="Siguiente línea"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                onClick={handleStop}
                className="p-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-rose-400 transition-colors"
                title="Reiniciar desde el inicio"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Slide Quick Indicator */}
            {currentSlide && (
              <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  Viendo: <strong className="text-neutral-200">Diapositiva {currentReferencedSlideIndex + 1}</strong>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area: Synchronized Slide on Left, Tabs on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Synchronized Slide / Image Viewer */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
              <span>🖼️ Diapositiva en Discusión</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Sincronizada en vivo
              </span>
            </h3>

            {/* Slide Navigation arrows if multiple images */}
            {episode.images.length > 1 && (
              <div className="flex items-center gap-1 text-xs">
                <button
                  onClick={() =>
                    setManualSlideIndex(
                      Math.max(0, currentReferencedSlideIndex - 1)
                    )
                  }
                  disabled={currentReferencedSlideIndex === 0}
                  className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 text-neutral-300"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] text-neutral-400 px-1 font-mono">
                  {currentReferencedSlideIndex + 1}/{episode.images.length}
                </span>
                <button
                  onClick={() =>
                    setManualSlideIndex(
                      Math.min(
                        episode.images.length - 1,
                        currentReferencedSlideIndex + 1
                      )
                    )
                  }
                  disabled={
                    currentReferencedSlideIndex >= episode.images.length - 1
                  }
                  className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 text-neutral-300"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {currentSlide ? (
            <div className="relative group rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900/80 aspect-4/3 flex items-center justify-center shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentSlide.dataUrl}
                alt={currentSlide.name}
                className="w-full h-full object-contain p-2"
              />

              {/* Zoom Button */}
              <button
                onClick={() => setLightboxImage(currentSlide.dataUrl)}
                className="absolute bottom-3 right-3 p-2 rounded-xl bg-neutral-950/80 backdrop-blur-sm text-neutral-200 border border-neutral-700 opacity-80 group-hover:opacity-100 hover:scale-105 transition-all shadow-md"
                title="Ampliar diapositiva en grande"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Current Slide Info Overlay */}
              <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-neutral-950/85 backdrop-blur-sm border border-neutral-800 text-xs font-semibold text-amber-300 shadow">
                Diapositiva {currentReferencedSlideIndex + 1}: {currentSlide.name}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-neutral-800 p-8 text-center text-xs text-neutral-500">
              No hay imágenes en este episodio.
            </div>
          )}

          {/* Quick Note about sync */}
          <p className="text-[11px] text-neutral-400 italic">
            💡 La pantalla cambia automáticamente a la diapositiva que Valeria y Mateo están comentando. Haz clic en la lupa para agrandar.
          </p>
        </div>

        {/* Right: Tabs (Live Transcript Karaoke / Key Takeaways) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
            <button
              onClick={() => setActiveTab('transcript')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'transcript'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Guion en Vivo (Chisme Karaoke)</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-800 text-neutral-300">
                {episode.dialogue.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('takeaways')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'takeaways'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Puntos Clave para el Examen</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-800 text-neutral-300">
                {episode.keyTakeaways.length}
              </span>
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'transcript' ? (
            <TranscriptView
              dialogue={episode.dialogue}
              currentLineIndex={currentLineIndex}
              onSelectLine={handleJumpToLine}
              isPlaying={isPlaying && !isPaused}
              images={episode.images}
            />
          ) : (
            <KeyTakeaways takeaways={episode.keyTakeaways} />
          )}
        </div>
      </div>

      {/* Lightbox Modal for Fullscreen Image View */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxImage}
              alt="Diapositiva ampliada"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl border border-neutral-700"
            />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-10 right-0 px-3 py-1 rounded-full bg-neutral-800 text-xs font-semibold text-white hover:bg-neutral-700"
            >
              Cerrar ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
