// publicar/components/PropertyPreview.tsx

import { useState } from 'react';
import { Eye, Upload, ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { PropertyFormData } from '../types/property.types';

interface PropertyPreviewProps {
  formData: PropertyFormData;
}

export default function PropertyPreview({ formData }: PropertyPreviewProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === formData.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? formData.images.length - 1 : prev - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-24 h-fit">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Eye className="w-6 h-6 text-blue-600" />
        Vista Previa
      </h2>

      <div className="space-y-6">
        {/* Imagen Principal con Carousel */}
        <div className="w-full h-64 bg-gray-100 rounded-xl overflow-hidden relative group">
          {formData.images.length > 0 ? (
            <>
              <Image
                src={formData.images[currentImageIndex]}
                alt={`Preview ${currentImageIndex + 1}`}
                fill
                className="object-cover"
              />

              {formData.images.length > 1 && (
                <>
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

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {formData.images.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => goToImage(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === currentImageIndex
                            ? 'bg-white w-6'
                            : 'bg-white/60 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {currentImageIndex + 1} / {formData.images.length}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <Upload className="w-16 h-16 text-gray-300" />
            </div>
          )}
        </div>

        {/* Información */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              {formData.propertyType}
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
              {formData.operacion}
            </span>
          </div>

          <div>
            <p className="text-3xl font-bold text-gray-900">
              {formData.precio ? `${formData.moneda} ${formData.precio}` : `${formData.moneda} 0`}
              {formData.operacion !== 'VENTA' && formData.tipoPago === 'mensual' && (
                <span className="text-lg text-gray-500 font-normal"> /mes</span>
              )}
              {formData.operacion !== 'VENTA' && formData.tipoPago === 'anual' && (
                <span className="text-lg text-gray-500 font-normal"> /año</span>
              )}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-gray-700 font-medium">
              {formData.direccion || 'Dirección no especificada'}
            </p>
            {(formData.latitud || formData.longitud) && (
              <p className="text-gray-600 text-sm">
                Coordenadas: {formData.latitud || '0'}, {formData.longitud || '0'}
              </p>
            )}
            {formData.superficie && (
              <p className="text-gray-600">
                Superficie: <span className="font-semibold">{formData.superficie} m²</span>
              </p>
            )}
          </div>

          {/* Características de Casa */}
          {formData.propertyType === 'CASA' && (
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
              {formData.dormitorios && (
                <div className="text-sm">
                  <span className="text-gray-600">Dormitorios:</span>
                  <span className="font-semibold text-gray-900 ml-1">{formData.dormitorios}</span>
                </div>
              )}
              {formData.banos && (
                <div className="text-sm">
                  <span className="text-gray-600">Baños:</span>
                  <span className="font-semibold text-gray-900 ml-1">{formData.banos}</span>
                </div>
              )}
              {formData.numPisos && (
                <div className="text-sm">
                  <span className="text-gray-600">Pisos:</span>
                  <span className="font-semibold text-gray-900 ml-1">{formData.numPisos}</span>
                </div>
              )}
              <div className="text-sm">
                <span className="text-gray-600">Garaje:</span>
                <span className="font-semibold text-gray-900 ml-1">
                  {formData.garaje ? 'Sí' : 'No'}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Patio:</span>
                <span className="font-semibold text-gray-900 ml-1">
                  {formData.patio ? 'Sí' : 'No'}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Amoblado:</span>
                <span className="font-semibold text-gray-900 ml-1">
                  {formData.amoblado ? 'Sí' : 'No'}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Sótano:</span>
                <span className="font-semibold text-gray-900 ml-1">
                  {formData.sotano ? 'Sí' : 'No'}
                </span>
              </div>
            </div>
          )}

          {/* Características de Tienda */}
          {formData.propertyType === 'TIENDA' && (
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
              {formData.numAmbientes && (
                <div className="text-sm">
                  <span className="text-gray-600">Ambientes:</span>
                  <span className="font-semibold text-gray-900 ml-1">{formData.numAmbientes}</span>
                </div>
              )}
              <div className="text-sm">
                <span className="text-gray-600">Depósito:</span>
                <span className="font-semibold text-gray-900 ml-1">
                  {formData.deposito ? 'Sí' : 'No'}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Baño privado:</span>
                <span className="font-semibold text-gray-900 ml-1">
                  {formData.banoPrivado ? 'Sí' : 'No'}
                </span>
              </div>
            </div>
          )}

          {/* Características de Departamento */}
          {formData.propertyType === 'DEPARTAMENTO' && (
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
              {formData.piso && (
                <div className="text-sm">
                  <span className="text-gray-600">Piso:</span>
                  <span className="font-semibold text-gray-900 ml-1">{formData.piso}</span>
                </div>
              )}
              {formData.superficieInterna && (
                <div className="text-sm">
                  <span className="text-gray-600">Superficie interna:</span>
                  <span className="font-semibold text-gray-900 ml-1">{formData.superficieInterna} m²</span>
                </div>
              )}
              <div className="text-sm">
                <span className="text-gray-600">Ascensor:</span>
                <span className="font-semibold text-gray-900 ml-1">{formData.ascensor ? 'Sí' : 'No'}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Balcón:</span>
                <span className="font-semibold text-gray-900 ml-1">{formData.balcon ? 'Sí' : 'No'}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Parqueo:</span>
                <span className="font-semibold text-gray-900 ml-1">{formData.parqueo ? 'Sí' : 'No'}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Mascotas permitidas:</span>
                <span className="font-semibold text-gray-900 ml-1">{formData.mascotasPermitidas ? 'Sí' : 'No'}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Amoblado:</span>
                <span className="font-semibold text-gray-900 ml-1">{formData.amoblado ? 'Sí' : 'No'}</span>
              </div>
              {formData.montoExpensas && (
                <div className="text-sm">
                  <span className="text-gray-600">Expensas:</span>
                  <span className="font-semibold text-gray-900 ml-1">{formData.montoExpensas}</span>
                </div>
              )}
            </div>
          )}

          <div className="pt-4 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Descripción del Inmueble</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {formData.descripcion || 'Sin descripción aún...'}
            </p>
          </div>

          {formData.descripcionOferta && (
            <div className="pt-4 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Descripción de la Oferta</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {formData.descripcionOferta}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}