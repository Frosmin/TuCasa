export interface HistoricoParams {
  fechaInicio: string 
  fechaFin: string 
  tipoOperacion?: 'VENTA' | 'ALQUILER' | 'ANTICRETICO'
  zona?: string
  moneda?: 'Bs' | '$'
  tipoInmueble?: string
}

export interface HistoricoData {
  anio: number
  mes: number
  promedioPrecio: number
  cantidadOfertas: number
}

export interface HistoricoResponse {
  code: number
  data: HistoricoData[]
  error: boolean
  message: string
  status: string
}

export const fetchHistorico = async (params: HistoricoParams): Promise<HistoricoResponse> => {
  const queryParams = new URLSearchParams()
  
  queryParams.append('fechaInicio', params.fechaInicio)
  queryParams.append('fechaFin', params.fechaFin)
  
  if (params.tipoOperacion) queryParams.append('tipoOperacion', params.tipoOperacion)
  if (params.zona) queryParams.append('zona', params.zona)
  if (params.moneda) queryParams.append('moneda', params.moneda)
  if (params.tipoInmueble) queryParams.append('tipoInmueble', params.tipoInmueble)

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  const response = await fetch(`${baseUrl}/tucasabackend/api/oferta/historico?${queryParams.toString()}`)
  
  if (!response.ok) {
    throw new Error('Error al cargar históricos')
  }
  
  return response.json()
}