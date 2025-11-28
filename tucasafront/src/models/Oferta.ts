import type { Inmueble } from "./Inmueble"

export type MonedaType = '$' | 'Bs'

export type EstadoPublicacion = 'pendiente' | 'cancelado' | 'publicado'| 'borrador' | 'rechazado';
export type TipoOperacion = 'VENTA' | 'ALQUILER' | 'ANTICRETICO'

export interface Oferta {
    id: number
    inmueble: Inmueble
    descripcion: string
    descripcion_oferta: string
    tipo: TipoOperacion
    precio: number
    moneda: MonedaType
    duracion?: number | null
    tipoPago: 'unico' | 'mensual' | 'anual'
    fechaPublicacionInicio: string
    fechaPublicacionFin?: string | null
    estadoPublicacion: EstadoPublicacion
    activo: boolean

    esFavorito?: boolean
    totalFavoritos?: number
}

