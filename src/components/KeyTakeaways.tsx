'use client';

import React, { useState } from 'react';
import { KeyTakeaway } from '@/types/podcast';
import { Award, Lightbulb, Copy, Check } from 'lucide-react';

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
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-4 max-h-[560px] overflow-y-auto">
      <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
        <div>
          <h3 className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Lo que te van a preguntar en el examen</span>
          </h3>
          <p className="text-xs text-neutral-400">
            Resumen rápido y directo al grano para memorizar antes de la prueba.
          </p>
        </div>

        <button
          onClick={handleCopyAll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-all active:scale-95"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Copiado</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copiar todo</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-3">
        {takeaways.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/60 space-y-2 hover:border-neutral-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center text-xs font-bold shrink-0">
                {idx + 1}
              </span>
              <h4 className="text-sm font-bold text-white">{item.concept}</h4>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed pl-7">
              {item.explanation}
            </p>

            {item.examTip && (
              <div className="ml-7 mt-2 p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300">Tip de Examen: </strong>
                  <span>{item.examTip}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
