// src/app/publicar/types/property.types.ts

export type PropertyType = 'CASA' | 'DEPARTAMENTO' | 'LOTE' | 'TIENDA';
export type OperationType = 'VENTA' | 'ALQUILER' | 'ANTICRETICO';
export type Currency = 'Bs' | '$';
export type PaymentType = 'mensual' | 'anual' | 'unico';

export interface PropertyFormData {
  // Datos generales del inmueble
  operacion: OperationType | '';
  propertyType: PropertyType;
  direccion: string;
  latitud: string;
  zona: string;
  longitud: string;
  superficie: string;
  precio: string;
  moneda: Currency;
  tipoPago: PaymentType;
  duracion: string;
  descripcion: string;
  descripcionOferta: string;
  idPropietario: number;
  serviciosIds: number[];

  // Campos específicos para Casa
  dormitorios: string;
  banos: string;
  numPisos: string;
  garaje: boolean;
  patio: boolean;
  amoblado: boolean;
  sotano: boolean;

  // Campos específicos para Tienda
  numAmbientes: string;
  deposito: boolean;
  banoPrivado: boolean;

  // Campos específicos para Departamento
  piso: string;
  superficieInterna: string;
  montoExpensas: string;
  mascotasPermitidas: boolean;
  parqueo: boolean;
  ascensor: boolean;
  balcon: boolean;
  baulera: boolean;

  // Campos específicos para Lote
  muroPerimetral: boolean;

  images: string[];
}

export interface MultimediaItem {
  url: string;
  tipo: 'FOTO' | 'VIDEO';
  descripcion: string;
  activo: boolean;
  esPortada: boolean;
}


export type PropertyPayload = {
  inmueble: InmuebleData,
  descripcion: string;  
  tipoOperacion: OperationType;   
  precio: number;
  moneda: Currency;
  duracion: number | null;
  tipoPago: PaymentType;
};

export interface InmuebleData {
  direccion: string;
  latitud: number;
  longitud: number;
  superficie: number;
  idPropietario: number;
  descripcion: string;
  zona: string;
  tipo: PropertyType;
  serviciosIds: number[];

  // Campos Casa opcionales
  numDormitorios?: number;
  numBanos?: number;
  numPisos?: number;
  garaje?: boolean;
  patio?: boolean;
  amoblado?: boolean;
  sotano?: boolean;

  // Campos Tienda opcionales
  numAmbientes?: number;
  deposito?: boolean;
  banoPrivado?: boolean;
  // Departamento fields
  piso?: number;
  superficieInterna?: number;
  ascensor?: boolean;
  balcon?: boolean;
  parqueo?: boolean;
  mascotasPermitidas?: boolean;
  montoExpensas?: number;
  baulera?: boolean;

  // Campos Lote opcionales
  tamanio?: number;
  muroPerimetral?: boolean;

  // Multimedia
  multimedia?: MultimediaItem[];
}
