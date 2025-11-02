// publicar/services/property.service.ts

import { PropertyPayload } from '../types/property.types';
import { URL_BACKEND } from '@/config/constants';



export class PropertyService {
  static async createProperty(payload: PropertyPayload): Promise<any> {
    // Asegurar enums en mayúscula
    payload.tipoOperacion = payload.tipoOperacion.toUpperCase() as any;
    payload.inmueble.tipo = payload.inmueble.tipo.toUpperCase() as any;

    console.log('Payload a enviar:', JSON.stringify(payload, null, 2));

    const response = await fetch(`${URL_BACKEND}/api/oferta`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    let errorData: any = {};
    const contentType = response.headers.get('Content-Type');

    if (!response.ok) {
      if (contentType && contentType.includes('application/json')) {
        errorData = await response.json().catch(() => ({}));
      } else {
        const text = await response.text();
        errorData = { message: text };
      }
      console.error('Error del servidor:', errorData);
      console.error('Payload que causó el error:', payload);
      throw { status: response.status, data: errorData };
    }

    return await response.json();
  }
}
