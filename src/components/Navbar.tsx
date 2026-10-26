'use client';

import React from 'react';
import { Sparkles, Key, Bookmark, PlusCircle, AudioLines, SlidersHorizontal } from 'lucide-react';

interface NavbarProps {
  onNewPodcast: () => void;
  onLoadDemo: () => void;
  onOpenApiKeyModal: () => void;
  onOpenVoiceModal: () => void;
  onOpenSavedModal: () => void;
  savedCount: number;
  hasApiKey: boolean;
  hasElevenLabsVoices: boolean;
  isPlayerActive: boolean;
}

export function Navbar({
  onNewPodcast,
  onLoadDemo,
  onOpenApiKeyModal,
  onOpenVoiceModal,
  onOpenSavedModal,
  savedCount,
  hasApiKey,
  hasElevenLabsVoices,
  isPlayerActive,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo - Serious & Sleek Studio Aesthetic */}
        <div
          onClick={onNewPodcast}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-zinc-800 via-zinc-900 to-black border border-zinc-700/60 flex items-center justify-center text-white shadow-md group-hover:border-zinc-500 transition-all">
            <AudioLines className="w-5 h-5 text-zinc-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-base sm:text-lg tracking-tight text-white font-sans">
                ChismeStudy
              </span>
              <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-400 border border-zinc-800">
                Studio AI
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 hidden sm:block tracking-wide">
              Estudio de Podcast Educativo &amp; Aprendizaje Conversacional
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* ElevenLabs Voices Config */}
          <button
            onClick={onOpenVoiceModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all active:scale-95 ${
              hasElevenLabsVoices
                ? 'text-violet-300 bg-violet-950/30 border-violet-500/40 hover:bg-violet-900/40'
                : 'text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border-zinc-800'
            }`}
            title="Configurar voces de ElevenLabs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Voces ElevenLabs</span>
            {hasElevenLabsVoices && (
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            )}
          </button>

          {/* Demo Button */}
          <button
            onClick={onLoadDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-all active:scale-95"
            title="Cargar episodio de demostración"
          >
            <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
            <span>Ejemplo Demo</span>
          </button>

          {/* Saved Episodes */}
          <button
            onClick={onOpenSavedModal}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-all active:scale-95"
            title="Episodios guardados en tu biblioteca"
          >
            <Bookmark className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Biblioteca</span>
            {savedCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-full text-[10px] font-mono">
                {savedCount}
              </span>
            )}
          </button>

          {/* API Key Modal Button */}
          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all active:scale-95 ${
              hasApiKey
                ? 'text-emerald-400 bg-emerald-950/30 border-emerald-500/30 hover:bg-emerald-900/40'
                : 'text-zinc-400 bg-zinc-900 hover:bg-zinc-800 border-zinc-800'
            }`}
            title="Configuración de API de IA"
          >
            <Key className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {hasApiKey ? 'Gemini Conectado' : 'API Key'}
            </span>
          </button>

          {/* New Podcast Button if in player */}
          {isPlayerActive && (
            <button
              onClick={onNewPodcast}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-black bg-white hover:bg-zinc-200 transition-all active:scale-95 shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Nuevo</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
