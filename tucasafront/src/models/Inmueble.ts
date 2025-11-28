import type { Servicio } from "./Servicio"

export type TipoPropiedad = 'CASA' | 'DEPARTAMENTO' | 'LOTE' | 'TIENDA'


export interface Inmueble {
    id: number
    direccion: string
    latitud: number
    longitud: number
    // zona: string
    superficie: number
    idPropietario: number
    descripcion: string
    descripcion_oferta: string
    activo: boolean
    tipo: TipoPropiedad
    servicios?: Servicio[]
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
    muroPerimetral?: boolean
    parqueo?: boolean
    balcon?: boolean
    mascotasPermitidas?: boolean
    baulera?: boolean
    ascensor?: boolean
    zona?: string
}

