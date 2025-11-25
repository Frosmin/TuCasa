'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Maximize, Bed, Bath, Car, MapPin } from 'lucide-react'
import { URL_BACKEND } from '@/config/constants'
import type { Oferta } from '@/models/Oferta'

export default function TodasOfertasPage() {
  const [ofertas, setOfertas] = useState<Oferta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOfertas = async () => {
      try {
        setLoading(true)
        setError(null)

       const res = await fetch('http://localhost:8000/tucasabackend/api/oferta/all')// Asegúrate que la ruta sea correcta
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)

        const data = await res.json()
        if (!data.data) throw new Error('Estructura de datos inesperada')

        setOfertas(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    fetchOfertas()
  }, [])

  if (loading) return <p className="text-center mt-8">Cargando ofertas...</p>
  if (error) return <p className="text-center mt-8 text-red-600">Error: {error}</p>
  if (ofertas.length === 0) return <p className="text-center mt-8">No hay ofertas disponibles</p>

  const formatearPrecio = (precio: number) =>
    precio.toLocaleString('es-BO', { minimumFractionDigits: 0 })

  const getOfertaLabel = (tipo: Oferta['tipo']): string => {
    const labels: Record<Oferta['tipo'], string> = {
      ALQUILER: 'Alquiler',
      VENTA: 'Venta',
      ANTICRETICO: 'Anticrético',
    }
    return labels[tipo]
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Todas las ofertas</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ofertas.map(oferta => {
          const inmueble = oferta.inmueble
          if (!inmueble) return null

          return (
            <Link
              key={oferta.id}
              href={`/oferta/${oferta.id}`}
              className="block rounded-lg shadow-md hover:shadow-xl transition overflow-hidden"
            >
              <div className="relative w-full h-48 bg-gray-100">
                {inmueble.url_imagen ? (
                  <img
                    src={inmueble.url_imagen}
                    alt={oferta.descripcion}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-400">
                    Sin imagen
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="font-semibold text-lg mb-1">
                  {getOfertaLabel(oferta.tipo)} - {inmueble.tipo}
                </h2>
                <p className="text-blue-600 font-bold text-xl">
                  {oferta.moneda} {formatearPrecio(oferta.precio)}
                </p>
                
                {inmueble.direccion && (
                  <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    {inmueble.direccion}
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
