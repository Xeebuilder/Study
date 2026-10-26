'use client';

import React, { useEffect, useRef } from 'react';
import { DialogueLine, StudyImage } from '@/types/podcast';
import { Play, Volume2, Headphones } from 'lucide-react';

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

  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [currentLineIndex]);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 max-h-[560px] overflow-y-auto space-y-2.5 custom-scrollbar">
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
                ? 'bg-zinc-900 border-zinc-500 shadow-sm'
                : 'bg-zinc-900/30 border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/60'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold ${
                  isHostA ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {isHostA ? 'H1' : 'H2'}
                </div>
                <span className="text-xs font-semibold text-zinc-200">
                  {line.speakerName}
                </span>

                {line.emotion && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-400 border border-zinc-800">
                    {line.emotion}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {typeof line.referencedImageIndex === 'number' &&
                  images[line.referencedImageIndex] && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-400 font-mono border border-zinc-800">
                      Slide {line.referencedImageIndex + 1}
                    </span>
                  )}

                {isActive && isPlaying ? (
                  <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-200">
                    <Volume2 className="w-3.5 h-3.5 animate-pulse text-zinc-300" />
                    <span className="hidden sm:inline">Activo</span>
                  </div>
                ) : (
                  <button
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md bg-zinc-800 text-zinc-400 hover:text-white"
                    title="Escuchar desde esta línea"
                  >
                    <Play className="w-3 h-3 fill-current" />
                  </button>
                )}
              </div>
            </div>

            {/* Line Text */}
            <p
              className={`text-xs sm:text-sm leading-relaxed ${
                isActive
                  ? 'text-zinc-100 font-medium'
                  : 'text-zinc-400 group-hover:text-zinc-200'
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
