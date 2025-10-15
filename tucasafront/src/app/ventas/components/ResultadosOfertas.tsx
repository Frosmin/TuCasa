import type { FC } from "react"
import { OfertaCard } from "../../../components/OfertaCard"
import type { Oferta } from "@/models/Oferta"

interface ResultadosOfertasProps {
    ofertas: Oferta[]
    onLimpiarFiltros: () => void
}

export const ResultadosOfertas: FC<ResultadosOfertasProps> = ({ ofertas, onLimpiarFiltros }) => {
    if (ofertas.length === 0) {
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
                    Se encontraron <span className="font-semibold text-gray-900">{ofertas.length}</span> propiedades
                </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ofertas.map((oferta) => (
                    <OfertaCard
                        key={oferta.id}
                        oferta={oferta}
                        onFavorite={(id) => console.log('Favorito:', id)}
                    />
                ))}
            </div>
        </>
    )
}