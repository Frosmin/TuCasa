import type { Inmueble } from "../../../models/Inmueble"

interface Filtros {
    tipo: string
    zona: string
    precioMin: number
    precioMax: number
    superficieMin: number
    superficieMax: number
    dormitorios: string
}
export const formatearPrecio = (precio: number = 0, locale: string = 'es-BO'): string => {
    return new Intl.NumberFormat(locale).format(precio)
}


export const obtenerTiposUnicos = (casas: Inmueble[]): string[] => {
    return [...new Set(casas.map(c => c.tipo))]
}

export const filtrarInmueble = (
    inmuebles: Inmueble[],
    filtros: Filtros,
    busqueda: string
): Inmueble[] => {
    return inmuebles.filter(inmueble => {
        const matchTipo = !filtros.tipo || inmueble.tipo === filtros.tipo
        const matchPrecio = (inmueble.precio || 0) >= filtros.precioMin && (inmueble.precio || 0) <= filtros.precioMax
        const matchSuperficie = inmueble.superficie >= filtros.superficieMin && inmueble.superficie <= filtros.superficieMax
        const matchDormitorios = !filtros.dormitorios || inmueble.numDormitorios >= Number(filtros.dormitorios)
        // const matchBusqueda = casa.title.toLowerCase().includes(busqueda.toLowerCase()) ||
        //     casa.descripcion.toLowerCase().includes(busqueda.toLowerCase())

        return matchTipo && matchPrecio && matchSuperficie && matchDormitorios
    })
}