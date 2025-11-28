export interface HistoricoParams {
  fechaInicio: string 
  fechaFin: string 
  tipoOperacion?: 'VENTA' | 'ALQUILER' | 'ANTICRETICO'
  zona?: string
  moneda?: 'Bs' | '$'
  tipoInmueble?: string
  // Filtros CASA
  numDormitorios?: string
  numBanos?: string
  numPisos?: string
  garaje?: string
  patio?: string
  amoblado?: string
  sotano?: string
  // Filtros DEPARTAMENTO
  deptoNumDormitorios?: string
  deptoNumBanos?: string
  deptoPiso?: string
  deptoAmoblado?: string
  ascensor?: string
  balcon?: string
  // Filtros LOTE
  tamano?: string
  muroPerimetral?: string
  // Filtros TIENDA
  numAmbientes?: string
  banoPrivado?: string
  deposito?: string
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
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== null) {
      queryParams.append(key, String(value))
    }
  })

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/tucasabackend'
  const response = await fetch(`${baseUrl}/api/oferta/historico?${queryParams.toString()}`)
  
  if (!response.ok) {
    throw new Error('Error al cargar históricos')
  }
  
  return response.json()
}