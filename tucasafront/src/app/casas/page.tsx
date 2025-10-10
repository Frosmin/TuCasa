'use client'
import { useMemo, useState, type FC } from "react"
import { casasData } from "./data"
import { FiltroSidebar, type Filtros } from "./components/FiltroSidebar"
import { SearchBar } from "./components/SearchBar"
import { ResultadosCasas } from "./components/ResultadosCasas"
import { filtrarCasas, obtenerTiposUnicos, obtenerZonasUnicas } from "./utils/utils"

const CatalogPage: FC = () => {
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

    const zonas = obtenerZonasUnicas(casasData)
    const tipos = obtenerTiposUnicos(casasData)

    const casasFiltradas = useMemo<Casa[]>(() => {
        return filtrarCasas(casasData, filters, searchTerm)
    }, [filters, searchTerm])

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
    }

    return (
        <div className="min-h-screen bg-gray-50">
            
          

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