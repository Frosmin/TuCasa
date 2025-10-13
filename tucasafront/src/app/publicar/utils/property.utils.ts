// publicar/utils/property.utils.ts

import { PropertyFormData, PropertyPayload, InmuebleData } from '../types/property.types';

export const buildPropertyPayload = (formData: PropertyFormData): PropertyPayload => {
  const inmuebleData: InmuebleData = {
    direccion: formData.direccion,
    latitud: parseFloat(formData.latitud),
    longitud: parseFloat(formData.longitud),
    superficie: parseFloat(formData.superficie),
    idPropietario: formData.idPropietario,
    descripcion: formData.descripcion,
    tipo: formData.propertyType,
    serviciosIds: formData.serviciosIds,
  };

  // Agregar campos específicos de CASA
  if (formData.propertyType === 'CASA') {
    inmuebleData.numDormitorios = parseInt(formData.dormitorios) || 0;
    inmuebleData.numBanos = parseInt(formData.banos) || 0;
    inmuebleData.numPisos = parseInt(formData.numPisos) || 0;
    inmuebleData.garaje = formData.garaje;
    inmuebleData.patio = formData.patio;
    inmuebleData.amoblado = formData.amoblado;
    inmuebleData.sotano = formData.sotano;
  }

  // Agregar campos específicos de TIENDA
  if (formData.propertyType === 'TIENDA') {
    inmuebleData.numAmbientes = parseInt(formData.numAmbientes) || 0;
    inmuebleData.deposito = formData.deposito;
    inmuebleData.banoPrivado = formData.banoPrivado;
  }
  
  // Agregar campos específicos de DEPARTAMENTO
  if (formData.propertyType === 'DEPARTAMENTO') {
    inmuebleData.piso = formData.piso;
    inmuebleData.superficieInterna = formData.superficieInterna;
    inmuebleData.numDormitorios = parseInt(formData.dormitorios) || 0;
    inmuebleData.numBanos = parseInt(formData.banos) || 0;
    inmuebleData.montoExpensas = formData.montoExpensas;
    inmuebleData.ascensor = formData.ascensor;
    inmuebleData.balcon = formData.balcon;
    inmuebleData.parqueo = formData.parqueo;
    inmuebleData.mascotasPermitidas = formData.mascotasPermitidas;
    inmuebleData.amoblado = formData.amoblado;
  }

  return {
    inmueble: inmuebleData,
    descripcion: formData.descripcionOferta,
    tipo: formData.operacion as any,
    precio: parseFloat(formData.precio),
    moneda: formData.moneda,
    duracion: formData.operacion === 'ANTICRETICO' && formData.duracion 
      ? parseInt(formData.duracion) 
      : null,
    tipoPago: formData.operacion === 'VENTA' ? 'unico' : formData.tipoPago,
  };
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