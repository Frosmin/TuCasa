import { URL_BACKEND } from "@/config/constants"
import type { ApiResponse } from "./api"
import type { Oferta, TipoOperacion } from "@/models/Oferta"

export async function fetchOfertas(tipoOperacion: TipoOperacion): Promise<Oferta[]> {
    try {
        const response = await fetch(`${URL_BACKEND}/api/oferta?tipoOperacion=${tipoOperacion}`)
        const data: ApiResponse<Oferta[]> = await response.json()

        if (!response.ok || data.error) {
            throw new Error(data.message || 'Error al obtener casas')
        }

        return data.data
    } catch (error) {
        console.error('Error fetching casas:', error)
        throw error
    }
}