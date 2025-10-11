'use client'
import { useMemo, useState, type FC } from "react"
import { casasData } from "./data"
import { FiltroSidebar, type Filtros } from "./components/FiltroSidebar"
import { SearchBar } from "./components/SearchBar"
import { ResultadosCasas } from "./components/ResultadosCasas"
import { filtrarCasas, obtenerTiposUnicos, obtenerZonasUnicas } from "./utils/utils"
import { Home, Building2, MapPin, Store } from "lucide-react"

type TipoPropiedad = 'Casa' | 'Departamento' | 'Lote' | 'Tienda' | ''

const CatalogPage: FC = () => {
    const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoPropiedad>('')
    const [filters, setFilters] = useState<Filtros>({
        tipo: '',
        zona: '',
        precioMin: 0,
        precioMax: Infinity,
        superficieMin: 0,
        superficieMax: Infinity,
        dormitorios: ''
    })
    const [searchTerm, setSearchTerm] = useState<string>('')

    const tiposPropiedad = [
        { id: '', label: 'Todos', icon: Home },
        { id: 'Casa', label: 'Casas', icon: Home },
        { id: 'Departamento', label: 'Departamentos', icon: Building2 },
        { id: 'Lote', label: 'Lotes', icon: MapPin },
        { id: 'Tienda', label: 'Tiendas', icon: Store },
    ]

    const zonas = obtenerZonasUnicas(casasData)
    const tipos = obtenerTiposUnicos(casasData)

    const casasFiltradas = useMemo<Casa[]>(() => {
        let resultado = filtrarCasas(casasData, filters, searchTerm)
        
        // Filtro adicional por tipo de propiedad seleccionado
        if (tipoSeleccionado) {
            resultado = resultado.filter(casa => 
                casa.tipoPropiedad === tipoSeleccionado
            )
        }
        
        return resultado
    }, [filters, searchTerm, tipoSeleccionado])

    const limpiarFiltrosCompleto = (): void => {
        setFilters({
            tipo: '',
            zona: '',
            precioMin: 0,
            precioMax: Infinity,
            superficieMin: 0,
            superficieMax: Infinity,
            dormitorios: ''
        })
        setSearchTerm('')
        setTipoSeleccionado('')
    }

    const handleTipoChange = (tipo: TipoPropiedad): void => {
        setTipoSeleccionado(tipo)
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
                                onClick={() => handleTipoChange(id as TipoPropiedad)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 transition-all duration-300 font-medium whitespace-nowrap ${
                                    tipoSeleccionado === id
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
                            zonas={zonas}
                            tipos={tipos}
                        />
                    </div>

                    {/* Resultados */}
                    <div className="lg:col-span-3">
                        <ResultadosCasas
                            casas={casasFiltradas}
                            onLimpiarFiltros={limpiarFiltrosCompleto}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CatalogPage