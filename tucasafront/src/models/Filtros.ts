import type { TipoPropiedad } from "./Inmueble"

export interface Filtros {
    tipo: TipoPropiedad
    zona: string
    precioMin: number
    precioMax: number
    superficieMin: number
    superficieMax: number
    dormitorios: string
}
