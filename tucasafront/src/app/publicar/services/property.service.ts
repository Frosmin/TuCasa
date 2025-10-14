// publicar/services/property.service.ts

import { PropertyPayload } from '../types/property.types';

const API_BASE_URL = 'http://localhost:8000/tucasabackend/api';

const getEndpoint = (tipo: string) => {
  switch (tipo) {
    case 'CASA':
      return '/casa';
    case 'DEPARTAMENTO':
      return '/departamento';
    case 'TIENDA':
      return '/tienda';
    default:
      return '/oferta';
  }
};

export class PropertyService {
  static async createProperty(payload: PropertyPayload): Promise<any> {
    const endpoint = getEndpoint(payload.tipo);
    console.log('Payload a enviar:', JSON.stringify(payload, null, 2));

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error del servidor:', errorData);
      console.error('Payload que causó el error:', payload);
      throw { status: response.status, data: errorData };
    }

    return await response.json();
  }
}