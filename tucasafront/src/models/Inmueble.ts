import type { Servicio } from "./Servicio"

export type TipoPropiedad = 'LOTE' | 'CASA' | 'DEPARTAMENTO' | ''
export interface Inmueble {
    id: string
    tipo: TipoPropiedad
    latitud: number
    longitud: number
    idPropietario: number
    direccion?: string
    descripcion: string
    numDormitorios: number
    numBanos: number
    superficie: number
    numPisos: number
    precio?: number;
    imagen?: string
    garaje: boolean
    patio: boolean
    amoblado: boolean
    sotano: boolean
    activo: boolean
    servicios: Servicio[]
}

