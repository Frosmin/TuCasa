'use client'

import { Bed, Bath, Maximize, Heart, Eye, Upload, Home } from "lucide-react"
import { useState, type FC } from "react"
import { formatearPrecio } from "../utils/utils"
import Link from "next/link"

interface Casa {
    id: string
    tipo: 'alquiler' | 'venta' | 'anticretico'
    zona: string
    direccion?: string
    descripcion: string
    num_dormitorios: number
    num_banios: number
    superficie: number
    precio: number
    imagen: string
    estado: 'nuevo' | 'oferta' | 'oportunidad'
    garaje: boolean
    patio: boolean
    amoblado: boolean
    tiene_sotano: boolean
}

interface CasaCardProps {
    casa: Casa
    onFavorite?: (id: string) => void
    onViewDetails?: (id: string) => void
}

const getOperationBadgeColor = (tipo: Casa['tipo']): string => {
    const colores: Record<Casa['tipo'], string> = {
        venta: 'bg-blue-100 text-blue-700',
        alquiler: 'bg-green-100 text-green-700',
        anticretico: 'bg-purple-100 text-purple-700'
    }
    return colores[tipo]
}

const getOperationLabel = (tipo: Casa['tipo']): string => {
    const labels: Record<Casa['tipo'], string> = {
        venta: 'Venta',
        alquiler: 'Alquiler',
        anticretico: 'Anticretico'
    }
    return labels[tipo]
}

const getEstadoBadgeColor = (estado: Casa['estado']): string => {
    const colores: Record<Casa['estado'], string> = {
        nuevo: 'bg-orange-100 text-orange-700',
        oferta: 'bg-blue-100 text-blue-700',
        oportunidad: 'bg-green-100 text-green-700'
    }
    return colores[estado]
}

export const CasaCard: FC<CasaCardProps> = ({
    casa,
    onFavorite,
    onViewDetails
}) => {
    const [isFavorite, setIsFavorite] = useState(false)
    const [imageError, setImageError] = useState(false)

    const handleFavorite = (e: React.MouseEvent): void => {
        e.preventDefault()
        e.stopPropagation()
        setIsFavorite(!isFavorite)
        onFavorite?.(casa.id)
    }

    const handleViewDetails = (e: React.MouseEvent): void => {
        e.preventDefault()
        e.stopPropagation()
        onViewDetails?.(casa.id)
    }

    return (
        <Link href={`/casa/${casa.id}`} className="group h-full">
            <div className="bg-white rounded-xl overflow-hidden shadow-md transition-all hover:shadow-xl h-full flex flex-col">
               

                {/* Imagen Principal */}
                <div className="relative aspect-[4/3] overflow-hidden px-4 py-4">
                    {imageError || !casa.imagen ? (
                        <div className="w-full h-full rounded-xl flex items-center justify-center bg-gray-100">
                            <Upload className="h-12 w-12 text-gray-400" />
                        </div>
                    ) : (
                        <img
                            src={casa.imagen}
                            alt={casa.descripcion || `Casa en ${casa.zona}`}
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

                    {/* Badge Estado */}
                    {casa.estado && (
                        <div className={`absolute top-6 left-6 px-2 py-1 rounded-full text-xs font-semibold ${getEstadoBadgeColor(casa.estado)}`}>
                            {casa.estado.toUpperCase()}
                        </div>
                    )}
                </div>

                {/* Contenido */}
                <div className="p-4 flex-1 flex flex-col">
                    {/* Precio */}
                    <div className="mb-3">
                        <p className="text-2xl font-bold text-gray-900">
                            ${formatearPrecio(casa.precio)}
                            <span className="text-sm text-gray-500 font-normal ml-2">USD</span>
                        </p>
                    </div>

                    {/* Badges de Tipo y Operación */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        <span className="inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                            Casa
                        </span>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${getOperationBadgeColor(casa.tipo)}`}>
                            {getOperationLabel(casa.tipo)}
                        </span>

                        
                    </div>

                    {/* Información Básica */}
                    <div className="mb-3 space-y-1">
                        <p className="text-xs text-gray-700 font-medium">
                            {casa.direccion || 'Dirección no especificada'}
                        </p>
                        <p className="text-xs text-gray-600">
                            {casa.zona || 'Zona no especificada'}
                        </p>
                    </div>

                    {/* Superficie */}
                    {casa.superficie > 0 && (
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                            <Maximize className="h-3 w-3" />
                            <span>Superficie: {casa.superficie} m²</span>
                        </div>
                    )}

                    {/* Características Grid */}
                    <div className="grid grid-cols-2 gap-2  text-xs py-3 border-y border-gray-200">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Garaje:</span>
                            <span className="font-medium text-gray-900">
                                {casa.garaje ? 'Sí' : 'No'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Patio:</span>
                            <span className="font-medium text-gray-900">
                                {casa.patio ? 'Sí' : 'No'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Amoblado:</span>
                            <span className="font-medium text-gray-900">
                                {casa.amoblado ? 'Sí' : 'No'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Sótano:</span>
                            <span className="font-medium text-gray-900">
                                {casa.tiene_sotano ? 'Sí' : 'No'}
                            </span>
                        </div>
                    </div>

                    {/* Descripción */}
                    {casa.descripcion && (
                        <div className="mt-3 space-y-1">
                            <h4 className="text-xs font-semibold text-gray-900">Descripción</h4>
                            <p className="text-xs text-gray-600 line-clamp-3">
                                {casa.descripcion}
                            </p>
                        </div>
                    )}

                    {/* Características con iconos */}
                    {(casa.num_dormitorios > 0 || casa.num_banios > 0 || casa.superficie > 0) && (
                        <div className="flex gap-3 mt-3 pt-3 border-t border-gray-200 text-xs text-gray-600">
                            {casa.num_dormitorios > 0 && (
                                <div className="flex items-center gap-1">
                                    <Bed className="h-4 w-4" />
                                    <span>{casa.num_dormitorios}</span>
                                </div>
                            )}
                            {casa.num_banios > 0 && (
                                <div className="flex items-center gap-1">
                                    <Bath className="h-4 w-4" />
                                    <span>{casa.num_banios}</span>
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
        </Link>
    )
}