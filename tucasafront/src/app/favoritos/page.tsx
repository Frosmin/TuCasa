'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { getMyFavorites } from '@/api/favorito.service'
import { Oferta } from '@/models/Oferta'
import { OfertaCard } from '@/components/OfertaCard'
import Loading from '@/components/Loading'

export default function FavoritosPage() {
  const { token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [favoritos, setFavoritos] = useState<Oferta[]>([])

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    let active = true
    ;(async () => {
      setLoading(true)
      try {
        const res = await getMyFavorites(token)
        const lista = Array.isArray(res?.data) ? (res.data as Oferta[]) : []
        if (active) setFavoritos(lista)
      } catch (err: any) {
        if (active) setError(err.message || 'No se pudieron obtener tus favoritos')
      } finally {
        if (active) setLoading(false)
      }
    })()

    return () => {
      active = false
    }
  }, [token])

  if (!token) {
    return (
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Mis favoritos</h1>
        <p className="text-gray-600 mb-4">Debes iniciar sesión para ver tu lista de favoritos.</p>
        <Link
          href="/login"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Ir a iniciar sesión
        </Link>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto p-6">
        <Loading />
      </main>
    )
  }

  if (error) {
    return (
      <main className="max-w-6xl mx-auto p-6 text-center text-red-500">
        {error}
      </main>
    )
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Mis favoritos</h1>

      {favoritos.length === 0 ? (
        <p className="text-gray-600">Todavía no tienes propiedades en favoritos.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {favoritos.map((oferta) => (
            <OfertaCard key={oferta.id} oferta={oferta} />
          ))}
        </div>
      )}
    </main>
  )
}