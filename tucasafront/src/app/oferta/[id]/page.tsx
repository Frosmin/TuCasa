'use client'

import { use, useEffect, useState } from 'react'
import Image from 'next/image'
import { URL_BACKEND } from '@/config/constants'
import EditarFotosInmueble from '@/components/EditarFotosInmueble'

type Multimedia = {
    url: string;
    esPortada: boolean;
}
type Inmueble = {
    id: number;
    multimedias?: Multimedia[];
}
type OfertaDetalle = {
    id: number;
    inmueble: Inmueble;
}

export default function OfertaDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const [images, setImages] = useState<string[]>([])
  const [inmuebleId, setInmuebleId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${URL_BACKEND}/api/oferta/${id}`, { cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const json = (await res.json()) as { data?: OfertaDetalle }

        const inmuebleData = json.data?.inmueble;
        const fotos = (inmuebleData?.multimedias ?? [])
        .map(m => m.url)
        .filter(Boolean) as string[]

        if (active) {
          setImages(fotos)
          setError(null)
        }
      } catch {
        if (active) setError('No se pudieron cargar las fotos')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [id])

  if (loading) return <div className="min-h-screen grid place-items-center"><p>Cargando…</p></div>
  if (error) return <div className="min-h-screen grid place-items-center"><p className="text-red-600">{error}</p></div>

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Carrusel */}
          <div className="relative w-full h-64 md:h-96">
            <div className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {images.map((url, i) => (
                <div key={i} id={`img-${i + 1}`} className="relative min-w-full h-full snap-center">
                  <Image
                    src={url}
                    alt={`Foto ${i + 1}`}
                    fill
                    sizes="100vw"
                    style={{ objectFit: 'cover' }}
                    priority={i === 0}
                    unoptimized
                  />
                </div>
              ))}
            </div>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <a key={i} href={`#img-${i + 1}`} aria-label={`Ir a la imagen ${i + 1}`} className="h-2.5 w-2.5 rounded-full bg-white/70 hover:bg-white transition-colors" />
              ))}
            </div>
          </div>

          {/* Botón editar: al guardar, actualiza el estado y el carrusel en vivo */}
          <div className="p-4 border-t">
            <EditarFotosInmueble
              inmuebleId={id}
              initialUrls={images}
              onUpdated={(urls) => setImages(urls)}
              buttonText="Editar fotos"
            />
          </div>
        </div>
      </div>
    </div>
  )
}