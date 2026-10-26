'use client';

import React from 'react';
import { PodcastEpisode } from '@/types/podcast';
import { Bookmark, Play, Trash2, Calendar, FileText, Image as ImageIcon } from 'lucide-react';

interface SavedEpisodesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedEpisodes: PodcastEpisode[];
  onSelectEpisode: (episode: PodcastEpisode) => void;
  onDeleteEpisode: (id: string) => void;
  onLoadDemo: () => void;
}

export function SavedEpisodesDrawer({
  isOpen,
  onClose,
  savedEpisodes,
  onSelectEpisode,
  onDeleteEpisode,
  onLoadDemo,
}: SavedEpisodesDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl max-h-[85vh] rounded-3xl border border-rose-900/40 bg-neutral-950 p-6 space-y-5 shadow-2xl flex flex-col relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white text-sm"
        >
          ✕
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Tu Biblioteca de Estudio</h3>
            <p className="text-xs text-neutral-400">
              Episodios guardados en este navegador ({savedEpisodes.length})
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {savedEpisodes.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-neutral-900 flex items-center justify-center text-3xl mx-auto">
                📚
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-neutral-200">
                  Aún no tienes episodios guardados
                </p>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  Cuando generes un podcast, haz clic en &ldquo;Guardar episodio&rdquo; para tenerlo listo antes de tus exámenes.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onLoadDemo();
                  onClose();
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20"
              >
                Cargar episodio Demo de Biología 🍃
              </button>
            </div>
          ) : (
            savedEpisodes.map((ep) => (
              <div
                key={ep.id}
                className="p-4 rounded-2xl border border-neutral-800 bg-neutral-900/50 hover:border-rose-500/40 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">
                      {ep.topic}
                    </span>
                    <span className="text-[10px] text-neutral-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(ep.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-rose-200 transition-colors truncate">
                    {ep.title}
                  </h4>

                  <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {ep.dialogue.length} líneas
                    </span>
                    <span className="flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" />
                      {ep.images.length} diapositiva{ep.images.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => {
                      onSelectEpisode(ep);
                      onClose();
                    }}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 shadow-md shadow-rose-600/20 active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Escuchar</span>
                  </button>

                  <button
                    onClick={() => onDeleteEpisode(ep.id)}
                    className="p-2 rounded-xl bg-neutral-800 hover:bg-red-950/40 text-neutral-400 hover:text-red-400 border border-neutral-700"
                    title="Eliminar de guardados"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-2 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
