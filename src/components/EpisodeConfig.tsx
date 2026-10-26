'use client';

import React from 'react';
import { PodcastVibe } from '@/types/podcast';
import { Sparkles, Loader2, MessageSquare, BookOpen, Brain, Zap } from 'lucide-react';

interface EpisodeConfigProps {
  topic: string;
  onTopicChange: (topic: string) => void;
  vibe: PodcastVibe;
  onVibeChange: (vibe: PodcastVibe) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  imageCount: number;
  loadingStepText?: string;
}

export function EpisodeConfig({
  topic,
  onTopicChange,
  vibe,
  onVibeChange,
  onGenerate,
  isGenerating,
  imageCount,
  loadingStepText,
}: EpisodeConfigProps) {
  const vibes: Array<{
    id: PodcastVibe;
    title: string;
    tagline: string;
    icon: React.ReactNode;
    badge: string;
  }> = [
    {
      id: 'puro-chisme',
      title: 'Narrativa Conversacional ("El Chisme")',
      tagline: 'Analogías vivas, drama educativo y narrativa cautivadora que hace que cada concepto se vuelva inolvidable.',
      icon: <MessageSquare className="w-4 h-4 text-zinc-300" />,
      badge: 'Recomendado',
    },
    {
      id: 'estudio-relajado',
      title: 'Estudio Colaborativo',
      tagline: 'Tono amigable y equilibrado entre dos compañeros de estudio explicando dudas frecuentes con claridad.',
      icon: <BookOpen className="w-4 h-4 text-zinc-300" />,
      badge: 'Equilibrado',
    },
    {
      id: 'el-esceptico',
      title: 'Debate Crítico & Demostración',
      tagline: 'Uno cuestiona la lógica y plantea dudas difíciles, mientras el otro demuestra los fundamentos con rigor.',
      icon: <Brain className="w-4 h-4 text-zinc-300" />,
      badge: 'Analítico',
    },
    {
      id: 'repaso-expres',
      title: 'Síntesis de Alto Rendimiento',
      tagline: 'Enfoque directo al grano: preguntas fijas de examen, mnemotecnias y conceptos esenciales.',
      icon: <Zap className="w-4 h-4 text-zinc-300" />,
      badge: 'Rápido',
    },
  ];

  return (
    <div className="w-full space-y-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 sm:p-7 backdrop-blur-xl">
      {/* Focus input */}
      <div className="space-y-2">
        <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 font-mono">
          Enfoque o tema específico (Opcional)
        </label>
        <input
          type="text"
          value={topic}
          onChange={(e) => onTopicChange(e.target.value)}
          placeholder="Ej: Fisiología celular, Ciclo de Calvin, o dejar vacío para auto-detección con IA..."
          disabled={isGenerating}
          className="w-full px-4 py-3 rounded-xl bg-zinc-950/80 border border-zinc-800 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-all"
        />
      </div>

      {/* Style selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 font-mono">
            Modalidad de Síntesis
          </label>
          <span className="text-[11px] text-zinc-500 font-mono">Español Multilingual</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {vibes.map((item) => {
            const isSelected = vibe === item.id;
            return (
              <div
                key={item.id}
                onClick={() => !isGenerating && onVibeChange(item.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-zinc-300 bg-zinc-800/80 text-white shadow-md'
                    : 'border-zinc-800/80 bg-zinc-950/50 hover:bg-zinc-900/70 text-zinc-400 hover:text-zinc-200'
                } ${isGenerating ? 'pointer-events-none opacity-50' : ''}`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <h4 className="font-semibold text-xs text-zinc-100">{item.title}</h4>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                    isSelected ? 'bg-zinc-900 text-zinc-200' : 'bg-zinc-900 text-zinc-500'
                  }`}>
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {item.tagline}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Generate Action Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onGenerate}
          disabled={isGenerating || imageCount === 0}
          className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 transition-all shadow-md ${
            imageCount === 0
              ? 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'
              : isGenerating
              ? 'bg-zinc-800 text-zinc-300 border border-zinc-700 cursor-wait'
              : 'bg-white hover:bg-zinc-200 text-zinc-950 active:scale-[0.99]'
          }`}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
              <span>{loadingStepText || 'Procesando síntesis de podcast...'}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-zinc-900" />
              <span>
                {imageCount === 0
                  ? 'Sube al menos 1 diapositiva para comenzar'
                  : `Generar Podcast con ${imageCount} diapositiva${imageCount > 1 ? 's' : ''}`}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
