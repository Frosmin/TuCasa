'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Bed, Bath, Maximize, Car, MapPin, ArrowLeft, Heart } from 'lucide-react'
import Link from 'next/link'
import type { Oferta } from '@/models/Oferta'
import { URL_BACKEND } from '@/config/constants'

import ImageCarousel from '@/components/ImageCarousel';

export default function DetalleOfertaPage() {
  const { id } = useParams()
  const router = useRouter()
  const [oferta, setOferta] = useState<Oferta | null>(null)
  const [imageError, setImageError] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rawData, setRawData] = useState<any>(null) // Para debug

  const [images, setImages] = useState<string[]>([])
    

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
        //trasformar la lista compleja que tiene esportada, url a solo una lista de urls
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

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/ventas" className="flex items-center gap-2 text-blue-600 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Volver al catálogo
        </Link>
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
        >
          <Heart
            className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
          />
        </button>
      </div>


      {/* Componete que espera una lista de fotos solo URLs */}
      <ImageCarousel images={images}/>


      {/* Título y precio */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {getInmuebleLabel(inmueble?.tipo || '')} en {getOfertaLabel(oferta.tipo)}
        </h1>
        <p className="text-3xl font-extrabold text-blue-600">
          {oferta.moneda} {formatearPrecio(oferta.precio)}
          {oferta.tipo !== 'VENTA' && (
            <span className="text-lg font-normal"> / {getTipoPagoLabel(oferta.tipoPago)}</span>
          )}
        </p>
        {oferta.tipo === 'ALQUILER' && oferta.duracion && (
          <p className="text-sm text-gray-500">
            Duración: {oferta.duracion} días
          </p>
        )}
        <p className="text-sm text-gray-500 mt-1">
          Publicado el: {new Date(oferta.fechaPublicacionInicio).toLocaleDateString('es-BO')}
        </p>
      </div>

      {/* Dirección */}
      <div className="flex items-center gap-2 text-gray-700 mb-6">
        <MapPin className="h-4 w-4 text-blue-500" />
        <span>{inmueble?.direccion || 'Dirección no especificada'}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-y border-gray-200 py-4 mb-6 text-sm">
        {inmueble?.superficie && (
          <div className="flex items-center gap-2">
            <Maximize className="h-4 w-4 text-gray-500" />
            <span>{inmueble.superficie} m²</span>
          </div>
        )}
        {inmueble?.numDormitorios && (
          <div className="flex items-center gap-2">
            <Bed className="h-4 w-4 text-gray-500" />
            <span>{inmueble.numDormitorios} Dormitorios</span>
          </div>
        )}
        {inmueble?.numBanos && (
          <div className="flex items-center gap-2">
            <Bath className="h-4 w-4 text-gray-500" />
            <span>{inmueble.numBanos} Baños</span>
          </div>
        )}
        {inmueble?.garaje && (
          <div className="flex items-center gap-2">
            <Car className="h-4 w-4 text-gray-500" />
            <span>Garaje</span>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h2>
        <p className="text-gray-700 leading-relaxed">{oferta.descripcion}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Detalles de la oferta</h2>
        <p className="text-gray-700 leading-relaxed">{oferta.descripcion_oferta}</p>
      </div>

      {inmueble?.servicios && inmueble.servicios.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Servicios incluidos</h2>
          <div className="flex flex-wrap gap-2">
            {inmueble.servicios.map(servicio => (
              <span
                key={servicio.id}
                className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm"
              >
                {servicio.nombre}
              </span>
            ))}
          </div>
        </div>
      )}

      {inmueble && (
        <div className="grid grid-cols-2 gap-3 text-sm border-t border-gray-200 pt-4">
          {[
            ['Patio', inmueble.patio],
            ['Amoblado', inmueble.amoblado],
            ['Depósito', inmueble.deposito],
            ['Sótano', inmueble.sotano],
          ]
            .filter(([, val]) => val !== undefined)
            .map(([label, val]) => (
              <div key={String(label)} className="flex justify-between">
                <span className="text-gray-600">{label}:</span>
                <span className="font-medium">{val ? 'Sí' : 'No'}</span>
              </div>
            ))}
        </div>
      )}

      <div className="pt-4 mt-6">
        <button
          type='button'
          onClick={()=>{router.push(`/editar/${id}`)}}
          className="w-3xs px-3 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
         Editar oferta
        </button>
      </div>
    </div>
  )
}