'use client'
import { useState, useEffect, useMemo } from 'react'
import { X, TrendingUp, Calendar, DollarSign, Filter } from 'lucide-react'
import { fetchHistorico, type HistoricoParams, type HistoricoData } from '@/app/api/historico'
import type { TipoOperacion } from '@/models/Oferta'

interface HistoricoModalProps {
  isOpen: boolean
  onClose: () => void
  tipoOperacion: TipoOperacion
  zonasDisponibles: string[]
  tiposInmueble: string[]
}

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

export const HistoricoModal = ({
  isOpen,
  onClose,
  tipoOperacion,
  zonasDisponibles,
  tiposInmueble
}: HistoricoModalProps) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [datos, setDatos] = useState<HistoricoData[]>([])

  // Filtros
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [zona, setZona] = useState('')
  const [moneda, setMoneda] = useState<'Bs' | '$' | ''>('')
  const [tipoInmueble, setTipoInmueble] = useState('')

  // Inicializar fechas por defecto (último año)
  useEffect(() => {
    const hoy = new Date()
    const haceUnAno = new Date()
    haceUnAno.setFullYear(hoy.getFullYear() - 1)
    
    setFechaFin(hoy.toISOString().split('T')[0])
    setFechaInicio(haceUnAno.toISOString().split('T')[0])
  }, [])

  const cargarHistorico = async () => {
    if (!fechaInicio || !fechaFin) {
      setError('Debe seleccionar un rango de fechas')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const params: HistoricoParams = {
        fechaInicio,
        fechaFin,
        tipoOperacion
      }

      if (zona) params.zona = zona
      if (moneda) params.moneda = moneda
      if (tipoInmueble) params.tipoInmueble = tipoInmueble

      const response = await fetchHistorico(params)
      setDatos(response.data)

      if (response.data.length === 0) {
        setError('No se encontraron datos para los filtros seleccionados')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos')
    } finally {
      setLoading(false)
    }
  }

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
      tendencia: precios[precios.length - 1] > precios[0] ? 'alza' : 'baja'
    }
  }, [datos])

  const formatearPrecio = (precio: number) => {
    return precio.toLocaleString('es-BO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">
              Histórico de Precios - {tipoOperacion}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Fecha Inicio *
              </label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Fecha Fin *
              </label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                <Filter className="w-4 h-4 inline mr-1" />
                Tipo de Inmueble
              </label>
              <select
                value={tipoInmueble}
                onChange={(e) => setTipoInmueble(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos</option>
                {tiposInmueble.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={cargarHistorico}
            disabled={loading || !fechaInicio || !fechaFin}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-medium py-2 px-4 rounded-lg transition"
          >
            {loading ? 'Cargando...' : 'Consultar Histórico'}
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-300px)]">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {estadisticas && (
            <>
              {/* Estadísticas Generales */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Promedio General</p>
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
              </div>

              {/* Tabla de Datos */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Período</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Precio Promedio</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Ofertas</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Tendencia</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {datos.map((dato, index) => {
                      const anterior = index > 0 ? datos[index - 1].promedioPrecio : dato.promedioPrecio
                      const cambio = ((dato.promedioPrecio - anterior) / anterior) * 100
                      const esPositivo = cambio >= 0

                      return (
                        <tr key={`${dato.anio}-${dato.mes}`} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {MESES[dato.mes - 1]} {dato.anio}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">
                            {formatearPrecio(dato.promedioPrecio)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-gray-600">
                            {dato.cantidadOfertas}
                          </td>
                          <td className="px-4 py-3 text-sm text-right">
                            {index > 0 && (
                              <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                esPositivo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {esPositivo ? '↑' : '↓'} {Math.abs(cambio).toFixed(1)}%
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {!loading && !error && datos.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Seleccione los filtros y presione "Consultar Histórico"
            </div>
          )}
        </div>
      </div>
    </div>
  )
}