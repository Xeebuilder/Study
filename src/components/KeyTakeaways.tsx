'use client';

import React, { useState } from 'react';
import { KeyTakeaway } from '@/types/podcast';
import { Award, Copy, Check, CheckCircle2 } from 'lucide-react';

interface KeyTakeawaysProps {
  takeaways: KeyTakeaway[];
}

export function KeyTakeaways({ takeaways }: KeyTakeawaysProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyAll = () => {
    const text = takeaways
      .map(
        (t, i) =>
          `${i + 1}. ${t.concept}\n• Explicación: ${t.explanation}\n• Tip de Examen: ${t.examTip || 'N/A'}`
      )
      .join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 space-y-4 max-h-[560px] overflow-y-auto">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-zinc-400" />
            <span>Síntesis y Puntos Clave para Evaluación</span>
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Conceptos esenciales y patrones frecuentes en exámenes académicos
          </p>
        </div>

        <button
          onClick={handleCopyAll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 transition-all active:scale-95"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-zinc-200" />
              <span>Copiado</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-zinc-400" />
              <span>Copiar todo</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-3">
        {takeaways.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40 space-y-2 hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700 flex items-center justify-center text-[10px] font-mono font-bold shrink-0">
                0{idx + 1}
              </span>
              <h4 className="text-xs sm:text-sm font-semibold text-zinc-100">{item.concept}</h4>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed pl-7">
              {item.explanation}
            </p>

            {item.examTip && (
              <div className="ml-7 mt-2 p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800 text-zinc-300 text-xs flex items-start gap-2">
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 shrink-0">
                  Tip Examen
                </span>
                <span className="text-zinc-400">{item.examTip}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
