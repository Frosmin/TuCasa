// publicar/utils/property.utils.ts

import { InmuebleData, PropertyFormData, PropertyPayload } from '../types/property.types';

const toNumber = (v: string) => {
  const n = Number(v);
  return Number.isNaN(n) ? 0 : n;
};

export const buildPropertyPayload = (formData: PropertyFormData): PropertyPayload => {
  const inmuebleData: InmuebleData = {
    tipo: formData.propertyType, // Tipo de inmueble (CASA/DEPARTAMENTO/TIENDA/LOTE)
    direccion: formData.direccion,
    latitud: toNumber(formData.latitud),
    longitud: toNumber(formData.longitud),
    superficie: toNumber(formData.superficie),
    idPropietario: formData.idPropietario,
    descripcion: formData.descripcion,
    serviciosIds: formData.serviciosIds ?? [],
  };

  // Campos específicos
  if (formData.propertyType === 'CASA') {
    inmuebleData.numDormitorios = toNumber(formData.dormitorios);
    inmuebleData.numBanos = toNumber(formData.banos);
    inmuebleData.numPisos = toNumber(formData.numPisos);
    inmuebleData.garaje = formData.garaje;
    inmuebleData.patio = formData.patio;
    inmuebleData.amoblado = formData.amoblado;
    inmuebleData.sotano = formData.sotano;
  }

  if (formData.propertyType === 'TIENDA') {
    inmuebleData.numAmbientes = toNumber(formData.numAmbientes);
    inmuebleData.deposito = formData.deposito;
    inmuebleData.banoPrivado = formData.banoPrivado;
  }

  if (formData.propertyType === 'DEPARTAMENTO') {
    inmuebleData.piso = toNumber((formData as any).piso);
    inmuebleData.superficieInterna = toNumber((formData as any).superficieInterna);
    inmuebleData.numDormitorios = toNumber(formData.dormitorios);
    inmuebleData.numBanos = toNumber(formData.banos);
    inmuebleData.montoExpensas = toNumber((formData as any).montoExpensas);
    inmuebleData.ascensor = (formData as any).ascensor;
    inmuebleData.balcon = (formData as any).balcon;
    inmuebleData.parqueo = (formData as any).parqueo;
    inmuebleData.mascotasPermitidas = (formData as any).mascotasPermitidas;
    inmuebleData.amoblado = formData.amoblado;
  }

  const payload: PropertyPayload = {
    inmueble: inmuebleData,
    descripcion: formData.descripcion,
    descripcionOferta: formData.descripcionOferta,
    tipoOperacion: formData.operacion || 'VENTA', // Tipo de operación (VENTA/ALQUILER/ANTICRETICO)
    precio: toNumber(formData.precio),
    moneda: formData.moneda,
    duracion: formData.operacion === 'ANTICRETICO' && formData.duracion ? toNumber(formData.duracion) : null,
    tipoPago: formData.operacion === 'VENTA' ? 'unico' : formData.tipoPago,
    images: (formData as any).images ?? [],
  };

  // Log para verificar antes de enviar
  console.log('Payload construido:', JSON.stringify(payload, null, 2));
  return payload;
};

export const handleApiError = (errorData: any): string => {
  if (errorData.errors && errorData.errors.length > 0) {
    return errorData.errors
      .map((err: any) => `${err.field}: ${err.defaultMessage}`)
      .join('\n');
  }
  
  if (errorData.message) {
    return errorData.message;
  }
  
  return 'Error desconocido';
};