'use client';

import React from 'react';
import { Sparkles, Key, Bookmark, PlusCircle, Volume2 } from 'lucide-react';

interface NavbarProps {
  onNewPodcast: () => void;
  onLoadDemo: () => void;
  onOpenApiKeyModal: () => void;
  onOpenSavedModal: () => void;
  savedCount: number;
  hasApiKey: boolean;
  isPlayerActive: boolean;
}

export function Navbar({
  onNewPodcast,
  onLoadDemo,
  onOpenApiKeyModal,
  onOpenSavedModal,
  savedCount,
  hasApiKey,
  isPlayerActive,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-rose-900/30 bg-neutral-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={onNewPodcast}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-xl shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform">
            ☕
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-amber-200 via-rose-300 to-pink-400 bg-clip-text text-transparent">
                ChismeStudy
              </span>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                En Español
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 hidden sm:block">
              Tu estudio con el té y chisme que necesitas para aprobar 🎙️
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Demo Button */}
          <button
            onClick={onLoadDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all active:scale-95"
            title="Cargar episodio de ejemplo listo para escuchar"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Probar</span> Demo
          </button>

          {/* Saved Episodes */}
          <button
            onClick={onOpenSavedModal}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-all active:scale-95"
            title="Episodios guardados en este navegador"
          >
            <Bookmark className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Guardados</span>
            {savedCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px] font-bold">
                {savedCount}
              </span>
            )}
          </button>

          {/* API Key Modal Button */}
          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all active:scale-95 ${
              hasApiKey
                ? 'text-emerald-300 bg-emerald-950/40 border-emerald-500/40 hover:bg-emerald-900/50'
                : 'text-amber-300 bg-amber-950/40 border-amber-500/40 hover:bg-amber-900/50'
            }`}
            title="Configurar Gemini API Key"
          >
            <Key className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {hasApiKey ? 'API Conectada' : 'Configurar API'}
            </span>
          </button>

          {/* New Podcast Button if in player */}
          {isPlayerActive && (
            <button
              onClick={onNewPodcast}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 shadow-md shadow-rose-600/20 transition-all active:scale-95"
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
