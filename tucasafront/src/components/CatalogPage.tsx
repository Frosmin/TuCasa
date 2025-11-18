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

  // Validar y corregir coordenadas (detectar si están invertidas)
  const validarCoordenadas = (lat: number, lng: number) => {
    // Cochabamba debe estar aproximadamente entre -17 y -18 de latitud
    // y entre -66 y -67 de longitud
    if (Math.abs(lat) > 90 || Math.abs(lng) > 180) {
      return { lat: lng, lng: lat } // Invertir si están fuera de rango
    }
    
    // Si la latitud parece más como longitud y viceversa (para Bolivia)
    if (Math.abs(lat) > Math.abs(lng)) {
      return { lat: lng, lng: lat } // Invertir
    }
    
    return { lat, lng }
  }

  // Cargar ofertas del backend
  useEffect(() => {
    const cargarOfertas = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchOfertas(tipoOperacion)

        // Filtrar inmuebles con coordenadas válidas y corregidas
        const dataPublicadas = data.filter(o => o.estadoPublicacion === 'publicado');
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

        // Calcular el centro promedio de inmuebles válidos
        if (datosValidos.length > 0) {
          const latSum = datosValidos.reduce((sum, o) => sum + o.inmueble.latitud, 0)
          const lngSum = datosValidos.reduce((sum, o) => sum + o.inmueble.longitud, 0)
          const centerLat = latSum / datosValidos.length
          const centerLng = lngSum / datosValidos.length
          
          setFilters(prev => ({
            ...prev,
            latitud: COCHABAMBA_CENTER.lat,
            longitud: COCHABAMBA_CENTER.lng,
          }))
        } 
      } catch (err) {
        const mensaje =
          err instanceof Error ? err.message : 'Error desconocido'
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

  // Filtrar ofertas
  const ofertasFiltradas = useMemo(() => {
    return ofertasConDistancia
      .filter(({ oferta, distancia }) => {
        // Filtro por tipo de inmueble
        if (tipoInmuebleSeleccionado && oferta.inmueble.tipo !== tipoInmuebleSeleccionado) {
          return false
        }

        // Filtro por búsqueda
        if (searchTerm) {
          const termo = searchTerm.toLowerCase()
          const coincide =
            oferta.descripcion.toLowerCase().includes(termo) ||
            oferta.inmueble.descripcion.toLowerCase().includes(termo) ||
            oferta.inmueble.direccion.toLowerCase().includes(termo)
          if (!coincide) return false
        }

        // Filtro por proximidad - Validación mejorada
        if (filters.proximidad && filters.proximidad > 0) {
          if (distancia > filters.proximidad) {
            return false
          }
        }

        // Filtro por precio
        if (
          oferta.precio < filters.precioMin ||
          oferta.precio > filters.precioMax
        ) {
          return false
        }

        // Filtro por superficie
        if (
          oferta.inmueble.superficie < filters.superficieMin ||
          oferta.inmueble.superficie > filters.superficieMax
        ) {
          return false
        }

        // Filtro por dormitorios
        if (filters.dormitorios && oferta.inmueble.numDormitorios) {
          if (oferta.inmueble.numDormitorios !== parseInt(filters.dormitorios)) {
            return false
          }
        }

        // Filtro por garaje
        if (filters.garaje === true && !oferta.inmueble.garaje) {
          return false
        }

        // Filtro por amoblado
        if (filters.amoblado === true && !oferta.inmueble.amoblado) {
          return false
        }

        // Filtro por patio
        if (filters.patio === true && !oferta.inmueble.patio) {
          return false
        }

        // Filtro por sotano
        if (filters.sotano === true && !oferta.inmueble.sotano) {
          return false
        }

        // Filtro por moneda
        if (filters.moneda && oferta.moneda !== filters.moneda) {
          return false
        }

        // Filtro por servicios
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

  // Limpiar filtros
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

  // Mostrar error
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

  // Mostrar loading
  if (loading) {
    return <Loading message="Cargando ofertas..." />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Selector de Tipo de Propiedad */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {tiposPropiedad.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTipoInmuebleSeleccionado(id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 transition-all duration-300 font-medium whitespace-nowrap ${
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
    </div>
  )
}



export default CatalogPage