export function mapOfertaFormData(oferta: any) {

    type Multimedia = {
        url: string;
        esPortada: boolean;
    }
    
    console.log("oferta extraida",oferta)
    const inmueble = oferta.inmueble;
    const tipo = inmueble.tipo;




    const inmuebleData = oferta.inmueble;
    const fotos: Multimedia[] = (inmuebleData?.multimedias ?? [])
        //trasformar la lista compleja que tiene esportada, url a solo una lista de urls
        const images = fotos.map(f => f.url);
    console.log("fotos :D", images)


    

    const formData = {
        operacion: oferta.tipo,
        propertyType: tipo,
        direccion: inmueble.direccion,
        zona: inmueble.zona || '', 
        latitud: String(inmueble.latitud),
        longitud: String(inmueble.longitud),
        superficie: String(inmueble.superficie),
        precio: String(oferta.precio),
        moneda: oferta.moneda,
        tipoPago: oferta.tipoPago,
        duracion: oferta.duracion,
        descripcion: inmueble.descripcion,
        descripcionOferta: oferta.descripcion,
        idPropietario: inmueble.idPropietario,
        serviciosIds: inmueble.servicios?.map((s: any) => s.id) ?? [],



        images: images,

        dormitorios: '',
        banos: '',
        numPisos: '',
        garaje: false,
        patio: false,
        amoblado: false,
        sotano: false,

        // Campos Tienda
        numAmbientes: '',
        deposito: false,
        banoPrivado: false,

        // Campos específicos para Departamento
        piso: '',
        superficieInterna: '',
        ascensor: false,
        balcon: false,
        parqueo: false,
        mascotasPermitidas: false,
        baulera: false,
        //amoblado: false,
        montoExpensas: '',


        // Campos Lote
        muroPerimetral: false,


    };

    switch (tipo) {
        case 'CASA':
            return {
                ...formData,
                dormitorios: String(inmueble.numDormitorios),
                banos: String(inmueble.numBanos),
                numPisos: String(inmueble.numPisos),
                garaje: inmueble.garaje,
                patio: inmueble.patio,
                amoblado: inmueble.amoblado,
                sotano: inmueble.sotano,
            }
        case 'TIENDA':
            return {
                ...formData,
                numAmbientes: String(inmueble.numAmbientes),
                deposito: inmueble.deposito,
                banoPrivado: inmueble.banoPrivado,
            }
        case 'DEPARTAMENTO':
            return {
                ...formData,
                dormitorios: String(inmueble.numDormitorios),
                banos: String(inmueble.numBanos),
                piso: String(inmueble.piso),
                montoExpensas: String(inmueble.montoExpensas),
                mascotasPermitidas: inmueble.mascotasPermitidas,
                parqueo: inmueble.parqueo,
                amoblado: inmueble.amoblado,
                ascensor: inmueble.ascensor,
                balcon: inmueble.balcon,
                superficieInterna: String(inmueble.superficie) || '',
            }
        case 'LOTE':
            return {
                ...formData,
                muroPerimetral: inmueble.muroPerimetral
            }

        default: return formData;
    }

}