'use client';

import React from 'react';
import { PodcastVibe } from '@/types/podcast';
import { Coffee, Users, HelpCircle, Zap, Sparkles, Loader2 } from 'lucide-react';

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
    color: string;
  }> = [
    {
      id: 'puro-chisme',
      title: 'El Puro Chisme ☕',
      tagline: '¡Amiga, no sabes el escándalo! Telenovela dramática pero con datos 100% reales para el examen.',
      icon: <Coffee className="w-5 h-5 text-amber-400" />,
      badge: 'El Favorito 🔥',
      color: 'border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-200',
    },
    {
      id: 'estudio-relajado',
      title: 'Compañeros de Estudio 👯',
      tagline: 'Buena onda, dos amigos estudiando en la cafetería con preguntas directas y analogías cotidianas.',
      icon: <Users className="w-5 h-5 text-rose-400" />,
      badge: 'Tranqui & Chill',
      color: 'border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-200',
    },
    {
      id: 'el-esceptico',
      title: 'El Escéptico & El Cerebro 🧠',
      tagline: 'Uno cuestiona por qué tenemos que aprender esto y el otro se lo demuestra con lógica impecable.',
      icon: <HelpCircle className="w-5 h-5 text-purple-400" />,
      badge: 'Debate Lógico',
      color: 'border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 text-purple-200',
    },
    {
      id: 'repaso-expres',
      title: 'Repaso Exprés / Examen Mañana ⚡',
      tagline: 'Rápido, dinámico, mnemotecnias, trampas comunes y datos fijos que siempre vienen en el examen.',
      icon: <Zap className="w-5 h-5 text-emerald-400" />,
      badge: 'Salvavidas 🚨',
      color: 'border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-200',
    },
  ];

  return (
    <div className="w-full space-y-6 bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 sm:p-6 backdrop-blur-sm">
      {/* Topic / Focus input */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
          ¿En qué quieres que se enfoquen? (Opcional)
        </label>
        <input
          type="text"
          value={topic}
          onChange={(e) => onTopicChange(e.target.value)}
          placeholder="Ej: Ciclo de Krebs, causas de la Segunda Guerra Mundial, o déjalo vacío para que la IA lo descubra..."
          disabled={isGenerating}
          className="w-full px-4 py-2.5 rounded-xl bg-neutral-950/80 border border-neutral-800 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm text-neutral-200 placeholder-neutral-500 transition-all outline-none"
        />
      </div>

      {/* Vibe Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
            Elige el estilo de conversación
          </label>
          <span className="text-[11px] text-neutral-400">Todo se genera en español</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {vibes.map((item) => {
            const isSelected = vibe === item.id;
            return (
              <div
                key={item.id}
                onClick={() => !isGenerating && onVibeChange(item.id)}
                className={`relative p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? `${item.color} ring-2 ring-rose-500/60 shadow-lg shadow-rose-950/30 scale-[1.01]`
                    : 'border-neutral-800 bg-neutral-950/40 hover:bg-neutral-900/60 text-neutral-400 hover:text-neutral-200'
                } ${isGenerating ? 'pointer-events-none opacity-60' : ''}`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <h4 className="font-semibold text-sm text-neutral-100">{item.title}</h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 shrink-0">
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed pl-7">
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
          className={`w-full py-4 px-6 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-xl ${
            imageCount === 0
              ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700'
              : isGenerating
              ? 'bg-rose-950 text-rose-300 border border-rose-500/40 cursor-wait'
              : 'bg-gradient-to-r from-rose-500 via-pink-600 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white shadow-rose-600/30 hover:scale-[1.01] active:scale-[0.99]'
          }`}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-rose-300" />
              <span>{loadingStepText || 'Generando el chisme de estudio...'}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>
                {imageCount === 0
                  ? 'Sube al menos 1 imagen para generar'
                  : `Generar Podcast con ${imageCount} diapositiva${imageCount > 1 ? 's' : ''} 🎙️`}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
