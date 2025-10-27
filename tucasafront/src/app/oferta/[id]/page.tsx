import React from 'react'

type PageProps = {
  params: { id: string }
}

export default function OfertaDetallePage({ params }: PageProps) {
  const { id } = params

  return (
    <div className="min-h-screen p-6 flex flex-col items-start gap-4">
      <h1 className="text-xl font-semibold">Detalle de oferta #{id}</h1>
      <button className="px-4 py-2 rounded bg-blue-600 text-white">editar imagenes</button>
    </div>
  )
}