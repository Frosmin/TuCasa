import type { FC } from "react"
import { RangeFilter } from "./RangeFilter"
import { SelectFilter } from "./SelectFilter"

export interface Filtros {
    tipo: string
    zona: string
    precioMin: number
    precioMax: number
    superficieMin: number
    superficieMax: number
    dormitorios: string
}
interface FiltroSidebarProps {
    filters: Filtros
    setFilters: (filtros: Filtros) => void
    tipos: string[]
}
export const FiltroSidebar: FC<FiltroSidebarProps> = ({
    filters,
    setFilters,
    tipos
}) => {
    const filtrosDefault: Filtros = {
        tipo: '',
        zona: '',
        precioMin: 0,
        precioMax: Infinity,
        superficieMin: 0,
        superficieMax: Infinity,
        dormitorios: ''
    }

    const limpiarFiltros = (): void => {
        setFilters(filtrosDefault)
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6 h-fit sticky top-6">
            <h2 className="text-lg font-bold text-gray-900">Filtros</h2>

            <SelectFilter
                label="Tipo de Propiedad"
                value={filters.tipo}
                onChange={(value) => setFilters({ ...filters, tipo: value })}
                options={tipos}
                placeholder="Todos los tipos"
            />

            <RangeFilter
                label="Rango de Precio"
                minValue={filters.precioMin}
                maxValue={filters.precioMax === Infinity ? 0 : filters.precioMax}
                onMinChange={(value) => setFilters({ ...filters, precioMin: value })}
                onMaxChange={(value) => setFilters({ ...filters, precioMax: value || Infinity })}
            />

            <RangeFilter
                label="Superficie (m²)"
                minValue={filters.superficieMin}
                maxValue={filters.superficieMax === Infinity ? 0 : filters.superficieMax}
                onMinChange={(value) => setFilters({ ...filters, superficieMin: value })}
                onMaxChange={(value) => setFilters({ ...filters, superficieMax: value || Infinity })}
            />

            <SelectFilter
                label="Dormitorios"
                value={filters.dormitorios}
                onChange={(value) => setFilters({ ...filters, dormitorios: value })}
                options={['1', '2', '3', '4', '5']}
                placeholder="Cualquier cantidad"
            />

            <button
                onClick={limpiarFiltros}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded-lg transition-colors"
            >
                Limpiar Filtros
            </button>
        </div>
    )
}