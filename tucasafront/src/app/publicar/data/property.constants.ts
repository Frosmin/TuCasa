// publicar/data/property.constants.ts

import { Home, Building2, Store } from 'lucide-react';
import { PropertyType } from '../types/property.types';

export const PROPERTY_TYPES = [
  { id: 'CASA' as PropertyType, label: 'Casa', icon: Home },
  { id: 'DEPARTAMENTO' as PropertyType, label: 'Departamento', icon: Building2 },
  { id: 'LOTE' as PropertyType, label: 'Lote', icon: Home },
  { id: 'TIENDA' as PropertyType, label: 'Tienda', icon: Store },
];

export const OPERATION_TYPES = [
  {
    id: 'VENTA',
    label: 'Venta',
    description: 'Vende tu propiedad',
    icon: Home,
    colorClass: 'blue',
  },
  {
    id: 'ALQUILER',
    label: 'Alquiler',
    description: 'Alquila tu propiedad',
    icon: Building2,
    colorClass: 'green',
  },
  {
    id: 'ANTICRETICO',
    label: 'Anticrético',
    description: 'Anticrético de propiedad',
    icon: Store,
    colorClass: 'purple',
  },
];

export const CURRENCY_OPTIONS = [
  { value: 'Bs', label: 'Bolivianos (Bs)' },
  { value: '$', label: 'Dólares ($)' },
];

export const PAYMENT_TYPE_OPTIONS = [
  { value: 'mensual', label: 'Mensual' },
  { value: 'anual', label: 'Anual' },
];

export const INITIAL_FORM_DATA = {
  operacion: '' as const,
  propertyType: 'CASA' as PropertyType,
  direccion: '',
  latitud: '',
  longitud: '',
  superficie: '',
  precio: '',
  moneda: 'Bs' as const,
  tipoPago: 'mensual' as const,
  duracion: '',
  descripcion: '',
  descripcionOferta: '',
  idPropietario: 1,
  serviciosIds: [],

  // Campos Casa
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

  // Campos Lote
  tamanio: '',
  muroPerimetral: false,

  images: [],
};
