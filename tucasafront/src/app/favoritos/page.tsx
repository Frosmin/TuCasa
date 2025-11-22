'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { HeartOff, Home, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { getMyFavorites } from '@/api/favorito.service'
import { Oferta } from '@/models/Oferta'
import { OfertaCard } from '@/components/OfertaCard'

export default function FavoritosPage() {
  const { token, user } = useAuth()
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
        
        if (res?.data && Array.isArray(res.data)) {
            const listaOfertas = res.data as Oferta[];
            if (active) setFavoritos(listaOfertas);
        } else {
            if (active) setFavoritos([]);
        }

      } catch (err: any) {
        if (active) setError(err.message || 'No se pudieron obtener tus favoritos')
      } finally {
        if (active) setLoading(false)
      }
    })()

    return () => { active = false }
  }, [token])


  // --- Renderizado Condicional ---

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <div className="bg-blue-50 p-6 rounded-full mb-4">
           <HeartOff className="w-12 h-12 text-blue-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Inicia sesión para ver tus favoritos</h2>
        <p className="text-gray-500 mb-6 max-w-md">
          Guarda las casas que te encantan para no perderlas de vista.
        </p>
        <Link
          href="/login"
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 hover:scale-105 transition-all"
        >
          Iniciar Sesión
        </Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Encabezado con gradiente y contador */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
          Mis Favoritos
        </h1>
        <p className="text-gray-500 text-lg">
            Hola {user?.nombre}, tienes <span className="font-bold text-blue-600">{favoritos.length}</span> propiedades guardadas.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
        </div>
      )}

      {/* Estado Vacío Animado */}
      {favoritos.length === 0 && !error ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100"
        >
           <div className="bg-gray-50 p-6 rounded-full mb-6">
              <Home className="w-16 h-16 text-gray-400" />
           </div>
           <h3 className="text-xl font-semibold text-gray-800 mb-2">Tu lista está vacía</h3>
           <p className="text-gray-500 mb-8 text-center max-w-sm">
             Aún no has guardado ninguna propiedad. ¡Explora y encuentra la casa de tus sueños!
           </p>
           <Link 
             href="/ventas" 
             className="px-8 py-3 bg-gray-900 text-white rounded-xl font-medium shadow-md hover:bg-gray-800 transition-all hover:shadow-lg"
           >
             Explorar Inmuebles
           </Link>
        </motion.div>
      ) : (
        /* Grid con Animaciones */
        <motion.div 
          layout 
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence mode='popLayout'>
            {favoritos.map((oferta) => (
              <motion.div
                layout
                key={oferta.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ duration: 0.3 }}
              >
                <OfertaCard 
                    oferta={oferta}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </main>
  )
}