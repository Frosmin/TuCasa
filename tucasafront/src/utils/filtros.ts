import type { FiltrosOferta } from "@/models/Filtros"

export function buildQueryParams(filtros: FiltrosOferta): URLSearchParams {
  const params = new URLSearchParams()

  if (filtros.tipoOperacion) params.append('tipoOperacion', filtros.tipoOperacion)
  if (filtros.tipoInmueble) params.append('tipoInmueble', filtros.tipoInmueble)
  if (filtros.numDormitorios) params.append('numDormitorios', String(filtros.numDormitorios))
  if (filtros.numBanos) params.append('numBanos', String(filtros.numBanos))
  if (filtros.numPisos) params.append('numPisos', String(filtros.numPisos))
  if (filtros.precioMin !== undefined) params.append('precioMin', String(filtros.precioMin))
  if (filtros.precioMax !== undefined) params.append('precioMax', String(filtros.precioMax))
  if (filtros.garaje !== undefined) params.append('garaje', String(filtros.garaje))
  if (filtros.patio !== undefined) params.append('patio', String(filtros.patio))
  if (filtros.amoblado !== undefined) params.append('amoblado', String(filtros.amoblado))
  if (filtros.sotano !== undefined) params.append('sotano', String(filtros.sotano))
  if (filtros.latitud !== undefined) params.append('latitud', String(filtros.latitud))
  if (filtros.longitud !== undefined) params.append('longitud', String(filtros.longitud))
  if (filtros.proximidad !== undefined) params.append('proximidad', String(filtros.proximidad))
  if (filtros.orderBy) params.append('orderBy', filtros.orderBy)

  return params
}