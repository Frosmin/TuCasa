import { URL_BACKEND } from "@/config/constants"
import type { Inmueble } from "@/models/Inmueble"
import type { ApiResponse } from "./api"

export async function fetchCasas(): Promise<Inmueble[]> {
    try {
        const response = await fetch(`${URL_BACKEND}/api/casa`)
        const data: ApiResponse<Inmueble[]> = await response.json()

        if (!response.ok || data.error) {
            throw new Error(data.message || 'Error al obtener casas')
        }

        return data.data
    } catch (error) {
        console.error('Error fetching casas:', error)
        throw error
    }
}