import { URL_BACKEND } from "@/config/constants"
import type { Oferta, TipoOperacion, MonedaType } from "@/models/Oferta"
import type { FiltrosOferta } from "@/models/Filtros"
import { buildQueryParams } from "@/utils/filtros"

// Interfaz para la respuesta de la API con estadísticas
export interface ApiResponseWithStats<T> {
    error?: boolean
    message?: string
    code: number
    data: T
    average?: number  // Promedio de precios
    totalResults?: number  // Total de resultados
}

// Interfaz para los resultados de ofertas con estadísticas
export interface OfertasResult {
    ofertas: Oferta[]
    promedioPrecio: number
    totalResultados: number
    promediosPorMoneda?: {
        '$'?: number
        'Bs'?: number
    }
}

export async function fetchOfertas(
    tipoOperacion: TipoOperacion,
    filtros?: Omit<FiltrosOferta, 'tipoOperacion'>
): Promise<OfertasResult> {
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

        const data: ApiResponseWithStats<Oferta[]> = await response.json()

        if (data.error) {
            throw new Error(data.message || 'Error al obtener ofertas')
        }

        const ofertas = data.data || []
        
        // Calcular promedios por moneda si hay ofertas
        const promediosPorMoneda = calcularPromediosPorMoneda(ofertas)

        return {
            ofertas,
            promedioPrecio: data.average || 0,
            totalResultados: data.totalResults || ofertas.length,
            promediosPorMoneda
        }
    } catch (error) {
        console.error('Error fetching ofertas:', error)
        throw error
    }
}

// Función auxiliar para calcular promedios por moneda
function calcularPromediosPorMoneda(ofertas: Oferta[]): { '$'?: number; 'Bs'?: number } {
    const promedios: { '$'?: number; 'Bs'?: number } = {}
    
    const monedas: MonedaType[] = ['$', 'Bs']
    
    monedas.forEach(moneda => {
        const ofertasMoneda = ofertas.filter(o => o.moneda === moneda)
        if (ofertasMoneda.length > 0) {
            const suma = ofertasMoneda.reduce((acc, o) => acc + o.precio, 0)
            promedios[moneda] = suma / ofertasMoneda.length
        }
    })
    
    return promedios
}