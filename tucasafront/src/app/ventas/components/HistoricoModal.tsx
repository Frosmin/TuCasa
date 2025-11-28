'use client'
import { useState, useMemo } from 'react'
import { X, TrendingUp, Calendar, DollarSign, Filter, BarChart3, Home } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { fetchHistorico, type HistoricoParams, type HistoricoData } from '@/app/api/historico'
import type { TipoOperacion } from '@/models/Oferta'

interface HistoricoModalProps {
  isOpen: boolean
  onClose: () => void
  tipoOperacion: TipoOperacion
  zonasDisponibles: string[]
}

const MESES_CORTOS = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
]

const MESES_COMPLETOS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]
const TIPOS_INMUEBLE = ['CASA', 'DEPARTAMENTO', 'LOTE', 'TIENDA']

export const HistoricoModal = ({
  isOpen,
  onClose,
  tipoOperacion,
  zonasDisponibles
}: HistoricoModalProps) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [datos, setDatos] = useState<HistoricoData[]>([])

  // Filtros
  const [anio, setAnio] = useState(new Date().getFullYear().toString())
  const [zona, setZona] = useState('')
  const [moneda, setMoneda] = useState<'Bs' | '$' | ''>('')
  const [tipoInmueble, setTipoInmueble] = useState('')
  //Filtros adicionales para cada tipo de inmueble
  const [filtrosAdicionales, setFiltrosAdicionales] = useState<Record<string, any>>({})

  // Generar array de años disponibles (últimos 5 años + año actual)
  const aniosDisponibles = useMemo(() => {
    const anioActual = new Date().getFullYear()
    return Array.from({ length: 6 }, (_, i) => anioActual - i)
  }, [])

  interface FiltroConfig {
    key: string
    label: string
    type: 'select' | 'boolean' | 'number'
    options?: string[]
  }

  const filtrosDisponibles = useMemo((): FiltroConfig[] => {
    if (!tipoInmueble) return []

    const filtrosBase: Record<string, FiltroConfig[]> = {
      CASA: [
        { key: 'numDormitorios', label: 'Dormitorios', type: 'select', options: ['1', '2', '3', '4', '5+'] },
        { key: 'numBanos', label: 'Baños', type: 'select', options: ['1', '2', '3', '4+'] },
        { key: 'numPisos', label: 'Pisos', type: 'select', options: ['1', '2', '3', '4+'] },
        { key: 'garaje', label: 'Garaje', type: 'boolean' },
        { key: 'patio', label: 'Patio', type: 'boolean' },
        { key: 'amoblado', label: 'Amoblado', type: 'boolean' },
        { key: 'sotano', label: 'Sótano', type: 'boolean' }
      ],
      DEPARTAMENTO: [
        { key: 'deptoNumDormitorios', label: 'Dormitorios', type: 'select', options: ['1', '2', '3', '4+'] },
        { key: 'deptoNumBanos', label: 'Baños', type: 'select', options: ['1', '2', '3+'] },
        { key: 'deptoPiso', label: 'Piso', type: 'select', options: ['1', '2', '3', '4', '5', '6+'] },
        { key: 'deptoAmoblado', label: 'Amoblado', type: 'boolean' },
        { key: 'ascensor', label: 'Ascensor', type: 'boolean' },
        { key: 'balcon', label: 'Balcón', type: 'boolean' }
      ],
      LOTE: [
        { key: 'tamano', label: 'Tamaño mínimo (m²)', type: 'number' },
        { key: 'muroPerimetral', label: 'Muro Perimetral', type: 'boolean' }
      ],
      TIENDA: [
        { key: 'tamano', label: 'Tamaño mínimo (m²)', type: 'number' },
        { key: 'numAmbientes', label: 'Ambientes', type: 'select', options: ['1', '2', '3', '4+'] },
        { key: 'banoPrivado', label: 'Baño Privado', type: 'boolean' },
        { key: 'deposito', label: 'Depósito', type: 'boolean' }
      ]
    }

    return filtrosBase[tipoInmueble as keyof typeof filtrosBase] || []
  }, [tipoInmueble])

  const cargarHistorico = async () => {
    if (!anio) {
      setError('Debe seleccionar un año')
      return
    }

    if (!tipoInmueble) {
      setError('Debe seleccionar un tipo de inmueble')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const fechaInicio = `${anio}-01-01`
      const fechaFin = `${anio}-12-31`

      const params: HistoricoParams = {
        fechaInicio,
        fechaFin,
        tipoOperacion,
        tipoInmueble,
        ...filtrosAdicionales
      }

      if (zona) params.zona = zona
      if (moneda) params.moneda = moneda

      const response = await fetchHistorico(params)

      const datosOrdenados = response.data.sort((a, b) => a.mes - b.mes)
      setDatos(datosOrdenados)

      if (datosOrdenados.length === 0) {
        setError('No se encontraron datos para los filtros seleccionados')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos')
    } finally {
      setLoading(false)
    }
  }
  // Preparar datos para el gráfico
  const datosGrafico = useMemo(() => {
    return datos.map(d => ({
      mes: MESES_CORTOS[d.mes - 1],
      mesCompleto: MESES_COMPLETOS[d.mes - 1],
      precio: Math.round(d.promedioPrecio),
      ofertas: d.cantidadOfertas
    }))
  }, [datos])

  // Estadísticas calculadas
  const estadisticas = useMemo(() => {
    if (datos.length === 0) return null

    const precios = datos.map(d => d.promedioPrecio)
    const ofertas = datos.map(d => d.cantidadOfertas)

    return {
      promedioGeneral: precios.reduce((a, b) => a + b, 0) / precios.length,
      precioMaximo: Math.max(...precios),
      precioMinimo: Math.min(...precios),
      totalOfertas: ofertas.reduce((a, b) => a + b, 0),
      tendencia: precios[precios.length - 1] > precios[0] ? 'alza' : 'baja',
      variacionPorcentual: ((precios[precios.length - 1] - precios[0]) / precios[0]) * 100
    }
  }, [datos])

  const formatearPrecio = (precio: number) => {
    return precio.toLocaleString('es-BO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  }


  // Tooltip personalizado para el gráfico
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: { mesCompleto: string; ofertas: number } }> }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{payload[0].payload.mesCompleto}</p>
          <p className="text-blue-600 font-medium">
            Precio: {formatearPrecio(payload[0].value)}
          </p>
          <p className="text-gray-600 text-sm">
            Ofertas: {payload[0].payload.ofertas}
          </p>
        </div>
      )
    }
    return null
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">
              Evolución de Precios {anio} - {tipoOperacion}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filtros */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Año *
              </label>
              <select
                value={anio}
                onChange={(e) => setAnio(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {aniosDisponibles.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Home className="w-4 h-4 inline mr-1" />
                Tipo de Inmueble *
              </label>
              <select
                value={tipoInmueble}
                onChange={(e) => {
                  setTipoInmueble(e.target.value)
                  setFiltrosAdicionales({}) 
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccione un tipo</option>
                {TIPOS_INMUEBLE.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-1" />
                Zona
              </label>
              <select
                value={zona}
                onChange={(e) => setZona(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todas las zonas</option>
                {zonasDisponibles.map(z => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Moneda
              </label>
              <select
                value={moneda}
                onChange={(e) => setMoneda(e.target.value as 'Bs' | '$' | '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todas</option>
                <option value="$">Dólares ($)</option>
                <option value="Bs">Bolivianos (Bs)</option>
              </select>
            </div>
          </div>

          {/* Filtros Dinámicos según tipo de inmueble */}
          {tipoInmueble && filtrosDisponibles.length > 0 && (
            <div className="border-t pt-4 mt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filtros Adicionales
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filtrosDisponibles.map(filtro => (
                  <div key={filtro.key}>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      {filtro.label}
                    </label>
                    {filtro.type === 'select' && (
                      <select
                        value={filtrosAdicionales[filtro.key] || ''}
                        onChange={(e) => setFiltrosAdicionales(prev => ({
                          ...prev,
                          [filtro.key]: e.target.value
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Todos</option>
                        {filtro.options?.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )}
                    {filtro.type === 'boolean' && (
                      <select
                        value={filtrosAdicionales[filtro.key] || ''}
                        onChange={(e) => setFiltrosAdicionales(prev => ({
                          ...prev,
                          [filtro.key]: e.target.value
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Indiferente</option>
                        <option value="true">Sí</option>
                        <option value="false">No</option>
                      </select>
                    )}
                    {filtro.type === 'number' && (
                      <input
                        type="number"
                        value={filtrosAdicionales[filtro.key] || ''}
                        onChange={(e) => setFiltrosAdicionales(prev => ({
                          ...prev,
                          [filtro.key]: e.target.value
                        }))}
                        placeholder="Mínimo"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={cargarHistorico}
            disabled={loading || !anio || !tipoInmueble}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-medium py-2 px-4 rounded-lg transition mt-4"
          >
            {loading ? 'Cargando...' : 'Consultar Histórico'}
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {estadisticas && (
            <>
              {/* Estadísticas Generales */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Promedio {anio}</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {formatearPrecio(estadisticas.promedioGeneral)}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Precio Máximo</p>
                  <p className="text-2xl font-bold text-green-900">
                    {formatearPrecio(estadisticas.precioMaximo)}
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-orange-600 font-medium">Precio Mínimo</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {formatearPrecio(estadisticas.precioMinimo)}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600 font-medium">Total Ofertas</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {estadisticas.totalOfertas}
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${estadisticas.tendencia === 'alza' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                  <p className={`text-sm font-medium ${estadisticas.tendencia === 'alza' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    Variación Anual
                  </p>
                  <p className={`text-2xl font-bold ${estadisticas.tendencia === 'alza' ? 'text-emerald-900' : 'text-rose-900'}`}>
                    {estadisticas.tendencia === 'alza' ? '↑' : '↓'} {Math.abs(estadisticas.variacionPorcentual).toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Gráfico de Evolución */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  Evolución de Precios por Mes
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={datosGrafico}>
                    <defs>
                      <linearGradient id="colorPrecio" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="mes"
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                      tickFormatter={(value: number) => formatearPrecio(value)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="precio"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fill="url(#colorPrecio)"
                      name="Precio Promedio"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Tabla de Datos */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Mes</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Precio Promedio</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Ofertas</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Variación</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {datos.map((dato, index) => {
                        const anterior = index > 0 ? datos[index - 1].promedioPrecio : dato.promedioPrecio
                        const cambio = ((dato.promedioPrecio - anterior) / anterior) * 100
                        const esPositivo = cambio >= 0

                        return (
                          <tr key={`${dato.anio}-${dato.mes}`} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                              {MESES_COMPLETOS[dato.mes - 1]}
                            </td>
                            <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">
                              {formatearPrecio(dato.promedioPrecio)}
                            </td>
                            <td className="px-4 py-3 text-sm text-right text-gray-600">
                              {dato.cantidadOfertas}
                            </td>
                            <td className="px-4 py-3 text-sm text-right">
                              {index > 0 ? (
                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${esPositivo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                  {esPositivo ? '↑' : '↓'} {Math.abs(cambio).toFixed(1)}%
                                </span>
                              ) : (
                                <span className="text-gray-400 text-xs">-</span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {!loading && !error && datos.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Seleccione los filtros y presione "Consultar Histórico"</p>
              <p className="text-sm mt-2">Visualice la evolución de precios mes a mes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}