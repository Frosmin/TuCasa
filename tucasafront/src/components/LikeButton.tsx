'use client'
import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/components/Toast'
import { addFavorite, removeFavorite } from '@/api/favorito.service'

interface LikeButtonProps {
  ofertaId: number
  initialIsFavorite?: boolean
  initialCount?: number | null
  onChange?: (isFav: boolean, count: number | null) => void
  className?: string
}

export default function LikeButton({
  ofertaId,
  initialIsFavorite = false,
  initialCount = null,
  onChange,
  className = 'p-3 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all hover:scale-105 relative'
}: LikeButtonProps) {
  const { token } = useAuth()
  const { showInfo, showError, showSuccess } = useToast()
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
  const [count, setCount] = useState<number | null>(initialCount)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setIsFavorite(initialIsFavorite)
    setCount(initialCount)
  }, [initialIsFavorite, initialCount])

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (loading) return


    if (!token) {
      showInfo('Debes iniciar sesión para guardar en favoritos');
      return;
    }

    setLoading(true)
    const prevFav = isFavorite
    const prevCount = count

    // UI siendo muy optimista
    setIsFavorite(!prevFav)
    if (count !== null) setCount(prevFav ? prevCount! - 1 : prevCount! + 1)

    try {
      if (prevFav) {
        await removeFavorite(ofertaId, token)
        showSuccess('Eliminado de favoritos');
      } else {
        await addFavorite(ofertaId, token)
        showSuccess('Guardado en favoritos');
      }
      onChange?.(!prevFav, count !== null ? (prevFav ? prevCount! - 1 : prevCount! + 1) : null)
    } catch (err: any) {
      // por si falla el like
      setIsFavorite(prevFav)
      setCount(prevCount)
      showError(err.message || 'No se pudo actualizar el favorito')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggle}
      aria-pressed={isFavorite}
      disabled={loading}
      className={className}
    >
      <Heart
        className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'} ${loading ? 'animate-pulse' : ''}`}
      />
      {count !== null && (
        <span className="absolute -bottom-1 -right-1 bg-red-500 text-white text-[10px] px-1 py-[2px] rounded-full leading-none">
          {count}
        </span>
      )}
    </button>
  )
}