import type { FC } from "react"
import { OfertaCard } from "../../../components/OfertaCard"
import type { Oferta } from "@/models/Oferta"

interface ResultadosOfertasProps {
    ofertas: Oferta[]
    onLimpiarFiltros: () => void
}

export const ResultadosOfertas: FC<ResultadosOfertasProps> = ({
    ofertas,
    onLimpiarFiltros
}) => {
    if (ofertas.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500 text-lg mb-2">
                    No se encontraron propiedades que coincidan con tus filtros
                </p>
                <p className="text-sm text-gray-400 mb-6">
                    Intenta ajustar los criterios de búsqueda
                </p>
                <button
                    onClick={onLimpiarFiltros}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    Limpiar todos los filtros
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Contador simple de resultados */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-5 py-3">
                <p className="text-sm text-gray-600">
                    Se encontraron <span className="font-bold text-gray-900 text-lg">{ofertas.length}</span> propiedades que coinciden con tus filtros
                </p>
            </div>

            {/* Grid de ofertas */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ofertas.map((oferta) => (
                    <OfertaCard
                        key={oferta.id}
                        oferta={oferta}
                        onFavorite={(id) => console.log('Favorito:', id)}
                    />
                ))}
            </div>
        </div>
    )
}