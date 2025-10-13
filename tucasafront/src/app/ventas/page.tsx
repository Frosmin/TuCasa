'use client'
import { useEffect, useMemo, useState } from 'react'
import { Home, Building2, MapPin, Store } from 'lucide-react'
import type { Inmueble, TipoPropiedad } from '@/models/Inmueble'
import { fetchCasas } from '@/api/casas'
import { FiltroSidebar, type Filtros } from './components/FiltroSidebar'
import { SearchBar } from './components/SearchBar'
import { ResultadosInmuebles } from './components/ResultadosInmuebles'
import { filtrarInmueble, obtenerTiposUnicos } from './utils/utils'
import Loading from '@/components/Loading'

const CatalogPage = () => {
    const [inmuebles, setInmuebles] = useState<Inmueble[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoPropiedad>('')
    const [filters, setFilters] = useState<Filtros>({
        tipo: '',
        zona: '',
        precioMin: 0,
        precioMax: Infinity,
        superficieMin: 0,
        superficieMax: Infinity,
        dormitorios: '',
    })
    const [searchTerm, setSearchTerm] = useState<string>('')

    const tiposPropiedad = [
        { id: '', label: 'Todos', icon: Home },
        { id: 'CASA', label: 'Casas', icon: Home },
        { id: 'DEPARTAMENTO', label: 'Departamentos', icon: Building2 },
        { id: 'LOTE', label: 'Lotes', icon: MapPin },
        { id: 'TIENDA', label: 'Tiendas', icon: Store },
    ] as const

    useEffect(() => {
        const cargarInmuebles = async () => {
            try {
                setLoading(true)
                setError(null)
                const data = await fetchCasas()
                setInmuebles(data)
            } catch (err) {
                const mensaje = err instanceof Error ? err.message : 'Error desconocido'
                setError(mensaje)
                console.error('Error cargando inmuebles:', err)
            } finally {
                setLoading(false)
            }
        }

        cargarInmuebles()
    }, [])

    // Obtener tipos únicos solo cuando cambien los inmuebles
    const tipos = useMemo(() => obtenerTiposUnicos(inmuebles), [inmuebles])

    // Filtrar inmuebles
    const inmueblesFiltrados = useMemo<Inmueble[]>(() => {
        let resultado = filtrarInmueble(inmuebles, filters, searchTerm)

        if (tipoSeleccionado) {
            resultado = resultado.filter(inmueble => inmueble.tipo === tipoSeleccionado)
        }

        return resultado
    }, [inmuebles, filters, searchTerm, tipoSeleccionado])

    // Limpiar todos los filtros
    const limpiarFiltrosCompleto = () => {
        setFilters({
            tipo: '',
            zona: '',
            precioMin: 0,
            precioMax: Infinity,
            superficieMin: 0,
            superficieMax: Infinity,
            dormitorios: '',
        })
        setSearchTerm('')
        setTipoSeleccionado('')
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

    if (loading) {
        return <Loading message="Cargando inmuebles..." />

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
                                onClick={() => setTipoSeleccionado(id as TipoPropiedad)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 transition-all duration-300 font-medium whitespace-nowrap ${tipoSeleccionado === id
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
                            filters={filters}
                            setFilters={setFilters}
                            tipos={tipos}
                        />
                    </div>

                    {/* Resultados */}
                    <div className="lg:col-span-3">
                        <ResultadosInmuebles
                            inmuebles={inmueblesFiltrados}
                            onLimpiarFiltros={limpiarFiltrosCompleto}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CatalogPage