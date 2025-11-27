'use client'
import { useEffect, useMemo, useState } from 'react'
import { Home, Building2, MapPin, Store, TrendingUp, BarChart3 } from 'lucide-react'
import Loading from '@/components/Loading'
import type { Oferta, TipoOperacion } from '@/models/Oferta'
import { fetchOfertas, type OfertasResult } from '@/api/oferta'
import { SearchBar } from '@/app/ventas/components/SearchBar'
import { FiltroSidebar, type Filtros } from '@/app/ventas/components/FiltroSidebar'
import { ResultadosOfertas } from '@/app/ventas/components/ResultadosOfertas'
import { HistoricoModal } from '@/app/ventas/components/HistoricoModal'

interface CatalogPageProps {
  tipoOperacion: TipoOperacion
}

// Coordenadas de Cochabamba
const COCHABAMBA_CENTER = { lat: -17.392902, lng: -66.144739 }

// Función utilitaria para calcular distancia (Haversine)
const calcularDistancia = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371 // Radio de la Tierra en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export const CatalogPage = ({ tipoOperacion }: CatalogPageProps) => {
  const [mostrarHistorico, setMostrarHistorico] = useState(false)
  const [ofertas, setOfertas] = useState<Oferta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tipoInmuebleSeleccionado, setTipoInmuebleSeleccionado] = useState('')
  const [filters, setFilters] = useState<Filtros>({
    precioMin: 0,
    precioMax: Infinity,
    superficieMin: 0,
    superficieMax: Infinity,
    dormitorios: '',
    garaje: null,
    amoblado: null,
    sotano: null,
    patio: null,
    servicios: [],
    moneda: '',
    proximidad: null,
    latitud: COCHABAMBA_CENTER.lat,
    longitud: COCHABAMBA_CENTER.lng,
    zona: '',
  })
  const [searchTerm, setSearchTerm] = useState('')
  

  const zonasUnicas = useMemo(() => {
    const zonas = new Set(
      ofertas
        .map(o => o.inmueble.zona)
        .filter(Boolean)
    )
    return Array.from(zonas).sort() as string[]
  }, [ofertas])

  const tiposPropiedad = [
    { id: '', label: 'Todos', icon: Home },
    { id: 'CASA', label: 'Casas', icon: Home },
    { id: 'DEPARTAMENTO', label: 'Departamentos', icon: Building2 },
    { id: 'LOTE', label: 'Lotes', icon: MapPin },
    { id: 'TIENDA', label: 'Tiendas', icon: Store },
  ] as const

  // Validar y corregir coordenadas
  const validarCoordenadas = (lat: number, lng: number) => {
    if (Math.abs(lat) > 90 || Math.abs(lng) > 180) {
      return { lat: lng, lng: lat }
    }
    if (Math.abs(lat) > Math.abs(lng)) {
      return { lat: lng, lng: lat }
    }
    return { lat, lng }
  }

  // Cargar ofertas del backend
  useEffect(() => {
    const cargarOfertas = async () => {
      try {
        setLoading(true)
        setError(null)

        const result: OfertasResult = await fetchOfertas(tipoOperacion)

        // Filtrar inmuebles con coordenadas válidas y corregidas
        const dataPublicadas = result.ofertas.filter(o => o.estadoPublicacion === 'publicado');
        const datosValidos = dataPublicadas
          .map(o => {
            const { lat, lng } = validarCoordenadas(o.inmueble.latitud, o.inmueble.longitud)
            return {
              ...o,
              inmueble: {
                ...o.inmueble,
                latitud: lat,
                longitud: lng,
              }
            }
          })
          .filter(o => o.inmueble.latitud !== 0 && o.inmueble.longitud !== 0)

        setOfertas(datosValidos)

        if (datosValidos.length > 0) {
          setFilters(prev => ({
            ...prev,
            latitud: COCHABAMBA_CENTER.lat,
            longitud: COCHABAMBA_CENTER.lng,
          }))
        }
      } catch (err) {
        const mensaje = err instanceof Error ? err.message : 'Error desconocido'
        setError(mensaje)
      } finally {
        setLoading(false)
      }
    }

    cargarOfertas()
  }, [tipoOperacion])

  // Obtener tipos de inmuebles únicos
  const tiposUnicos = useMemo(() => {
    const tipos = new Set(
      ofertas
        .map(o => o.inmueble.tipo)
        .filter(Boolean)
    )
    return Array.from(tipos).sort() as string[]
  }, [ofertas])

  // Pre-calcular distancias para optimización
  const ofertasConDistancia = useMemo(() => {
    return ofertas.map(oferta => ({
      oferta,
      distancia: calcularDistancia(
        filters.latitud,
        filters.longitud,
        oferta.inmueble.latitud,
        oferta.inmueble.longitud
      )
    }))
  }, [ofertas, filters.latitud, filters.longitud])

  const ofertasFiltradas = useMemo(() => {
    return ofertasConDistancia
      .filter(({ oferta, distancia }) => {
        if (tipoInmuebleSeleccionado && oferta.inmueble.tipo !== tipoInmuebleSeleccionado) {
          return false
        }
        if (filters.zona && oferta.inmueble.zona !== filters.zona) {
          return false
        }

        if (searchTerm) {
          const termo = searchTerm.toLowerCase()
          const coincide =
            oferta.descripcion.toLowerCase().includes(termo) ||
            oferta.inmueble.descripcion.toLowerCase().includes(termo) ||
            oferta.inmueble.direccion.toLowerCase().includes(termo) ||
            (oferta.inmueble.zona && oferta.inmueble.zona.toLowerCase().includes(termo))
          if (!coincide) return false
        }

        if (filters.proximidad && filters.proximidad > 0) {
          if (distancia > filters.proximidad) {
            return false
          }
        }

        if (oferta.precio < filters.precioMin || oferta.precio > filters.precioMax) {
          return false
        }

        if (oferta.inmueble.superficie < filters.superficieMin || oferta.inmueble.superficie > filters.superficieMax) {
          return false
        }

        if (filters.dormitorios && oferta.inmueble.numDormitorios) {
          if (oferta.inmueble.numDormitorios !== parseInt(filters.dormitorios)) {
            return false
          }
        }

        if (filters.garaje === true && !oferta.inmueble.garaje) {
          return false
        }

        if (filters.amoblado === true && !oferta.inmueble.amoblado) {
          return false
        }

        if (filters.patio === true && !oferta.inmueble.patio) {
          return false
        }

        if (filters.sotano === true && !oferta.inmueble.sotano) {
          return false
        }

        if (filters.moneda && oferta.moneda !== filters.moneda) {
          return false
        }

        if (filters.servicios && filters.servicios.length > 0) {
          const servicios = oferta.inmueble.servicios || []
          const serviciosInmueble = servicios.map(s => s.nombre)
          const tieneServicios = filters.servicios.every(servicio =>
            serviciosInmueble.includes(servicio)
          )
          if (!tieneServicios) return false
        }

        return true
      })
      .map(({ oferta }) => oferta)
  }, [ofertasConDistancia, tipoInmuebleSeleccionado, searchTerm, filters])

  // Calcular promedio SOLO por zona y tipo de inmueble (independiente de otros filtros)
  const promediosPorZona = useMemo(() => {
    // Filtrar solo por zona y tipo de inmueble seleccionados
    let ofertasParaPromedio = ofertas

    if (filters.zona) {
      ofertasParaPromedio = ofertasParaPromedio.filter(o => o.inmueble.zona === filters.zona)
    }

    if (tipoInmuebleSeleccionado) {
      ofertasParaPromedio = ofertasParaPromedio.filter(o => o.inmueble.tipo === tipoInmuebleSeleccionado)
    }

    if (ofertasParaPromedio.length === 0) {
      return {
        promedio: 0,
        porMoneda: {},
        total: 0
      }
    }

    // Promedio general
    const suma = ofertasParaPromedio.reduce((acc, o) => acc + o.precio, 0)
    const promedio = suma / ofertasParaPromedio.length

    // Promedios por moneda
    const promedios: { '$'?: number; 'Bs'?: number } = {}
    const monedas = ['$', 'Bs'] as const

    monedas.forEach(moneda => {
      const ofertasMoneda = ofertasParaPromedio.filter(o => o.moneda === moneda)
      if (ofertasMoneda.length > 0) {
        const suma = ofertasMoneda.reduce((acc, o) => acc + o.precio, 0)
        promedios[moneda] = suma / ofertasMoneda.length
      }
    })

    return {
      promedio,
      porMoneda: promedios,
      total: ofertasParaPromedio.length
    }
  }, [ofertas, filters.zona, tipoInmuebleSeleccionado])

  const limpiarFiltrosCompleto = () => {
    setFilters({
      precioMin: 0,
      precioMax: Infinity,
      superficieMin: 0,
      superficieMax: Infinity,
      dormitorios: '',
      garaje: null,
      amoblado: null,
      sotano: null,
      patio: null,
      servicios: [],
      moneda: '',
      proximidad: null,
      latitud: COCHABAMBA_CENTER.lat,
      longitud: COCHABAMBA_CENTER.lng,
      zona: '',
    })
    setSearchTerm('')
    setTipoInmuebleSeleccionado('')
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error al cargar</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return <Loading message="Cargando ofertas..." />
  }

  const formatearPrecio = (precio: number) => {
    return precio.toLocaleString('es-BO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Selector de Tipo de Propiedad */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {tiposPropiedad.map(({ id, label, icon: Icon }) => {
                const length = ofertas.filter(o => id === '' || o.inmueble.tipo === id).length
                return (
                  <button
                    key={id}
                    onClick={() => setTipoInmuebleSeleccionado(id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 transition-all duration-300 font-medium whitespace-nowrap ${tipoInmuebleSeleccionado === id
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    {label} ({length})
                  </button>
                )
              })}
            </div>
            {/* Botón de Histórico */}
            <button
              onClick={() => setMostrarHistorico(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-indigo-500 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all duration-300 font-medium whitespace-nowrap"
            >
              <TrendingUp className="w-5 h-5" />
              Ver Histórico
            </button>
          </div>
        </div>
      </div>

      {/* Banner de Estadísticas - Basado en ZONA seleccionada */}
      {promediosPorZona.promedio > 0 && (
        <div className="max-w-7xl mx-auto px-4 pt-6">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-blue-100 font-medium">
                    Precio promedio {filters.zona ? `en ${filters.zona}` : 'del mercado'}
                    {tipoInmuebleSeleccionado && ` - ${tiposPropiedad.find(t => t.id === tipoInmuebleSeleccionado)?.label}`}
                  </p>
                  <p className="text-3xl font-bold">{formatearPrecio(promediosPorZona.promedio)}</p>
                </div>
              </div>

              {(promediosPorZona.porMoneda['$'] || promediosPorZona.porMoneda['Bs']) && (
                <div className="flex gap-6">
                  {promediosPorZona.porMoneda['$'] && (
                    <div className="text-right">
                      <p className="text-sm text-blue-100 font-medium">Promedio en Dólares</p>
                      <p className="text-2xl font-bold">$ {formatearPrecio(promediosPorZona.porMoneda['$'])}</p>
                    </div>
                  )}
                  {promediosPorZona.porMoneda['Bs'] && (
                    <div className="text-right">
                      <p className="text-sm text-blue-100 font-medium">Promedio en Bolivianos</p>
                      <p className="text-2xl font-bold">Bs {formatearPrecio(promediosPorZona.porMoneda['Bs'])}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-100 mt-3">
              <BarChart3 className="w-4 h-4" />
              <p>
                Basado en {promediosPorZona.total} propiedades
                {filters.zona && ` en la zona de ${filters.zona}`}
                {tipoInmuebleSeleccionado && !filters.zona && ` del tipo ${tiposPropiedad.find(t => t.id === tipoInmuebleSeleccionado)?.label}`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Buscador */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filtros */}
          <div className="lg:col-span-1">
            <FiltroSidebar
              ofertas={ofertas}
              filters={filters}
              setFilters={setFilters}
              tipos={tiposUnicos}
              tipoInmueble={tipoInmuebleSeleccionado}
            />
          </div>

          {/* Resultados */}
          <div className="lg:col-span-3">
            <ResultadosOfertas
              ofertas={ofertasFiltradas}
              onLimpiarFiltros={limpiarFiltrosCompleto}
            />
          </div>
        </div>
      </div>
      <HistoricoModal
        isOpen={mostrarHistorico}
        onClose={() => setMostrarHistorico(false)}
        tipoOperacion={tipoOperacion}
        zonasDisponibles={zonasUnicas}
        tiposInmueble={tiposUnicos}
      />
    </div>
  )
}

export default CatalogPage