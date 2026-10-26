'use client';

import React, { useEffect, useRef } from 'react';
import { DialogueLine, StudyImage } from '@/types/podcast';
import { Play, Volume2 } from 'lucide-react';

interface TranscriptViewProps {
  dialogue: DialogueLine[];
  currentLineIndex: number;
  onSelectLine: (index: number) => void;
  isPlaying: boolean;
  images: StudyImage[];
}

export function TranscriptView({
  dialogue,
  currentLineIndex,
  onSelectLine,
  isPlaying,
  images,
}: TranscriptViewProps) {
  const activeLineRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll the active line into view smoothly
  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [currentLineIndex]);

  const emotionEmojis: Record<string, string> = {
    chismoso: '🍵 Chisme',
    sorprendido: '😲 ¡Quééé!',
    riendo: '😂 Ja, ja',
    explicando: '💡 Datazo',
    dudoso: '🤨 ¿Seguro?',
    enfatico: '🔥 Ojo aquí',
  };

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4 max-h-[560px] overflow-y-auto space-y-3 custom-scrollbar">
      {dialogue.map((line, idx) => {
        const isActive = idx === currentLineIndex;
        const isHostA = line.speaker === 'hostA';

        return (
          <div
            key={line.id || idx}
            ref={isActive ? activeLineRef : null}
            onClick={() => onSelectLine(idx)}
            className={`group relative p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer ${
              isActive
                ? isHostA
                  ? 'bg-rose-950/40 border-rose-500/80 ring-1 ring-rose-500/50 shadow-md shadow-rose-950/40'
                  : 'bg-amber-950/40 border-amber-500/80 ring-1 ring-amber-500/50 shadow-md shadow-amber-950/40'
                : 'bg-neutral-950/50 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900/60'
            }`}
          >
            {/* Header info */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl select-none">
                  {isHostA ? '👩🏻‍🦰' : '👨🏻‍🏫'}
                </span>
                <span
                  className={`text-xs font-bold ${
                    isHostA ? 'text-rose-300' : 'text-amber-300'
                  }`}
                >
                  {line.speakerName}
                </span>

                {/* Emotion Badge */}
                {line.emotion && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800/90 text-neutral-300 font-medium">
                    {emotionEmojis[line.emotion] || line.emotion}
                  </span>
                )}
              </div>

              {/* Badges: referenced slide and play indicator */}
              <div className="flex items-center gap-2">
                {typeof line.referencedImageIndex === 'number' &&
                  images[line.referencedImageIndex] && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 font-mono border border-neutral-700">
                      Diapositiva {line.referencedImageIndex + 1}
                    </span>
                  )}

                {isActive && isPlaying ? (
                  <div className="flex items-center gap-1 text-[11px] font-bold text-rose-400">
                    <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                    <span className="hidden sm:inline">En vivo</span>
                  </div>
                ) : (
                  <button
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md bg-neutral-800 text-neutral-300 hover:text-white"
                    title="Escuchar desde esta línea"
                  >
                    <Play className="w-3 h-3 fill-current" />
                  </button>
                )}
              </div>
            </div>

            {/* Line Text */}
            <p
              className={`text-sm leading-relaxed ${
                isActive
                  ? 'text-white font-medium'
                  : 'text-neutral-300 group-hover:text-neutral-100'
              }`}
            >
              {line.text}
            </p>
          </div>
        );
      })}
    </div>
  );
}
