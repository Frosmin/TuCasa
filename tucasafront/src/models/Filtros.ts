import type { TipoOperacion } from "./Oferta"

export interface FiltrosOferta {
  tipoOperacion?: TipoOperacion
  tipoInmueble?: string
  numDormitorios?: number
  numBanos?: number
  numPisos?: number
  precioMin?: number
  precioMax?: number
  garaje?: boolean
  patio?: boolean
  amoblado?: boolean
  sotano?: boolean
  latitud?: number
  longitud?: number
  proximidad?: number
  orderBy?: string
  searchTerm?: string
}