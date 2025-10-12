import type { FC } from "react"
import { CasaCard } from "./CardCasa"
import type { Inmueble } from "../../../models/Inmueble"

interface ResultadosInmueblesProps {
    inmuebles: Inmueble[]
    onLimpiarFiltros: () => void
}

export const ResultadosInmuebles: FC<ResultadosInmueblesProps> = ({ inmuebles, onLimpiarFiltros }) => {
    if (inmuebles.length === 0) {
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
                    Se encontraron <span className="font-semibold text-gray-900">{inmuebles.length}</span> propiedades
                </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inmuebles.map((casa) => (
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