import { URL_BACKEND } from "@/config/constants"
import type { ApiResponse } from "./api"
import type { Oferta, TipoOperacion } from "@/models/Oferta"
import type { FiltrosOferta } from "@/models/Filtros"
import { buildQueryParams } from "@/utils/filtros"

export async function fetchOfertas(
    tipoOperacion: TipoOperacion,
    filtros?: Omit<FiltrosOferta, 'tipoOperacion'>
): Promise<Oferta[]> {
    try {
        const parametros: FiltrosOferta = {
            tipoOperacion,
            ...filtros,
        }

        const queryParams = buildQueryParams(parametros)
        const url = `${URL_BACKEND}/api/oferta?${queryParams.toString()}`

        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: ApiResponse<Oferta[]> = await response.json()

        if (data.error) {
            throw new Error(data.message || 'Error al obtener ofertas')
        }

        return data.data || []
    } catch (error) {
        console.error('Error fetching ofertas:', error)
        throw error
    }
}