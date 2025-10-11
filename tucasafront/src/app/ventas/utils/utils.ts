interface Filtros {
    tipo: string
    zona: string
    precioMin: number
    precioMax: number
    superficieMin: number
    superficieMax: number
    dormitorios: string
}
export const formatearPrecio = (precio: number, locale: string = 'es-BO'): string => {
    return new Intl.NumberFormat(locale).format(precio)
}

export const obtenerZonasUnicas = (casas: Casa[]): string[] => {
    return [...new Set(casas.map(c => c.zona))]
}

export const obtenerTiposUnicos = (casas: Casa[]): string[] => {
    return [...new Set(casas.map(c => c.tipo))]
}

export const filtrarCasas = (
    casas: Casa[],
    filtros: Filtros,
    busqueda: string
): Casa[] => {
    return casas.filter(casa => {
        const matchTipo = !filtros.tipo || casa.tipo === filtros.tipo
        const matchZona = !filtros.zona || casa.zona === filtros.zona
        const matchPrecio = casa.precio >= filtros.precioMin && casa.precio <= filtros.precioMax
        const matchSuperficie = casa.superficie >= filtros.superficieMin && casa.superficie <= filtros.superficieMax
        const matchDormitorios = !filtros.dormitorios || casa.num_dormitorios >= Number(filtros.dormitorios)
        // const matchBusqueda = casa.title.toLowerCase().includes(busqueda.toLowerCase()) ||
        //     casa.descripcion.toLowerCase().includes(busqueda.toLowerCase())

        return matchTipo && matchZona && matchPrecio && matchSuperficie && matchDormitorios 
    })
}

export const obtenerEstadoColor = (estado: Casa['estado']): string => {
    const colores: Record<Casa['estado'], string> = {
        nuevo: 'bg-orange-100 text-orange-700',
        oferta: 'bg-blue-100 text-blue-700',
        oportunidad: 'bg-green-100 text-green-700'
    }
    return colores[estado]
}