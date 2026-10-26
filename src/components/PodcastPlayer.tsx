'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PodcastEpisode, DialogueLine } from '@/types/podcast';
import { PodcastAudioEngine } from '@/lib/speech';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Maximize2,
  Volume2,
  Bookmark,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Copy,
  AudioWaveform,
  SlidersHorizontal,
  Headphones,
} from 'lucide-react';
import { TranscriptView } from './TranscriptView';
import { KeyTakeaways } from './KeyTakeaways';

interface PodcastPlayerProps {
  episode: PodcastEpisode;
  onSaveEpisode?: (episode: PodcastEpisode) => void;
  isSaved?: boolean;
  onOpenVoiceModal?: () => void;
  elevenLabsApiKey?: string;
}

export function PodcastPlayer({
  episode,
  onSaveEpisode,
  isSaved,
  onOpenVoiceModal,
  elevenLabsApiKey,
}: PodcastPlayerProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [activeTab, setActiveTab] = useState<'transcript' | 'takeaways'>('transcript');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [manualSlideIndex, setManualSlideIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const engineRef = useRef<PodcastAudioEngine | null>(null);

  useEffect(() => {
    const engine = new PodcastAudioEngine(
      episode.dialogue,
      episode.hosts,
      {
        onLineChange: (index) => {
          setCurrentLineIndex(index);
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
      },
      elevenLabsApiKey
    );

    engineRef.current = engine;

    return () => {
      engine.stop();
    };
  }, [episode, elevenLabsApiKey]);

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
      {/* Studio Master Header Card */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono uppercase bg-zinc-900 text-zinc-300 border border-zinc-800">
                {episode.topic}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono uppercase bg-zinc-900 text-zinc-400 border border-zinc-800">
                Canal Dual • Español
              </span>
              <span className="text-[11px] text-zinc-500 font-mono">
                ~{episode.durationMinutesEstimate} min
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
              {episode.title}
            </h1>
            <p className="text-xs text-zinc-400">
              {episode.subtitle}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {onOpenVoiceModal && (
              <button
                onClick={onOpenVoiceModal}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-all"
                title="Configurar voces de ElevenLabs"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Voces</span>
              </button>
            )}

            {onSaveEpisode && (
              <button
                onClick={() => onSaveEpisode(episode)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isSaved
                    ? 'bg-zinc-800 text-zinc-200 border border-zinc-700'
                    : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isSaved ? 'Guardado' : 'Guardar'}</span>
              </button>
            )}

            <button
              onClick={handleCopyTranscript}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-all active:scale-95"
              title="Copiar texto del guion"
            >
              <Copy className="w-3.5 h-3.5 text-zinc-400" />
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
          </div>
        </div>

        {/* Studio Host Decks & Waveform Center */}
        <div className="relative mt-8 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* Host A (Valeria) */}
          <div
            className={`md:col-span-3 p-4 rounded-xl border transition-all duration-300 flex items-center gap-3.5 ${
              currentLine?.speaker === 'hostA' && isPlaying && !isPaused
                ? 'bg-zinc-900 border-zinc-500 shadow-md ring-1 ring-zinc-500/40'
                : 'bg-zinc-900/50 border-zinc-800/80 opacity-70'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-lg shrink-0">
              <Headphones className="w-5 h-5 text-zinc-300" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <h3 className="font-semibold text-xs text-white truncate">
                  {episode.hosts.hostA.name}
                </h3>
                {currentLine?.speaker === 'hostA' && isPlaying && !isPaused && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-zinc-800 text-zinc-200 border border-zinc-700">
                    EN VIVO
                  </span>
                )}
              </div>
              <p className="text-[11px] text-zinc-400 truncate">
                Conductora A • Indagación
              </p>
            </div>
          </div>

          {/* Center Soundwave Visualizer (Podbean / DaVinci style) */}
          <div className="md:col-span-6 flex flex-col items-center justify-center space-y-3 py-2 bg-zinc-900/40 rounded-xl border border-zinc-800/80 px-4">
            <div className="flex items-center justify-center gap-1 h-12 w-full max-w-sm">
              {[30, 60, 45, 80, 55, 90, 40, 95, 65, 85, 50, 75, 50, 35, 70, 45, 80].map((height, i) => (
                <span
                  key={i}
                  style={{
                    height: isPlaying && !isPaused
                      ? `${Math.max(15, (height * (0.6 + Math.sin(i * 1.5) * 0.4)))}%`
                      : '15%',
                    transition: 'height 120ms ease-in-out',
                  }}
                  className={`w-1 rounded-full ${
                    currentLine?.speaker === 'hostA'
                      ? 'bg-zinc-300'
                      : 'bg-zinc-400'
                  }`}
                />
              ))}
            </div>

            <div className="text-center w-full px-2">
              <span className="text-xs font-medium text-zinc-300 line-clamp-1 font-sans">
                {isPlaying
                  ? `"${currentLine?.text || '...'}"`
                  : 'Listo para reproducir la sesión de estudio'}
              </span>
            </div>
          </div>

          {/* Host B (Mateo) */}
          <div
            className={`md:col-span-3 p-4 rounded-xl border transition-all duration-300 flex items-center gap-3.5 ${
              currentLine?.speaker === 'hostB' && isPlaying && !isPaused
                ? 'bg-zinc-900 border-zinc-500 shadow-md ring-1 ring-zinc-500/40'
                : 'bg-zinc-900/50 border-zinc-800/80 opacity-70'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-lg shrink-0">
              <Headphones className="w-5 h-5 text-zinc-300" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <h3 className="font-semibold text-xs text-white truncate">
                  {episode.hosts.hostB.name}
                </h3>
                {currentLine?.speaker === 'hostB' && isPlaying && !isPaused && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-zinc-800 text-zinc-200 border border-zinc-700">
                    EN VIVO
                  </span>
                )}
              </div>
              <p className="text-[11px] text-zinc-400 truncate">
                Conductor B • Explicación
              </p>
            </div>
          </div>
        </div>

        {/* Master Transport Bar */}
        <div className="mt-8 pt-6 border-t border-zinc-800/80 space-y-4">
          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden cursor-pointer">
              <div
                className="bg-zinc-200 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
              <span>
                Línea {currentLineIndex + 1} / {episode.dialogue.length}
              </span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Speed selector */}
            <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
              {[0.75, 1.0, 1.25, 1.5].map((s) => (
                <button
                  key={s}
                  onClick={() => handleSpeedChange(s)}
                  className={`px-2 py-1 rounded-md text-xs font-mono font-medium transition-all ${
                    speed === s
                      ? 'bg-zinc-100 text-zinc-950'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevLine}
                disabled={currentLineIndex === 0}
                className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 disabled:opacity-30 border border-zinc-800 transition-colors"
                title="Línea anterior"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={togglePlay}
                className="p-3.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 shadow-md transition-all active:scale-95"
                title={isPlaying && !isPaused ? 'Pausar' : 'Reproducir'}
              >
                {isPlaying && !isPaused ? (
                  <Pause className="w-5 h-5 fill-zinc-950" />
                ) : (
                  <Play className="w-5 h-5 fill-zinc-950 translate-x-0.5" />
                )}
              </button>

              <button
                onClick={handleNextLine}
                disabled={currentLineIndex >= episode.dialogue.length - 1}
                className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 disabled:opacity-30 border border-zinc-800 transition-colors"
                title="Siguiente línea"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                onClick={handleStop}
                className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
                title="Reiniciar"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Slide Quick Indicator */}
            {currentSlide && (
              <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>SLIDE {currentReferencedSlideIndex + 1} ACTIVA</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Workspace: Synchronized Slide Left, Studio Tabs Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Slide Viewer */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono flex items-center gap-2">
              <span>Referencia Visual</span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-300 border border-zinc-800">
                Sincronizada
              </span>
            </h3>

            {episode.images.length > 1 && (
              <div className="flex items-center gap-1 text-xs">
                <button
                  onClick={() =>
                    setManualSlideIndex(
                      Math.max(0, currentReferencedSlideIndex - 1)
                    )
                  }
                  disabled={currentReferencedSlideIndex === 0}
                  className="p-1 rounded-md bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 text-zinc-300 border border-zinc-800"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] text-zinc-400 px-1 font-mono">
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
                  className="p-1 rounded-md bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 text-zinc-300 border border-zinc-800"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {currentSlide ? (
            <div className="relative group rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 aspect-4/3 flex items-center justify-center shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentSlide.dataUrl}
                alt={currentSlide.name}
                className="w-full h-full object-contain p-2"
              />

              <button
                onClick={() => setLightboxImage(currentSlide.dataUrl)}
                className="absolute bottom-3 right-3 p-2 rounded-xl bg-zinc-900/90 text-zinc-200 border border-zinc-700 opacity-80 group-hover:opacity-100 hover:scale-105 transition-all shadow-md"
                title="Ampliar diapositiva"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/85 backdrop-blur-md border border-zinc-800 text-[11px] font-mono text-zinc-300">
                SLIDE {currentReferencedSlideIndex + 1}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-800 p-8 text-center text-xs text-zinc-500 font-mono">
              Sin material visual adjunto
            </div>
          )}
        </div>

        {/* Studio Transcript & Takeaways */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
            <button
              onClick={() => setActiveTab('transcript')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'transcript'
                  ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Guion en Vivo</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-zinc-900 text-zinc-400">
                {episode.dialogue.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('takeaways')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'takeaways'
                  ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Puntos Clave para el Examen</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-zinc-900 text-zinc-400">
                {episode.keyTakeaways.length}
              </span>
            </button>
          </div>

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
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl border border-zinc-700"
            />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-10 right-0 px-3 py-1 rounded-full bg-zinc-800 text-xs font-semibold text-white hover:bg-zinc-700"
            >
              Cerrar ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
