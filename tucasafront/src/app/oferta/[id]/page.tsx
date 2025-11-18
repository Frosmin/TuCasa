'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Bed, Bath, Maximize, Car, MapPin, ArrowLeft, Heart, X, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react'
import Link from 'next/link'
import type { Oferta } from '@/models/Oferta'
import { URL_BACKEND } from '@/config/constants'
import type { EstadoPublicacion } from "@/models/Oferta";
import ImageCarousel from '@/components/ImageCarousel';
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/components/Toast'

export default function DetalleOfertaPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { showError, showSuccess } = useToast();
  const [oferta, setOferta] = useState<Oferta | null>(null)
  const [imageError, setImageError] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rawData, setRawData] = useState<any>(null)
  const [images, setImages] = useState<string[]>([])

  // Estados para el modal de imagen
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [carouselCurrentIndex, setCarouselCurrentIndex] = useState(0)

  type Multimedia = {
    url: string;
    esPortada: boolean;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log('🔍 Buscando oferta con ID:', id)

        const res = await fetch(`${URL_BACKEND}/api/oferta/${id}`)

        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`)
        }

        const data = await res.json()

        const inmuebleData = data.data?.inmueble;
        const fotos: Multimedia[] = (inmuebleData?.multimedias ?? [])
        const images = fotos.map(f => f.url);
        setImages(images);

        console.log('📦 Datos crudos recibidos:', data)
        setRawData(data)

        let ofertaData: Oferta | null = null

        if (data.data && data.data.inmueble) {
          ofertaData = data.data
        } else if (data.inmueble) {
          ofertaData = data
        } else if (data.result && data.result.inmueble) {
          ofertaData = data.result
        }

        if (!ofertaData) {
          console.error('❌ No se pudo extraer la oferta de la respuesta:', data)
          throw new Error('Estructura de datos inesperada')
        }

        console.log('✅ Oferta extraída:', ofertaData)
        setOferta(ofertaData)

      } catch (err) {
        console.error('❌ Error cargando la oferta:', err)
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id])

  // Funciones para el modal
  const openModal = (index: number = 0) => {
    setCurrentImageIndex(index)
    setIsModalOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setIsModalOpen(false)
    document.body.style.overflow = 'auto'
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  // Manejar clic en el carrusel
  const handleCarouselClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const isButton = target.closest('button') ||
      target.closest('[role="button"]') ||
      target.tagName === 'BUTTON' ||
      target.closest('.carousel-button') ||
      target.closest('.slick-arrow');

    if (!isButton) {
      openModal(carouselCurrentIndex);
    }
  }

  const handleCarouselIndexChange = (newIndex: number) => {
    setCarouselCurrentIndex(newIndex);
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return

      switch (e.key) {
        case 'Escape':
          closeModal()
          break
        case 'ArrowRight':
          nextImage()
          break
        case 'ArrowLeft':
          prevImage()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isModalOpen])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando detalles...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <p className="text-red-600 mb-4">Error: {error}</p>
          {rawData && (
            <div className="mt-4 p-4 bg-gray-100 rounded text-left">
              <p className="text-sm font-semibold">Datos recibidos (debug):</p>
              <pre className="text-xs mt-2 whitespace-pre-wrap">
                {JSON.stringify(rawData, null, 2)}
              </pre>
            </div>
          )}
          <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  if (!oferta) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Oferta no encontrada</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  const inmueble = oferta.inmueble

  if (!inmueble) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <p className="text-red-600 mb-4">Error: Datos de inmueble incompletos</p>
          <div className="mt-4 p-4 bg-gray-100 rounded text-left">
            <p className="text-sm font-semibold">Datos de oferta (sin inmueble):</p>
            <pre className="text-xs mt-2 whitespace-pre-wrap">
              {JSON.stringify(oferta, null, 2)}
            </pre>
          </div>
          <Link href="/ventas" className="text-blue-600 hover:underline mt-4 inline-block">
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

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

  const getInmuebleLabel = (tipo: string): string => {
    const labels: Record<string, string> = {
      CASA: 'Casa',
      DEPARTAMENTO: 'Departamento',
      LOTE: 'Lote',
      TIENDA: 'Tienda',
    }
    return labels[tipo] || 'Propiedad'
  }

  const getTipoPagoLabel = (tipoPago: string): string => {
    const labels: Record<string, string> = {
      unico: 'Pago único',
      mensual: 'Mensual',
      anual: 'Anual'
    }
    return labels[tipoPago] || tipoPago
  }

  const manejarEstado = async (nuevoEstado: EstadoPublicacion) => {
    try {
      const res = await fetch(`${URL_BACKEND}/api/oferta/${id}/estado?estadoPublicacion=${nuevoEstado}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (!res.ok) {
        // Mostrar error real del backend
        throw new Error(data?.message || `Error ${res.status}`);
      }

      showSuccess(`la oferta ha sido ${nuevoEstado}`)
      setOferta(prev => prev ? { ...prev, estadoPublicacion: nuevoEstado } : prev);

    } catch (err) {
      showError("No se puede completar la operación");
      console.error(err);
    }
  }



  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/ventas" className="flex items-center gap-2 text-blue-600 hover:underline bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <ArrowLeft className="h-4 w-4" />
          <span className="font-medium">Volver al catálogo</span>
        </Link>
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="p-3 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all hover:scale-105"
        >
          <Heart
            className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
          />
        </button>
      </div>

      {/* Carrusel clickeable */}
      <div
        className="cursor-zoom-in mb-8 transition-transform hover:opacity-95 relative rounded-2xl overflow-hidden shadow-lg"
        onClick={handleCarouselClick}
      >
        <ImageCarousel
          images={images}
          onIndexChange={handleCarouselIndexChange}
        />
      </div>

      {/* Modal de imagen ampliada */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4">
          {/* Botón cerrar */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-70 transition-all"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Botón anterior */}
          {images.length > 1 && (
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full p-4 hover:bg-opacity-70 transition-all"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Imagen */}
          <div className="relative max-w-7xl max-h-full flex items-center justify-center">
            <img
              src={images[currentImageIndex]}
              alt={`Imagen ${currentImageIndex + 1} de la propiedad`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>

          {/* Botón siguiente */}
          {images.length > 1 && (
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full p-4 hover:bg-opacity-70 transition-all"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          {/* Contador */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-70 rounded-full px-4 py-2 text-sm font-medium">
            {currentImageIndex + 1} / {images.length}
          </div>

          {/* Miniaturas */}
          {images.length > 1 && (
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-[90vw] px-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 border-2 rounded-lg transition-all ${index === currentImageIndex ? 'border-blue-500 scale-110' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                >
                  <img
                    src={image}
                    alt={`Miniatura ${index + 1}`}
                    className="w-full h-full object-cover rounded"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Encabezado principal */}
      <div className="mb-8">
        {/* Badge de tipo de propiedad y oferta */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
            {getInmuebleLabel(inmueble?.tipo || '')}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
            {getOfertaLabel(oferta.tipo)}
          </span>
          {oferta.estadoPublicacion && (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-sm font-medium">
              {oferta.estadoPublicacion}
            </span>
          )}
        </div>

        {/* Título principal */}
        <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
          {getInmuebleLabel(inmueble?.tipo || '')} en {getOfertaLabel(oferta.tipo)} - {inmueble?.direccion}
        </h1>

        {/* Precio destacado */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-4 border border-blue-100">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">Precio de {getOfertaLabel(oferta.tipo).toLowerCase()}</p>
              <p className="text-4xl font-extrabold text-blue-700">
                {oferta.moneda} {formatearPrecio(oferta.precio)}
                {oferta.tipo !== 'VENTA' && (
                  <span className="text-lg font-normal text-gray-600"> / {getTipoPagoLabel(oferta.tipoPago)}</span>
                )}
              </p>
              {oferta.tipo === 'ALQUILER' && oferta.duracion && (
                <p className="text-sm text-gray-500 mt-2">
                  📅 Duración: {oferta.duracion} días
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">
                🗓️ Publicado el {new Date(oferta.fechaPublicacionInicio).toLocaleDateString('es-BO', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Dirección con icono destacado */}
        <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <MapPin className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Ubicación</p>
            <p className="text-lg font-semibold text-gray-900">{inmueble?.direccion || 'Dirección no especificada'}</p>
          </div>
        </div>
      </div>

      {/* Características principales en cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {inmueble?.superficie && (
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center hover:shadow-md transition-shadow">
            <Maximize className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{inmueble.superficie}</p>
            <p className="text-sm text-gray-600">m² totales</p>
          </div>
        )}
        {inmueble?.numDormitorios && (
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center hover:shadow-md transition-shadow">
            <Bed className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{inmueble.numDormitorios}</p>
            <p className="text-sm text-gray-600">Dormitorios</p>
          </div>
        )}
        {inmueble?.numBanos && (
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center hover:shadow-md transition-shadow">
            <Bath className="h-6 w-6 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{inmueble.numBanos}</p>
            <p className="text-sm text-gray-600">Baños</p>
          </div>
        )}
        {inmueble?.garaje && (
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center hover:shadow-md transition-shadow">
            <Car className="h-6 w-6 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">Sí</p>
            <p className="text-sm text-gray-600">Garaje</p>
          </div>
        )}
        {inmueble?.numAmbientes && (
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center hover:shadow-md transition-shadow">
            <LayoutGrid className="h-6 w-6 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{inmueble?.numAmbientes}</p>
            <p className="text-sm text-gray-600">Número de ambientes</p>
          </div>
        )}

      </div>

      {/* Descripciones */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-8 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <div className="flex-1 py-4 px-6 text-center font-medium text-sm border-b-2 border-blue-500 text-blue-600 bg-blue-50">
              📋 Descripción General
            </div>
          </nav>
        </div>

        <div className="p-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Sobre esta propiedad</h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              {inmueble?.descripcion || oferta.descripcion || 'No hay descripción disponible'}
            </p>
          </div>
        </div>
      </div>

      {/* Servicios y características */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Servicios incluidos */}
        {inmueble?.servicios && inmueble.servicios.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              🛠️ Servicios incluidos
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {inmueble.servicios.map(servicio => (
                <div key={servicio.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 font-medium">{servicio.nombre}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Características adicionales */}
        {inmueble && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              ⚡ Características
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Amoblado', value: inmueble.amoblado, icon: '🪑' },
                { label: 'Ascensor', value: inmueble.ascensor, icon: '🛗' },
                { label: 'Baulera', value: inmueble.baulera, icon: '📦' },
                { label: 'Mascotas', value: inmueble.mascotasPermitidas, icon: '🐕' },
                { label: 'Balcón', value: inmueble.balcon, icon: '🌳' },
                { label: 'Parqueo', value: inmueble.parqueo, icon: '🚗' },
                { label: 'Muro perimetral', value: inmueble.muroPerimetral, icon: '🧱' },
                { label: 'Baño privado', value: inmueble.banoPrivado, icon: '🚿' },
                { label: 'Deposito', value: inmueble.deposito, icon: '🏚️' },

              ]
                .filter(({ value }) => value !== undefined && value !== null)
                .map(({ label, value, icon }) => (
                  <div key={label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{icon}</span>
                      <span className="text-gray-700 font-medium">{label}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {value ? 'Sí' : 'No'}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Botón de acción destacado */}
      {user && user.rol === "ADMIN" && (


        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center mb-8">
          <h3 className="text-2xl font-bold text-white mb-2">¿Editar Estado</h3>
          <p className="text-blue-100 mb-6">Contacta al propietario para más información</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center"></div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {(
              <>
                <button
                  type="button"
                  onClick={() => manejarEstado('publicado')}
                  className="bg-green-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-600 transition-colors shadow-lg hover:shadow-xl"
                >
                  Publicar
                </button>
                <button
                  type="button"
                  onClick={() => manejarEstado('cancelado')}
                  className="bg-red-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-600 transition-colors shadow-lg hover:shadow-xl"
                >
                  Rechazar
                </button>
              </>
            )}
          </div>
        </div>

      )}


    </div>

  )
}