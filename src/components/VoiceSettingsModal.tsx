'use client';

import React, { useState } from 'react';
import { Sliders, Volume2, Key, Check, ExternalLink, Sparkles, AudioLines } from 'lucide-react';
import { extractElevenLabsVoiceId } from '@/lib/speech';

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  voiceA: string;
  voiceB: string;
  elevenLabsApiKey: string;
  onSave: (voiceA: string, voiceB: string, apiKey: string) => void;
}

export function VoiceSettingsModal({
  isOpen,
  onClose,
  voiceA,
  voiceB,
  elevenLabsApiKey,
  onSave,
}: VoiceSettingsModalProps) {
  const [inputVoiceA, setInputVoiceA] = useState(voiceA);
  const [inputVoiceB, setInputVoiceB] = useState(voiceB);
  const [inputApiKey, setInputApiKey] = useState(elevenLabsApiKey);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(inputVoiceA.trim(), inputVoiceB.trim(), inputApiKey.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  const idA = extractElevenLabsVoiceId(inputVoiceA);
  const idB = extractElevenLabsVoiceId(inputVoiceB);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-7 space-y-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white text-sm"
        >
          ✕
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <AudioLines className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white tracking-tight">
              Configuración de Voces ElevenLabs
            </h3>
            <p className="text-xs text-zinc-400">
              Personaliza las voces ultra-realistas para tus dos anfitriones
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Host A Voice */}
          <div className="space-y-1.5">
            <label className="flex items-center justify-between text-xs font-medium text-zinc-300">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-rose-400" />
                Voz Host 1 (Valeria / Conductora A)
              </span>
              {idA && (
                <span className="text-[10px] font-mono text-zinc-500 truncate max-w-[150px]">
                  ID: {idA}
                </span>
              )}
            </label>
            <input
              type="text"
              value={inputVoiceA}
              onChange={(e) => setInputVoiceA(e.target.value)}
              placeholder="Pega el enlace o Voice ID de ElevenLabs (ej: 21m00Tcm4TlvDq8ikWAM)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 text-xs text-zinc-200 placeholder-zinc-600 outline-none transition-all font-mono"
            />
          </div>

          {/* Host B Voice */}
          <div className="space-y-1.5">
            <label className="flex items-center justify-between text-xs font-medium text-zinc-300">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                Voz Host 2 (Mateo / Conductor B)
              </span>
              {idB && (
                <span className="text-[10px] font-mono text-zinc-500 truncate max-w-[150px]">
                  ID: {idB}
                </span>
              )}
            </label>
            <input
              type="text"
              value={inputVoiceB}
              onChange={(e) => setInputVoiceB(e.target.value)}
              placeholder="Pega el enlace o Voice ID de ElevenLabs (ej: EXAVITQu4vr4xnSDxMaL)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 text-xs text-zinc-200 placeholder-zinc-600 outline-none transition-all font-mono"
            />
          </div>

          {/* ElevenLabs API Key */}
          <div className="space-y-1.5 pt-2 border-t border-zinc-900">
            <label className="flex items-center justify-between text-xs font-medium text-zinc-300">
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-violet-400" />
                API Key de ElevenLabs (Opcional en app / Vercel)
              </span>
              <a
                href="https://elevenlabs.io/app/speech-synthesis"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-zinc-500 hover:text-zinc-300 inline-flex items-center gap-1"
              >
                Obtener Key <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </label>
            <input
              type="password"
              value={inputApiKey}
              onChange={(e) => setInputApiKey(e.target.value)}
              placeholder="xi-api-key..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 text-xs text-zinc-200 placeholder-zinc-600 outline-none transition-all font-mono"
            />
            <p className="text-[11px] text-zinc-500">
              También puedes agregarla en Vercel como variable{' '}
              <code className="text-zinc-400 font-mono">ELEVENLABS_API_KEY</code>. Si no se ingresa, se usa la síntesis de voz en español nativa del navegador.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-zinc-100 text-zinc-950 hover:bg-white active:scale-95 transition-all flex items-center gap-1.5 shadow-sm"
          >
            {saved ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Guardado</span>
              </>
            ) : (
              <span>Guardar Voces</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
