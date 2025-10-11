import type { FC } from "react"
import { CasaCard } from "./CardCasa"

interface ResultadosCasasProps {
    casas: Casa[]
    onLimpiarFiltros: () => void
}

export const ResultadosCasas: FC<ResultadosCasasProps> = ({ casas, onLimpiarFiltros }) => {
    if (casas.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-500 text-lg">
                    No se encontraron propiedades que coincidan con tus filtros
                </p>
                <button
                    onClick={onLimpiarFiltros}
                    className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                    Limpiar filtros
                </button>
            </div>
        )
    }

    return (
        <>
            <div className="mb-4">
                <p className="text-sm text-gray-600">
                    Se encontraron <span className="font-semibold text-gray-900">{casas.length}</span> propiedades
                </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {casas.map((casa) => (
                    <CasaCard
                        key={casa.id}
                        casa={casa}
                        onFavorite={(id) => console.log('Favorito:', id)}
                    />
                ))}
            </div>
        </>
    )
}