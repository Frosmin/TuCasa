'use client'

import { Bed, Bath, Maximize, Heart, Eye, Upload, Home } from "lucide-react"
import { useState, type FC } from "react"
import { formatearPrecio } from "../utils/utils"
import Link from "next/link"
import type { Oferta } from "@/models/Oferta"
import type { Inmueble } from "@/models/Inmueble"

interface OfertaCardProps {
    oferta: Oferta
    onFavorite?: (id: string) => void
    onViewDetails?: (id: string) => void
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
    const colores: Record<Oferta['tipo'], string> = {
        ALQUILER: 'Alquiler',
        VENTA: 'Venta',
        ANTICRETICO: 'Anticretico',
    }
    return colores[tipo]
}
const getInmuebleBadgeColor = (tipo: Inmueble['tipo']): string => {
    const colores: Record<Exclude<Inmueble['tipo'], ''>, string> = {
        CASA: 'bg-blue-100 text-blue-700',
        DEPARTAMENTO: 'bg-green-100 text-green-700',
        LOTE: 'bg-purple-100 text-purple-700',
        TIENDA: 'bg-sky-100 text-sky-700'
    }
    return tipo ? colores[tipo] : 'bg-yellow-100 text-yellow-700'
}

const getInmuebleLabel = (tipo: Inmueble['tipo']): string => {
    const labels: Record<Exclude<Inmueble['tipo'], ''>, string> = {
        CASA: 'Casa',
        DEPARTAMENTO: 'Departamento',
        LOTE: 'Lote',
        TIENDA: 'Tienda'
    }
    return tipo ? labels[tipo] : "Desconocido"
}

export const OfertaCard: FC<OfertaCardProps> = ({
    oferta,
    onFavorite,
    onViewDetails
}) => {
    const [isFavorite, setIsFavorite] = useState(false)
    const [imageError, setImageError] = useState(false)

    const handleFavorite = (e: React.MouseEvent): void => {
        e.preventDefault()
        e.stopPropagation()
        setIsFavorite(!isFavorite)
        onFavorite?.(String(oferta.id))
    }

    const handleViewDetails = (e: React.MouseEvent): void => {
        e.preventDefault()
        e.stopPropagation()
        onViewDetails?.(String(oferta.id))
    }

    return (
        <Link href={`/casa/${oferta.id}`} className="group h-full">
            <div className="bg-white rounded-xl overflow-hidden shadow-md transition-all hover:shadow-xl h-full flex flex-col">


                {/* Imagen Principal */}
                <div className="relative aspect-[4/3] overflow-hidden px-4 py-4">
                    {imageError || !oferta.inmueble.url_imagen ? (
                        <div className="w-full h-full rounded-xl flex items-center justify-center bg-gray-100">
                            <Upload className="h-12 w-12 text-gray-400" />
                        </div>
                    ) : (
                        <img
                            src={oferta.inmueble.url_imagen}
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
                            className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                        />
                    </button>


                </div>

                {/* Contenido */}
                <div className="p-4 flex-1 flex flex-col">
                    {/* Precio */}
                    <div className="mb-3">
                        <p className="text-2xl font-bold text-gray-900">
                            ${formatearPrecio(oferta.precio)}
                            <span className="text-sm text-gray-500 font-normal ml-2">USD</span>
                        </p>
                    </div>

                    {/* Badges de Tipo y Operación */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 ${getOfertaBadgeColor(oferta.tipo)}`}>
                            {getOfertaLabel(oferta.tipo)}
                        </span>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${getInmuebleBadgeColor(oferta.inmueble.tipo)}`}>
                            {getInmuebleLabel(oferta.inmueble.tipo)}
                        </span>


                    </div>

                    {/* Información Básica */}
                    <div className="mb-3 space-y-1">
                        <p className="text-xs text-gray-700 font-medium">
                            {oferta.inmueble.direccion || 'Dirección no especificada'}
                        </p>
                    </div>

                    {/* Superficie */}
                    {oferta.inmueble.superficie > 0 && (
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                            <Maximize className="h-3 w-3" />
                            <span>Superficie: {oferta.inmueble.superficie} m²</span>
                        </div>
                    )}

                    {/* Características Grid */}
                    <div className="grid grid-cols-2 gap-2  text-xs py-3 border-y border-gray-200">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Garaje:</span>
                            <span className="font-medium text-gray-900">
                                {oferta.inmueble.garaje ? 'Sí' : 'No'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Patio:</span>
                            <span className="font-medium text-gray-900">
                                {oferta.inmueble.patio ? 'Sí' : 'No'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Amoblado:</span>
                            <span className="font-medium text-gray-900">
                                {oferta.inmueble.amoblado ? 'Sí' : 'No'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Sótano:</span>
                            <span className="font-medium text-gray-900">
                                {oferta.inmueble.sotano ? 'Sí' : 'No'}
                            </span>
                        </div>
                    </div>

                    {/* Descripción */}
                    {oferta.descripcion && (
                        <div className="mt-3 space-y-1">
                            <h4 className="text-xs font-semibold text-gray-900">Descripción</h4>
                            <p className="text-xs text-gray-600 line-clamp-3">
                                {oferta.descripcion}
                            </p>
                        </div>
                    )}

                    {/* Características con iconos */}
                    {(oferta.inmueble.numDormitorios || oferta.inmueble.numBanos) && (
                        <div className="flex gap-3 mt-3 pt-3 border-t border-gray-200 text-xs text-gray-600">
                            {oferta.inmueble.numDormitorios && oferta.inmueble.numDormitorios > 0 && (
                                <div className="flex items-center gap-1">
                                    <Bed className="h-4 w-4" />
                                    <span>{oferta.inmueble.numDormitorios}</span>
                                </div>
                            )}
                            {oferta.inmueble.numBanos && oferta.inmueble.numBanos > 0 && (
                                <div className="flex items-center gap-1">
                                    <Bath className="h-4 w-4" />
                                    <span>{oferta.inmueble.numBanos}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Botón Ver Detalles */}
                    <div className="mt-auto pt-3 border-t border-gray-200">
                        <button
                            onClick={handleViewDetails}
                            className="w-full bg-blue-500 hover:bg-blue-600 rounded-lg px-4 py-2 text-white text-xs font-medium transition-colors"
                        >
                            Ver Detalles
                        </button>
                    </div>
                </div>
            </div>
        </Link >
    )
}