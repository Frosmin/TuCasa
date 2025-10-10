interface Casa {
    id: string
    tipo: 'alquiler' | 'venta' | 'anticretico'
    zona: string
    direccion?: string;
    descripcion: string
    num_dormitorios: number
    num_banios: number
    superficie: number
    precio: number
    imagen: string
    estado: 'nuevo' | 'oferta' | 'oportunidad'
    garaje: boolean;
    patio: boolean;
    amoblado: boolean;
    tiene_sotano: boolean;
}