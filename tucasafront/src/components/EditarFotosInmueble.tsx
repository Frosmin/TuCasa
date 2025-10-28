'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { Upload, X } from 'lucide-react'
import { URL_BACKEND } from '@/config/constants'
import { UploadService } from '@/app/publicar/services/upload.service'

type Multimedia = { id: number; url: string; multimedia: string; descripcion?: string }
type InmuebleDetalle = { id: number; multimedias?: Multimedia[] }

type Props = {
  inmuebleId: string | number
  initialUrls?: string[] // opcional: si ya tienes las URLs en el padre
  onUpdated?: (urls: string[]) => void // callback al guardar
  buttonText?: string
  className?: string // estilos para el botón
}

export default function EditarFotosInmueble({
  inmuebleId,
  initialUrls,
  onUpdated,
  buttonText = 'Editar fotos',
  className = 'px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm',
}: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Estado de imágenes
  const [existing, setExisting] = useState<string[]>([]) // fotos del backend
  const [kept, setKept] = useState<string[]>([])         // fotos que el usuario mantiene
  const [newFiles, setNewFiles] = useState<File[]>([])   // nuevas a subir
  const [newPreviews, setNewPreviews] = useState<string[]>([]) // blobs locales

  // Cargar fotos cuando abre el modal (si no vienen del padre)
  useEffect(() => {
    if (!open) return
    const init = async () => {
      setError(null)
      if (initialUrls && initialUrls.length > 0) {
        setExisting(initialUrls)
        setKept(initialUrls)
        return
      }
      try {
        setLoading(true)
        const res = await fetch(`${URL_BACKEND}/api/inmueble/${inmuebleId}`, { cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = (await res.json()) as { data?: InmuebleDetalle }
        const inmueble = data?.data
        if (!inmueble) throw new Error('Sin datos')

        const fotos = (inmueble.multimedias ?? [])
          .filter(m => (m.multimedia ?? '').toUpperCase() === 'FOTO')
          .map(m => m.url)
          .filter(Boolean)

        setExisting(fotos)
        setKept(fotos)
      } catch (e: any) {
        console.error(e)
        setError('No se pudieron cargar las fotos')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [open, initialUrls, inmuebleId])

  // Lista combinada para la grilla
  const combined = useMemo(() => {
    return [
      ...kept.map((u) => ({ kind: 'existing' as const, url: u })),
      ...newPreviews.map((u, idx) => ({ kind: 'new' as const, url: u, idx })),
    ]
  }, [kept, newPreviews])

  // Abrir/cerrar
  const openEditor = () => setOpen(true)
  const closeEditor = () => {
    // limpiar blobs locales
    newPreviews.forEach((u) => u.startsWith('blob:') && URL.revokeObjectURL(u))
    setNewPreviews([])
    setNewFiles([])
    setKept(existing)
    setOpen(false)
    setSubmitting(false)
    setError(null)
  }

  // Handlers
  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    const list = Array.from(files)
    const previews = list.map((f) => URL.createObjectURL(f))
    setNewFiles((prev) => [...prev, ...list])
    setNewPreviews((prev) => [...prev, ...previews])
    e.target.value = ''
  }

  const removeItemAt = (index: number) => {
    if (index < kept.length) {
      setKept((prev) => prev.filter((_, i) => i !== index))
    } else {
      const localIdx = index - kept.length
      setNewPreviews((prev) => {
        const url = prev[localIdx]
        if (url?.startsWith('blob:')) URL.revokeObjectURL(url)
        return prev.filter((_, i) => i !== localIdx)
      })
      setNewFiles((prev) => prev.filter((_, i) => i !== localIdx))
    }
  }

  const onSubmit = async () => {
    try {
      setSubmitting(true)
      setError(null)

      // 1) Subir nuevas a Cloudinary
      let uploadedUrls: string[] = []
      if (newFiles.length > 0) {
        const assets = await UploadService.uploadImages(newFiles)
        uploadedUrls = assets.map((a) => a.url)
      }

      // 2) Lista final
      const finalUrls = [...kept, ...uploadedUrls]

      // 3) Payload (primera = portada)
      const payload = finalUrls.map((url, i) => ({
        url,
        tipo: 'FOTO',
        descripcion: `Imagen ${i + 1}`,
        esPortada: i === 0,
      }))

      // 4) PUT al backend
      const res = await fetch(`${URL_BACKEND}/api/inmueble/${inmuebleId}/multimedia`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`PUT multimedia HTTP ${res.status}`)

      // 5) Actualizar y notificar
      setExisting(finalUrls)
      setKept(finalUrls)
      newPreviews.forEach((u) => u.startsWith('blob:') && URL.revokeObjectURL(u))
      setNewPreviews([])
      setNewFiles([])
      setOpen(false)
      onUpdated?.(finalUrls)
    } catch (e: any) {
      console.error(e)
      setError('Error al actualizar imágenes')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <button onClick={openEditor} className={className}>
        {buttonText}
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={closeEditor} />

          {/* Modal */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h2 className="text-sm font-semibold">Editar fotos</h2>
                <button onClick={closeEditor} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {loading ? (
                  <p className="text-sm text-gray-600">Cargando fotos…</p>
                ) : (
                  <>
                    {/* Upload Area (misma idea que ImageUploader) */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        id="file-upload"
                        multiple
                        accept="image/*"
                        onChange={onUpload}
                        className="hidden"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-lg font-semibold text-gray-700 mb-1">Cargar fotos</p>
                        <p className="text-sm text-gray-500">Arrastra y suelta o haz clic para seleccionar</p>
                        <p className="text-xs text-gray-400 mt-2">(Se suben al guardar)</p>
                      </label>
                    </div>

                    {/* Imágenes Cargadas */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {combined.map((item, idx) => (
                        <div
                          key={`${item.kind}-${idx}-${item.url}`}
                          className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 group"
                        >
                          <Image src={item.url} alt={`Preview ${idx + 1}`} fill className="object-cover" unoptimized />
                          <button
                            type="button"
                            onClick={() => removeItemAt(idx)}
                            className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            title="Eliminar imagen"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-1 left-1 bg-black/60 text-white px-2 py-0.5 rounded text-xs font-medium">
                            {idx + 1 === 1 ? 'Portada' : idx + 1}
                          </div>
                        </div>
                      ))}
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    {/* Acciones */}
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={onSubmit}
                        disabled={submitting || (kept.length + newFiles.length) === 0}
                        className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white text-sm disabled:opacity-60"
                      >
                        {submitting ? 'Guardando…' : 'Guardar'}
                      </button>
                      <button
                        onClick={closeEditor}
                        disabled={submitting}
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm"
                      >
                        Cancelar
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}