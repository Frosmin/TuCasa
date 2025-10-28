// src/app/oferta/[id]/page.tsx
import { URL_BACKEND } from "@/config/constants";
import type { ApiResponse } from "@/api/api";
import type { Oferta } from "@/models/Oferta";
import Image from 'next/image';
import Link from 'next/link'

// Función para obtener los datos de una oferta específica
async function fetchOfertaDetalle(id: string): Promise<Oferta | null> {
    try {
        const url = `${URL_BACKEND}/api/oferta/${id}`; //inmuehble 
        const response = await fetch(url, {
             cache: 'no-store'
        });

        if (!response.ok) {
            console.error(`Error fetching oferta ${id}: ${response.status}`);
            return null;
        }

        const data: ApiResponse<Oferta> = await response.json();

        if ((data as any).error || !data.data) {
            console.error(`API error fetching oferta ${id}: ${(data as any).message}`);
            return null;
        }

        return data.data;
    } catch (error) {
        console.error('Error fetching oferta detalle:', error);
        return null;
    }
}

// Metadata dinámica (opcional pero recomendado para SEO)
export async function generateMetadata({ params }: { params: { id: string } }) {
  const oferta = await fetchOfertaDetalle(params.id);
  if (!oferta) {
    return { title: 'Oferta no encontrada' };
  }
  return {
    title: `${oferta.inmueble.tipo} en ${oferta.tipo} - ${oferta.inmueble.direccion} | TuCasa`,
    description: oferta.descripcion || (oferta.inmueble as any).descripcion || `Detalles de la propiedad en ${oferta.inmueble.direccion}`,
  };
}

// Junta y normaliza URLs de imágenes (intenta varios campos habituales)
function colectarUrlsImagen(oferta: Oferta): string[] {
  const urls: string[] = []
  const oAny = oferta as any
  const iAny = (oferta.inmueble ?? {}) as any

  if (Array.isArray(oAny.imagenes)) urls.push(...oAny.imagenes)
  if (Array.isArray(iAny.imagenes)) urls.push(...iAny.imagenes)

  if (iAny.url_imagen) urls.push(iAny.url_imagen)
  if (iAny.imagen) urls.push(iAny.imagen)
  if (oAny.imagen) urls.push(oAny.imagen)

  const unique = Array.from(new Set(urls.filter(Boolean)))

  // Normalizar relativas -> absolutas basadas en URL_BACKEND
  const toAbs = (u: string) => {
    try {
      if (/^https?:\/\//i.test(u)) return u
      return new URL(u, URL_BACKEND).toString()
    } catch {
      return u
    }
  }
  return unique.map(toAbs)
}

// El componente de la página
export default async function OfertaDetallePage({ params }: { params: { id: string } }) {
    const { id } = params;
    const oferta = await fetchOfertaDetalle(id);

    if (!oferta) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center p-8 bg-white shadow-md rounded-lg">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Oferta no encontrada</h1>
                    <p className="text-gray-600">No pudimos encontrar los detalles para esta oferta.</p>
                    <Link href="/" className="mt-6 inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition">
                        Volver al inicio
                    </Link>
                </div>
            </div>
        );
    }

    const { inmueble } = oferta;
    const imagenes = colectarUrlsImagen(oferta);

    return (
        <div className="min-h-screen bg-gray-100 py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                    {/* Carrusel sin JS: scroll horizontal con snap y dots */}
                    <div className="relative w-full h-64 md:h-96">
                      {imagenes.length > 0 ? (
                        <>
                          <div
                            className="
                              flex h-full w-full overflow-x-auto snap-x snap-mandatory scroll-smooth
                              [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
                            "
                          >
                            {imagenes.map((src, i) => (
                              <div
                                key={i}
                                id={`img-${i + 1}`}
                                className="relative min-w-full h-full snap-center"
                              >
                                <Image
                                  src={src}
                                  alt={`Imagen ${i + 1} de ${inmueble?.tipo ?? 'Inmueble'}${inmueble?.direccion ? ` en ${inmueble.direccion}` : ''}`}
                                  fill
                                  sizes="100vw"
                                  style={{ objectFit: 'cover' }}
                                  priority={i === 0}
                                  unoptimized
                                />
                              </div>
                            ))}
                          </div>

                          {/* Dots */}
                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                            {imagenes.map((_, i) => (
                              <a
                                key={i}
                                href={`#img-${i + 1}`}
                                aria-label={`Ir a la imagen ${i + 1}`}
                                className="h-2.5 w-2.5 rounded-full bg-white/70 hover:bg-white transition-colors"
                              />
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-500 text-sm">Sin imágenes</span>
                        </div>
                      )}
                    </div>
                </div>
            </div>
        </div>
    );
}