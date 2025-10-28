import { URL_BACKEND } from "@/config/constants";
import type { ApiResponse } from "@/api/api";
import Image from 'next/image';
import Link from 'next/link';
import EditarFotosInmueble from '@/components/EditarFotosInmueble'

// Tipos mínimos para el GET
type Multimedia = {
  id: number;
  url: string;
  multimedia: string; // 'FOTO', 'VIDEO', etc.
  descripcion?: string;
};

type InmuebleDetalle = {
  id: number;
  multimedias?: Multimedia[];
};

async function fetchInmuebleDetalle(id: string): Promise<InmuebleDetalle | null> {
  try {
    const url = `${URL_BACKEND}/api/inmueble/${id}`;
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) return null;

    const data: ApiResponse<InmuebleDetalle> = await response.json();
    if ((data as any).error || !data.data) return null;

    return data.data;
  } catch {
    return null;
  }
}

function colectarFotos(inmueble: InmuebleDetalle): string[] {
  return (inmueble.multimedias ?? [])
    .filter(m => (m.multimedia ?? '').toUpperCase() === 'FOTO')
    .map(m => m.url)
    .filter(Boolean);
}

export default async function OfertaDetallePage({ params }: { params: { id: string } }) {
  const inmueble = await fetchInmuebleDetalle(params.id);

  if (!inmueble) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white shadow-md rounded-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Inmueble no encontrado</h1>
          <Link href="/" className="mt-6 inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const imagenes = colectarFotos(inmueble);

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Carrusel: scroll horizontal + snap + dots */}
          <div className="relative w-full h-64 md:h-96">
            <div
              className="
                flex h-full w-full overflow-x-auto snap-x snap-mandatory scroll-smooth
                [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
              "
            >
              {imagenes.map((url, i) => (
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
          </div>

          {/* Botón editar */}
          <div className="p-4 border-t">
            <EditarFotosInmueble
              inmuebleId={params.id}
              initialUrls={imagenes}
            />
          </div>
        </div>
      </div>
    </div>
  )
}