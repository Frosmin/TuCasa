// publicar/services/property.service.ts

import { PropertyPayload } from '../types/property.types';

const API_BASE_URL = 'http://localhost:8000/tucasabackend/api';

export class PropertyService {
  static async createProperty(payload: PropertyPayload): Promise<any> {
    // Normalizar enums en mayúsculas con defensas
    if (payload?.tipoOperacion) {
      payload.tipoOperacion = payload.tipoOperacion.toUpperCase() as PropertyPayload['tipoOperacion'];
    }
    if (payload?.inmueble?.tipo) {
      payload.inmueble.tipo = payload.inmueble.tipo.toUpperCase() as typeof payload.inmueble.tipo;
    }

    console.log('POST /api/oferta ->', JSON.stringify(payload, null, 2));

    const res = await fetch(`${API_BASE_URL}/oferta`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      let data: any = {};
      try {
        const ct = res.headers.get('Content-Type') || '';
        data = ct.includes('application/json') ? await res.json() : { message: await res.text() };
      } catch {
        data = { message: 'Error desconocido' };
      }
      console.error('Error del servidor:', data);
      throw { status: res.status, data };
    }

    return res.json();
  }
}
