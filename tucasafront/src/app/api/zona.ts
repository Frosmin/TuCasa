export interface ZonaConInmuebles {
  zona: string
  cantidad_inmuebles: number
}

export interface ZonasResponse {
  code: number
  data: ZonaConInmuebles[]
  error: boolean
  message: string
  status: string
}

export const fetchZonasConInmuebles = async (): Promise<string[]> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/tucasabackend'
  const response = await fetch(`${baseUrl}/api/zonas/ofertas`)
  
  if (!response.ok) {
    throw new Error('Error al obtener las zonas')
  }
  
  const result: ZonasResponse = await response.json()
  return result.data.map(z => z.zona).sort()
}