// publicar/components/ImageUploader.tsx

import { Upload, X } from 'lucide-react';
import Image from 'next/image';

interface ImageUploaderProps {
  images: string[];
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
}

export default function ImageUploader({ images, onUpload, onRemove }: ImageUploaderProps) {
  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
        <input
          type="file"
          id="file-upload"
          multiple
          accept="image/*"
          onChange={onUpload}
          className="hidden"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-lg font-semibold text-gray-700 mb-1">Cargar fotos</p>
          <p className="text-sm text-gray-500">
            Arrastra y suelta o haz clic para seleccionar
          </p>
          <p className="text-xs text-gray-400 mt-2">
            (Las imágenes no se enviarán por ahora)
          </p>
        </label>
      </div>

      {/* Imágenes Cargadas */}
      {images.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Imágenes cargadas ({images.length})
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 group"
              >
                <Image
                  src={img}
                  alt={`Preview ${idx + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => onRemove(idx)}
                  className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  title="Eliminar imagen"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-1 left-1 bg-black/60 text-white px-2 py-0.5 rounded text-xs font-medium">
                  {idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}