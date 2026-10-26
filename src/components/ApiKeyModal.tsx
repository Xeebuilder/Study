'use client';

import React, { useState } from 'react';
import { Key, ExternalLink, ShieldCheck, Check, Trash2, Eye, EyeOff } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveKey: (key: string) => void;
}

export function ApiKeyModal({ isOpen, onClose, apiKey, onSaveKey }: ApiKeyModalProps) {
  const [inputVal, setInputVal] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveKey(inputVal.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    setInputVal('');
    onSaveKey('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-rose-900/40 bg-neutral-950 p-6 space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white text-sm"
        >
          ✕
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Configurar Google Gemini API</h3>
            <p className="text-xs text-neutral-400">Gratis desde Google AI Studio</p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-neutral-300 bg-neutral-900/60 p-4 rounded-2xl border border-neutral-800">
          <p className="font-semibold text-neutral-200">
            ¿Cómo obtener tu clave gratis en 1 minuto?
          </p>
          <ol className="list-decimal list-inside space-y-1.5 text-neutral-400">
            <li>
              Entra a{' '}
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-rose-400 hover:underline inline-flex items-center gap-1 font-medium"
              >
                aistudio.google.com/apikey
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>Inicia sesión con tu cuenta de Google.</li>
            <li>Haz clic en &quot;Create API key&quot; y cópiala.</li>
            <li>Pégala aquí abajo.</li>
          </ol>
        </div>

        {/* Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-300">
            Tu Gemini API Key:
          </label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-4 py-2.5 pr-20 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm text-neutral-200 font-mono outline-none"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-200"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[11px] text-neutral-500 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Se guarda en tu navegador y no se comparte con nadie.</span>
          </p>
        </div>

        <div className="p-3 rounded-xl bg-neutral-900/40 border border-neutral-800 text-[11px] text-neutral-400">
          <strong className="text-neutral-300">Para Vercel: </strong>
          También puedes agregarla como variable de entorno llamada{' '}
          <code className="text-rose-300 font-mono bg-neutral-950 px-1 py-0.5 rounded">
            GEMINI_API_KEY
          </code>{' '}
          en la configuración de tu proyecto en Vercel.
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2">
          {apiKey ? (
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-950/30 border border-red-900/40 flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Eliminar clave</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:bg-neutral-900"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 shadow-lg shadow-rose-600/20 flex items-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>¡Guardado!</span>
                </>
              ) : (
                <span>Guardar clave</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
