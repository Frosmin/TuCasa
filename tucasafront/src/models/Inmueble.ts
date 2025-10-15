import type { Servicio } from "./Servicio"

export type TipoPropiedad = 'CASA' | 'DEPARTAMENTO' | 'LOTE' | 'TIENDA' | ''


export interface Inmueble {
    id: number
    direccion: string
    latitud: number
    longitud: number
    superficie: number
    idPropietario: number
    descripcion: string
    activo: boolean
    tipo: TipoPropiedad
    servicios: Servicio[]
    url_imagen?: string | null
    numDormitorios?: number
    numBanos?: number
    numPisos?: number
    garaje?: boolean
    patio?: boolean
    amoblado?: boolean
    sotano?: boolean
    numAmbientes?: number
    banoPrivado?: boolean
    deposito?: boolean
}

