// publicar/services/property.service.ts

import { PropertyPayload } from '../types/property.types';

const API_BASE_URL = 'http://localhost:8000/tucasabackend/api';


export class PropertyService {
  static async createProperty(payload: PropertyPayload): Promise<any> {
    console.log('Payload a enviar:', JSON.stringify(payload, null, 2));

    const response = await fetch(`${API_BASE_URL}/oferta`, {
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