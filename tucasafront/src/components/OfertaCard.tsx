'use client'
import { Bed, Bath, Maximize, Heart, Upload } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import type { Oferta } from '@/models/Oferta'

interface OfertaCardProps {
  oferta: Oferta
  onFavorite?: (id: number) => void
}

const getOfertaBadgeColor = (tipo: Oferta['tipo']): string => {
  const colores: Record<Oferta['tipo'], string> = {
    ALQUILER: 'bg-blue-100 text-blue-700',
    VENTA: 'bg-green-100 text-green-700',
    ANTICRETICO: 'bg-purple-100 text-purple-700',
  }
  return colores[tipo]
}

const getOfertaLabel = (tipo: Oferta['tipo']): string => {
  const labels: Record<Oferta['tipo'], string> = {
    ALQUILER: 'Alquiler',
    VENTA: 'Venta',
    ANTICRETICO: 'Anticretico',
  }
  return labels[tipo]
}

const getInmuebleBadgeColor = (tipo: string): string => {
  const colores: Record<string, string> = {
    CASA: 'bg-blue-100 text-blue-700',
    DEPARTAMENTO: 'bg-green-100 text-green-700',
    LOTE: 'bg-purple-100 text-purple-700',
    TIENDA: 'bg-sky-100 text-sky-700',
  }
  return colores[tipo] || 'bg-yellow-100 text-yellow-700'
}

const getInmuebleLabel = (tipo: string): string => {
  const labels: Record<string, string> = {
    CASA: 'Casa',
    DEPARTAMENTO: 'Departamento',
    LOTE: 'Lote',
    TIENDA: 'Tienda',
  }
  return labels[tipo] || 'Desconocido'
}

const formatearPrecio = (precio: number): string => {
  return precio.toLocaleString('es-BO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

const getPrecioConDuracion = (oferta: Oferta): string => {
  if (oferta.tipo === 'ALQUILER' && oferta.duracion) {
    return `${formatearPrecio(oferta.precio)}/${oferta.tipoPago === 'mensual' ? 'mes' : 'año'}`
  }
  return formatearPrecio(oferta.precio)
}

export const OfertaCard = ({ oferta, onFavorite }: OfertaCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorite(!isFavorite)
    onFavorite?.(oferta.id)
  }

  const inmueble = oferta.inmueble

  return (
    <Link href={`/oferta/${oferta.id}`} className="group h-full">
      <div className="bg-white rounded-xl overflow-hidden shadow-md transition-all hover:shadow-xl h-full flex flex-col">
        {/* Imagen Principal */}
        <div className="relative aspect-[4/3] overflow-hidden px-4 py-4">
          {imageError || !inmueble.url_imagen ? (
            <div className="w-full h-full rounded-xl flex items-center justify-center bg-gray-100">
              <Upload className="h-12 w-12 text-gray-400" />
            </div>
          ) : (
            <img
              src={inmueble.url_imagen}
              alt={oferta.descripcion}
              onError={() => setImageError(true)}
              className="w-full h-full rounded-xl object-cover transition-transform group-hover:scale-105"
            />
          )}

          {/* Botón Favorito */}
          <button
            onClick={handleFavorite}
            className="absolute top-6 right-6 h-8 w-8 rounded-full bg-white shadow-md flex items-center justify-center transition-all hover:scale-110 z-10"
          >
            <Heart
              className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
                }`}
            />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Precio */}
          <div className="mb-3">
            <p className="text-2xl font-bold text-gray-900">
              {oferta.moneda || '$'}{' '}
              {getPrecioConDuracion(oferta)}
            </p>
            {oferta.tipo === 'ALQUILER' && oferta.duracion && (
              <p className="text-xs text-gray-500">Duración: {oferta.duracion} días</p>
            )}
          </div>

          {/* Badges de Tipo y Operación */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${getOfertaBadgeColor(oferta.tipo)}`}>
              {getOfertaLabel(oferta.tipo)}
            </span>
            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${getInmuebleBadgeColor(inmueble.tipo)}`}>
              {getInmuebleLabel(inmueble.tipo)}
            </span>
          </div>

          {/* Información Básica */}
          <div className="mb-3 space-y-1">
            <p className="text-xs text-gray-700 font-medium">
              {inmueble.direccion || 'Dirección no especificada'}
            </p>
            <p className="text-xs text-gray-600">
              {oferta.descripcion}
            </p>
          </div>

          {/* Superficie */}
          {inmueble.superficie > 0 && (
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
              <Maximize className="h-3 w-3" />
              <span>Superficie: {inmueble.superficie} m²</span>
            </div>
          )}

          {/* Características por tipo de propiedad */}
          {(inmueble.numDormitorios || inmueble.numBanos) && (
            <div className="grid grid-cols-2 gap-2 text-xs py-3 border-y border-gray-200">
              {inmueble.numDormitorios && inmueble.numDormitorios > 0 && (
                <div className="flex items-center gap-1">
                  <Bed className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-700">{inmueble.numDormitorios} dorm.</span>
                </div>
              )}
              {inmueble.numBanos && inmueble.numBanos > 0 && (
                <div className="flex items-center gap-1">
                  <Bath className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-700">{inmueble.numBanos} baños</span>
                </div>
              )}
              {inmueble.numPisos && inmueble.numPisos > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Pisos:</span>
                  <span className="font-medium text-gray-900">{inmueble.numPisos}</span>
                </div>
              )}
              {inmueble.numAmbientes && inmueble.numAmbientes > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Ambientes:</span>
                  <span className="font-medium text-gray-900">{inmueble.numAmbientes}</span>
                </div>
              )}
            </div>
          )}

          {/* Características adicionales */}
          {(inmueble.garaje !== undefined || inmueble.patio !== undefined ||
            inmueble.amoblado !== undefined || inmueble.deposito !== undefined) && (
              <div className="grid grid-cols-2 gap-2 text-xs py-3 border-b border-gray-200">
                {inmueble.garaje !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Garaje:</span>
                    <span className="font-medium text-gray-900">
                      {inmueble.garaje ? 'Sí' : 'No'}
                    </span>
                  </div>
                )}
                {inmueble.patio !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Patio:</span>
                    <span className="font-medium text-gray-900">
                      {inmueble.patio ? 'Sí' : 'No'}
                    </span>
                  </div>
                )}
                {inmueble.amoblado !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amoblado:</span>
                    <span className="font-medium text-gray-900">
                      {inmueble.amoblado ? 'Sí' : 'No'}
                    </span>
                  </div>
                )}
                {inmueble.deposito !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Depósito:</span>
                    <span className="font-medium text-gray-900">
                      {inmueble.deposito ? 'Sí' : 'No'}
                    </span>
                  </div>
                )}
                {inmueble.sotano !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sótano:</span>
                    <span className="font-medium text-gray-900">
                      {inmueble.sotano ? 'Sí' : 'No'}
                    </span>
                  </div>
                )}
              </div>
            )}

          {/* Servicios */}
          {inmueble.servicios && inmueble.servicios.length > 0 && (
            <div className="mt-3 pt-3">
              <h4 className="text-xs font-semibold text-gray-900 mb-2">Servicios</h4>
              <div className="flex flex-wrap gap-1">
                {inmueble.servicios.map(servicio => (
                  <span
                    key={servicio.id}
                    className="inline-flex px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                  >
                    {servicio.nombre}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Botón Ver Detalles */}
          <div className="mt-auto pt-3 border-t border-gray-200">
            <button className="w-full bg-blue-500 hover:bg-blue-600 rounded-lg px-4 py-2 text-white text-xs font-medium transition-colors">
              Ver Detalles
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}