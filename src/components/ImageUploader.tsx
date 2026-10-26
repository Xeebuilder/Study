'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { UploadCloud, Image as ImageIcon, Trash2, Plus, Sparkles, AlertCircle } from 'lucide-react';
import { StudyImage } from '@/types/podcast';

interface ImageUploaderProps {
  images: StudyImage[];
  onImagesChange: (images: StudyImage[]) => void;
  disabled?: boolean;
}

export function ImageUploader({ images, onImagesChange, disabled }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(
    (files: FileList | File[]) => {
      setErrorMessage(null);
      const validFiles = Array.from(files).filter((file) =>
        file.type.startsWith('image/')
      );

      if (validFiles.length === 0) {
        setErrorMessage('Por favor selecciona archivos de imagen válidos (PNG, JPG, WEBP, etc.)');
        return;
      }

      if (images.length + validFiles.length > 8) {
        setErrorMessage('Puedes subir hasta un máximo de 8 diapositivas o imágenes por episodio.');
      }

      const filesToProcess = validFiles.slice(0, 8 - images.length);

      const promises = filesToProcess.map((file) => {
        return new Promise<StudyImage>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            resolve({
              id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
              name: file.name,
              dataUrl,
              mimeType: file.type || 'image/jpeg',
            });
          };
          reader.onerror = () => reject(new Error('Error al leer el archivo'));
          reader.readAsDataURL(file);
        });
      });

      Promise.all(promises)
        .then((newImages) => {
          onImagesChange([...images, ...newImages]);
        })
        .catch(() => {
          setErrorMessage('Ocurrió un error al procesar las imágenes.');
        });
    },
    [images, onImagesChange]
  );

  // Paste from clipboard support (Cmd+V / Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (disabled) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      const imageFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) imageFiles.push(file);
        }
      }

      if (imageFiles.length > 0) {
        processFiles(imageFiles);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [disabled, processFiles]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const removeImage = (id: string) => {
    onImagesChange(images.filter((img) => img.id !== id));
  };

  return (
    <div className="w-full space-y-4">
      {/* Dropzone Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-rose-400 bg-rose-950/30 scale-[1.01]'
            : 'border-neutral-800 hover:border-rose-500/50 bg-neutral-900/40 hover:bg-neutral-900/70'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          disabled={disabled}
          onChange={(e) => e.target.files && processFiles(e.target.files)}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500/20 to-amber-500/20 border border-rose-500/30 flex items-center justify-center text-rose-300">
            <UploadCloud className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <p className="text-sm sm:text-base font-semibold text-neutral-200">
              Arrastra aquí tus diapositivas, fotos del libro o apuntes
            </p>
            <p className="text-xs text-neutral-400 max-w-md mx-auto">
              O haz clic para explorar tus archivos. También puedes pegar una captura de pantalla directamente con{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-300 text-[10px] font-mono">
                Ctrl+V
              </kbd>{' '}
              /{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-300 text-[10px] font-mono">
                Cmd+V
              </kbd>
            </p>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-neutral-400">
            <span className="px-2 py-0.5 rounded-full bg-neutral-800 border border-neutral-700">PNG, JPG, WEBP</span>
            <span>•</span>
            <span>Hasta 8 imágenes</span>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Uploaded Images Gallery */}
      {images.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="font-medium text-neutral-300">
              Imágenes agregadas ({images.length}/8)
            </span>
            <span className="text-[11px] text-rose-300/80">
              Los anfitriones hablarán de cada una en este orden
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((img, idx) => (
              <div
                key={img.id}
                className="group relative rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900 aspect-video flex items-center justify-center shadow-md hover:border-rose-500/50 transition-colors"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.dataUrl}
                  alt={img.name}
                  className="w-full h-full object-cover"
                />

                {/* Badge Number */}
                <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-neutral-950/85 backdrop-blur-sm border border-neutral-700 text-[11px] font-bold text-amber-300 flex items-center gap-1 shadow">
                  <span>Diapositiva {idx + 1}</span>
                </div>

                {/* Remove Button */}
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(img.id);
                    }}
                    className="absolute top-1.5 right-1.5 p-1 rounded-md bg-red-900/80 hover:bg-red-800 text-red-200 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Eliminar diapositiva"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Name tooltip */}
                <div className="absolute bottom-0 inset-x-0 bg-neutral-950/80 backdrop-blur-xs px-2 py-1 text-[10px] text-neutral-300 truncate">
                  {img.name}
                </div>
              </div>
            ))}

            {/* Add more button */}
            {images.length < 8 && !disabled && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-xl border border-dashed border-neutral-800 hover:border-rose-500/60 bg-neutral-900/20 hover:bg-neutral-900/40 flex flex-col items-center justify-center gap-1 text-neutral-400 hover:text-rose-300 transition-colors aspect-video"
              >
                <Plus className="w-5 h-5" />
                <span className="text-[11px] font-medium">Agregar más</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
