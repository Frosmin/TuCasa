'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Upload } from 'lucide-react';

interface ImageCarouselProps {
  images: string[];
  className?: string;
  onIndexChange?: (index: number) => void;

}

export default function ImageCarousel({ images, onIndexChange,className = 'w-full h-64' }: ImageCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (!images || images.length === 0) {
    return (
      <div className={`${className} bg-gray-100 rounded-xl flex items-center justify-center`}>
        <Upload className="w-16 h-16 text-gray-300" />
      </div>
    );
  }

  return (
    <div className={`${className} bg-gray-100 rounded-xl overflow-hidden relative group`}>
      {images.map((src,idx) =>(
      <Image
        key={src+idx}
        src={src}
        alt={`Imagen ${idx + 1}`}
        fill
        sizes="100vw"
        loading="eager"
        priority={idx === 0}
        className={`object-cover absolute inset-0 transition-opacity duration-300 ${
            idx === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
      />
      ))}
      {images.length > 1 && (
        <>
          {/* Botones de navegación */}
          <button
            type="button"
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
          >
            <ArrowLeft className="w-5 h-5 text-gray-800" />
          </button>
          <button
            type="button"
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
          >
            <ArrowRight className="w-5 h-5 text-gray-800" />
          </button>

          {/* Indicadores de puntos */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => goToImage(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/60 hover:bg-white/80'
                }`}
              />
            ))}
          </div>

          {/* Contador */}
          <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
            {currentImageIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}