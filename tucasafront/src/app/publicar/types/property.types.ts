// publicar/types/property.types.ts

export type PropertyType = 'CASA' | 'DEPARTAMENTO' | 'LOTE' | 'TIENDA';
export type OperationType = 'VENTA' | 'ALQUILER' | 'ANTICRETICO';
export type Currency = 'Bs' | '$';
export type PaymentType = 'mensual' | 'anual' | 'unico';

export interface PropertyFormData {
  // Datos del inmueble
  operacion: OperationType | '';
  propertyType: PropertyType;
  direccion: string;
  latitud: string;
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
  ascensor: boolean;
  balcon: boolean;
  areaComun: boolean;
  seguridad: boolean;
  parqueo: boolean;
  mascotasPermitidas: boolean;
  expensas: string;
  vistaPanoramica: boolean;
  antiguedadEdificio: string;
  numDepartamentosPorPiso: string;
  porteroAutomatico: boolean;
  terrazaCompartida: boolean;

  images: string[];
}

export interface PropertyPayload {
  inmueble: InmuebleData;
  descripcion: string;
  tipo: OperationType;
  precio: number;
  moneda: Currency;
  duracion: number | null;
  tipoPago: PaymentType;
}

export interface InmuebleData {
  direccion: string;
  latitud: number;
  longitud: number;
  superficie: number;
  idPropietario: number;
  descripcion: string;
  tipo: PropertyType;
  serviciosIds: number[];
  // Casa fields
  numDormitorios?: number;
  numBanos?: number;
  numPisos?: number;
  garaje?: boolean;
  patio?: boolean;
  amoblado?: boolean;
  sotano?: boolean;
  // Tienda fields
  numAmbientes?: number;
  deposito?: boolean;
  banoPrivado?: boolean;
  // Departamento fields
  piso?: string;
  ascensor?: boolean;
  balcon?: boolean;
  areaComun?: boolean;
  seguridad?: boolean;
  parqueo?: boolean;
  mascotasPermitidas?: boolean;
  expensas?: string;
  vistaPanoramica?: boolean;
  antiguedadEdificio?: string;
  numDepartamentosPorPiso?: string;
  porteroAutomatico?: boolean;
  terrazaCompartida?: boolean;
}