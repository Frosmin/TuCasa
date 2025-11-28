// src/api/favorito.service.ts
import { URL_BACKEND } from "@/config/constants";
import type { ApiResponse } from "./api";

const API_URL = `${URL_BACKEND}/api/oferta/favoritos`;

/**
 * Maneja la respuesta estándar de la API
 */
async function handleResponse(res: Response) {
  const data: ApiResponse<any> = await res.json().catch(() => ({}));
  if (!res.ok || data.error) {
    throw new Error(data.message || `Error ${res.status}`);
  }
  return data;
}

/**
 * Agrega una oferta a favoritos (POST /api/favoritos)
 */
export const addFavorite = async (ofertaId: number, token: string) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ ofertaId })
  });
  return handleResponse(res);
};

/**
 * Elimina una oferta de favoritos (DELETE /api/favoritos)
 */
export const removeFavorite = async (ofertaId: number, token: string) => {
  const res = await fetch(API_URL, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    // El backend espera el ID en el body para DELETE también
    body: JSON.stringify({ ofertaId })
  });
  return handleResponse(res);
};

/**
 * Obtiene todos los favoritos del usuario logueado (GET /api/favoritos)
 */
export const getMyFavorites = async (token: string) => {
  const res = await fetch(API_URL, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(res);
}