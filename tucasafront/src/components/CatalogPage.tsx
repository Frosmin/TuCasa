'use client'
import { useEffect, useMemo, useState } from 'react'
import { Home, Building2, MapPin, Store } from 'lucide-react'
import Loading from '@/components/Loading'
import type { Oferta, TipoOperacion } from '@/models/Oferta'
import { fetchOfertas } from '@/api/oferta'
import { SearchBar } from '@/app/ventas/components/SearchBar'
import { FiltroSidebar, type Filtros } from '@/app/ventas/components/FiltroSidebar'
import { ResultadosOfertas } from '@/app/ventas/components/ResultadosOfertas'

interface CatalogPageProps {
  tipoOperacion: TipoOperacion
}

const COCHABAMBA_CENTER = { lat: -17.392902, lng: -66.144739 }

// Calcular distancia
const calcularDistancia = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371
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
  })
  const [searchTerm, setSearchTerm] = useState('')

  const tiposPropiedad = [
    { id: '', label: 'Todos', icon: Home },
    { id: 'CASA', label: 'Casas', icon: Home },
    { id: 'DEPARTAMENTO', label: 'Departamentos', icon: Building2 },
    { id: 'LOTE', label: 'Lotes', icon: MapPin },
    { id: 'TIENDA', label: 'Tiendas', icon: Store },
  ] as const

  // Validar coordenadas
  const validarCoordenadas = (lat: number, lng: number) => {
    if (Math.abs(lat) > 90 || Math.abs(lng) > 180) {
      return { lat: lng, lng: lat }
    }
    if (Math.abs(lat) > Math.abs(lng)) {
      return { lat: lng, lng: lat }
    }
    return { lat, lng }
  }

  // 🔥 Cargar ofertas del backend (solo PUBLICADAS)
  useEffect(() => {
    const cargarOfertas = async () => {
      try {
        setLoading(true)
        setError(null)

        const data = await fetchOfertas(tipoOperacion)

        // 🔥 FILTRAR SOLO PUBLICADAS
        const dataPublicadas = data.filter(o => o.estadoPublicacion === 'publicado')

        // Filtrar inmuebles válidos y corregir lat/lng
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

      } catch (err) {
        const mensaje = err instanceof Error ? err.message : 'Error desconocido'
        setError(mensaje)
      } finally {
        setLoading(false)
      }
    }

    cargarOfertas()
  }, [tipoOperacion])

  // Tipos únicos
  const tiposUnicos = useMemo(() => {
    const tipos = new Set(
      ofertas.map(o => o.inmueble.tipo).filter(Boolean)
    )
    return Array.from(tipos).sort() as string[]
  }, [ofertas])

  // Pre-calcular distancias
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

  // Aplicar filtros
  const ofertasFiltradas = useMemo(() => {
    return ofertasConDistancia
      .filter(({ oferta, distancia }) => {
        if (tipoInmuebleSeleccionado && oferta.inmueble.tipo !== tipoInmuebleSeleccionado) return false

        if (searchTerm) {
          const termo = searchTerm.toLowerCase()
          const coincide =
            oferta.descripcion.toLowerCase().includes(termo) ||
            oferta.inmueble.descripcion.toLowerCase().includes(termo) ||
            oferta.inmueble.direccion.toLowerCase().includes(termo)
          if (!coincide) return false
        }

        if (filters.proximidad && distancia > filters.proximidad) return false

        if (oferta.precio < filters.precioMin || oferta.precio > filters.precioMax) return false

        if (oferta.inmueble.superficie < filters.superficieMin ||
            oferta.inmueble.superficie > filters.superficieMax) return false

        if (filters.dormitorios && oferta.inmueble.numDormitorios &&
            oferta.inmueble.numDormitorios !== parseInt(filters.dormitorios)) return false

        if (filters.garaje && !oferta.inmueble.garaje) return false
        if (filters.amoblado && !oferta.inmueble.amoblado) return false
        if (filters.patio && !oferta.inmueble.patio) return false
        if (filters.sotano && !oferta.inmueble.sotano) return false

        if (filters.moneda && oferta.moneda !== filters.moneda) return false

        if ((filters.servicios ?? []).length > 0) {
  const serviciosInmueble = (oferta.inmueble.servicios || []).map(s => s.nombre)
  if (!(filters.servicios ?? []).every(s => serviciosInmueble.includes(s))) return false
}


        return true
      })
      .map(({ oferta }) => oferta)
  }, [ofertasConDistancia, tipoInmuebleSeleccionado, searchTerm, filters])

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

  if (loading) return <Loading message="Cargando ofertas..." />

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Selector de Tipo */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {tiposPropiedad.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTipoInmuebleSeleccionado(id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 transition-all duration-300 font-medium ${
                  tipoInmuebleSeleccionado === id
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <FiltroSidebar
              ofertas={ofertas}
              filters={filters}
              setFilters={setFilters}
              tipos={tiposUnicos}
              tipoInmueble={tipoInmuebleSeleccionado}
            />
          </div>

          <div className="lg:col-span-3">
            <ResultadosOfertas
              ofertas={ofertasFiltradas}
              onLimpiarFiltros={limpiarFiltrosCompleto}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CatalogPage
