// components/FiltroSidebar.tsx
'use client'
import { useState, useMemo } from 'react'
import { ChevronDown, MapPin, X } from 'lucide-react'
import type { Oferta, MonedaType } from '@/models/Oferta'
import LocationPicker from '@/app/publicar/components/LocationPicker'

export interface Filtros {
  precioMin: number
  precioMax: number
  superficieMin: number
  superficieMax: number
  dormitorios: string
  moneda?: MonedaType | ''
  garaje?: boolean | null
  amoblado?: boolean | null
  patio?: boolean | null
  sotano?: boolean | null
  servicios?: string[]
  proximidad?: number | null
  latitud: number
  longitud: number
  zona?: string
}

interface FiltroSidebarProps {
  filters: Filtros
  setFilters: (filters: Filtros) => void
  tipos: string[]
  ofertas: Oferta[]
  tipoInmueble: string
}

export const FiltroSidebar = ({
  filters,
  setFilters,
  tipoInmueble,
  ofertas,
}: FiltroSidebarProps) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    zona: true, // ✅ NUEVO: Sección de zona
    localizacion: false,
    moneda: true,
    precio: true,
    superficie: true,
    dormitorios: true,
    caracteristicas: false,
    servicios: false,
  })

  // ✅ NUEVO: Estados para el dropdown de zona
  const [isZonaDropdownOpen, setIsZonaDropdownOpen] = useState(false)
  const [zonaSearchTerm, setZonaSearchTerm] = useState('')

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // ✅ NUEVO: Extraer zonas únicas de las ofertas
  const zonasUnicas = useMemo(() => {
    const zonas = new Set<string>()
    ofertas.forEach(oferta => {
      if (oferta.inmueble.zona && oferta.inmueble.zona.trim() !== '') {
        zonas.add(oferta.inmueble.zona.trim())
      }
    })
    return Array.from(zonas).sort()
  }, [ofertas])

  // ✅ NUEVO: Filtrar zonas según búsqueda
  const zonasFiltradas = useMemo(() => {
    if (!zonaSearchTerm) return zonasUnicas
    return zonasUnicas.filter(zona =>
      zona.toLowerCase().includes(zonaSearchTerm.toLowerCase())
    )
  }, [zonasUnicas, zonaSearchTerm])

  // Monedas disponibles
  const monedasUnicas: MonedaType[] = ['$', 'Bs']

  // Calcular rangos de la API
  const precios = ofertas.map(o => o.precio)
  const precioMin = precios.length > 0 ? Math.min(...precios) : 0
  const precioMax = precios.length > 0 ? Math.max(...precios) : 100000

  const superficies = ofertas.map(o => o.inmueble.superficie)
  const supMin = superficies.length > 0 ? Math.min(...superficies) : 0
  const supMax = superficies.length > 0 ? Math.max(...superficies) : 1000

  const dormitorios = Array.from(
    new Set(
      ofertas
        .filter(o => o.inmueble.numDormitorios)
        .map(o => o.inmueble.numDormitorios)
    )
  ).sort((a, b) => (a || 0) - (b || 0))

  // Obtener servicios únicos
  const serviciosUnicos = Array.from(
    new Set(
      ofertas
        .flatMap(o => o.inmueble.servicios || [])
        .map(s => s.nombre)
    )
  ).sort()

  // Verificar si hay propiedades con características
  const tieneGaraje = ofertas.some(o => o.inmueble.garaje === true)
  const tieneAmoblado = ofertas.some(o => o.inmueble.amoblado === true)
  const tienePatio = ofertas.some(o => o.inmueble.patio === true)
  const tieneSotano = ofertas.some(o => o.inmueble.sotano === true)

  return (
    <div className="space-y-4">
      {zonasUnicas.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm">
          <button
            onClick={() => toggleSection('zona')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition"
          >
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Zona
            </h3>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${expandedSections.zona ? 'rotate-180' : ''}`}
            />
          </button>

          {expandedSections.zona && (
            <div className="px-4 py-3 border-t border-gray-200">
              <div className="relative">
                {/* Selector Principal */}
                <button
                  type="button"
                  onClick={() => setIsZonaDropdownOpen(!isZonaDropdownOpen)}
                  className="w-full flex items-center justify-between px-3 py-2.5 bg-white border border-gray-300 rounded-lg hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  <span className={`truncate text-sm ${filters.zona ? 'text-gray-900' : 'text-gray-500'}`}>
                    {filters.zona || 'Todas las zonas'}
                  </span>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    {filters.zona && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setFilters({ ...filters, zona: '' })
                          setZonaSearchTerm('')
                        }}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    )}
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform ${isZonaDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </div>
                </button>

                {/* Dropdown */}
                {isZonaDropdownOpen && (
                  <>
                    {/* Overlay */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsZonaDropdownOpen(false)}
                    />

                    {/* Menú desplegable */}
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
                      {/* Buscador */}
                      <div className="p-2 border-b border-gray-200">
                        <input
                          type="text"
                          placeholder="Buscar zona..."
                          value={zonaSearchTerm}
                          onChange={(e) => setZonaSearchTerm(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>

                      {/* Lista de zonas */}
                      <div className="overflow-y-auto max-h-64">
                        {/* Opción "Todas las zonas" */}
                        <button
                          onClick={() => {
                            setFilters({ ...filters, zona: '' })
                            setIsZonaDropdownOpen(false)
                            setZonaSearchTerm('')
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                            !filters.zona ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                          }`}
                        >
                          Todas las zonas
                        </button>

                        {/* Opciones de zonas */}
                        {zonasFiltradas.length > 0 ? (
                          zonasFiltradas.map((zona) => (
                            <button
                              key={zona}
                              onClick={() => {
                                setFilters({ ...filters, zona })
                                setIsZonaDropdownOpen(false)
                                setZonaSearchTerm('')
                              }}
                              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                                filters.zona === zona ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                              }`}
                            >
                              {zona}
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-8 text-center text-sm text-gray-500">
                            No se encontraron zonas
                          </div>
                        )}
                      </div>

                      {/* Contador */}
                      {zonaSearchTerm && zonasFiltradas.length > 0 && (
                        <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-200 bg-gray-50">
                          {zonasFiltradas.length} zona{zonasFiltradas.length !== 1 ? 's' : ''} encontrada{zonasFiltradas.length !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filtro por Localización */}
      <div className="bg-white rounded-lg shadow-sm">
        <button
          onClick={() => toggleSection('localizacion')}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition"
        >
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Localización
          </h3>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${expandedSections.localizacion ? 'rotate-180' : ''}`}
          />
        </button>

        {expandedSections.localizacion && (
          <div className="px-4 py-3 border-t border-gray-200 space-y-3">
            <LocationPicker
              latitude={String(filters.latitud)}
              longitude={String(filters.longitud)}
              onChange={(lat, lng) => {
                setFilters({
                  ...filters,
                  latitud: lat,
                  longitud: lng,
                })
              }}
            />

            <div>
              <label className="text-xs font-semibold text-gray-700">
                Proximidad (km)
              </label>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={filters.proximidad || 0}
                  onChange={e =>
                    setFilters({
                      ...filters,
                      proximidad: parseFloat(e.target.value) || null,
                    })
                  }
                  className="flex-1"
                />
                <span className="text-sm font-semibold text-blue-600 w-12">
                  {filters.proximidad || 0} km
                </span>
              </div>
            </div>

            <button
              onClick={() =>
                setFilters({
                  ...filters,
                  proximidad: null,
                })
              }
              className="w-full px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              Limpiar filtro de proximidad
            </button>
          </div>
        )}
      </div>

      {/* Filtro por Moneda */}
      {monedasUnicas.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm">
          <button
            onClick={() => toggleSection('moneda')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition"
          >
            <h3 className="font-semibold text-gray-900">Moneda</h3>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${expandedSections.moneda ? 'rotate-180' : ''}`}
            />
          </button>

          {expandedSections.moneda && (
            <div className="px-4 py-3 border-t border-gray-200 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="moneda"
                  checked={filters.moneda === '' || !filters.moneda}
                  onChange={() =>
                    setFilters({
                      ...filters,
                      moneda: '',
                    })
                  }
                  className="rounded"
                />
                <span className="text-sm text-gray-700">Todas las monedas</span>
              </label>

              {monedasUnicas.map(moneda => (
                <label key={moneda} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="moneda"
                    value={moneda}
                    checked={filters.moneda === moneda}
                    onChange={() =>
                      setFilters({
                        ...filters,
                        moneda: moneda as MonedaType,
                      })
                    }
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">{moneda}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Filtro por Precio */}
      <div className="bg-white rounded-lg shadow-sm">
        <button
          onClick={() => toggleSection('precio')}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition"
        >
          <h3 className="font-semibold text-gray-900">Precio</h3>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${expandedSections.precio ? 'rotate-180' : ''}`}
          />
        </button>

        {expandedSections.precio && (
          <div className="px-4 py-3 border-t border-gray-200 space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-700">Mínimo</label>
              <input
                type="number"
                value={filters.precioMin}
                onChange={e =>
                  setFilters({
                    ...filters,
                    precioMin: parseFloat(e.target.value) || 0,
                  })
                }
                min={precioMin}
                max={precioMax}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700">Máximo</label>
              <input
                type="number"
                value={filters.precioMax}
                onChange={e =>
                  setFilters({
                    ...filters,
                    precioMax: parseFloat(e.target.value) || Infinity,
                  })
                }
                min={precioMin}
                max={precioMax}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-1"
              />
            </div>

            <div className="text-xs text-gray-500">
              Rango: ${precioMin.toLocaleString()} - ${precioMax.toLocaleString()}
            </div>
          </div>
        )}
      </div>

      {/* Filtro por Superficie */}
      <div className="bg-white rounded-lg shadow-sm">
        <button
          onClick={() => toggleSection('superficie')}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition"
        >
          <h3 className="font-semibold text-gray-900">Superficie (m²)</h3>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${expandedSections.superficie ? 'rotate-180' : ''}`}
          />
        </button>

        {expandedSections.superficie && (
          <div className="px-4 py-3 border-t border-gray-200 space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-700">Mínima</label>
              <input
                type="number"
                value={filters.superficieMin}
                onChange={e =>
                  setFilters({
                    ...filters,
                    superficieMin: parseFloat(e.target.value) || 0,
                  })
                }
                min={supMin}
                max={supMax}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700">Máxima</label>
              <input
                type="number"
                value={filters.superficieMax}
                onChange={e =>
                  setFilters({
                    ...filters,
                    superficieMax: parseFloat(e.target.value) || Infinity,
                  })
                }
                min={supMin}
                max={supMax}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-1"
              />
            </div>

            <div className="text-xs text-gray-500">
              Rango: {supMin.toLocaleString()} - {supMax.toLocaleString()} m²
            </div>
          </div>
        )}
      </div>

      {/* Filtro por Dormitorios */}
      {(tipoInmueble !== 'LOTE' && dormitorios.length > 0) && (
        <div className="bg-white rounded-lg shadow-sm">
          <button
            onClick={() => toggleSection('dormitorios')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition"
          >
            <h3 className="font-semibold text-gray-900">Dormitorios</h3>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${expandedSections.dormitorios ? 'rotate-180' : ''}`}
            />
          </button>

          {expandedSections.dormitorios && (
            <div className="px-4 py-3 border-t border-gray-200 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="dormitorios"
                  checked={filters.dormitorios === ''}
                  onChange={() =>
                    setFilters({
                      ...filters,
                      dormitorios: '',
                    })
                  }
                  className="rounded"
                />
                <span className="text-sm text-gray-700">Cualquiera</span>
              </label>

              {dormitorios.map(dorm => (
                <label key={dorm} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="dormitorios"
                    value={dorm}
                    checked={filters.dormitorios === String(dorm)}
                    onChange={() =>
                      setFilters({
                        ...filters,
                        dormitorios: String(dorm),
                      })
                    }
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">{dorm} dormitorio(s)</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Filtro por Características */}
      {(tipoInmueble !== 'LOTE') && (tieneGaraje || tieneAmoblado || tienePatio || tieneSotano) && (
        <div className="bg-white rounded-lg shadow-sm">
          <button
            onClick={() => toggleSection('caracteristicas')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition"
          >
            <h3 className="font-semibold text-gray-900">Características</h3>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${expandedSections.caracteristicas ? 'rotate-180' : ''}`}
            />
          </button>

          {expandedSections.caracteristicas && (
            <div className="px-4 py-3 border-t border-gray-200 space-y-2">
              {tieneGaraje && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.garaje === true}
                    onChange={() =>
                      setFilters({
                        ...filters,
                        garaje: filters.garaje === true ? null : true,
                      })
                    }
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Con garaje</span>
                </label>
              )}

              {tieneAmoblado && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.amoblado === true}
                    onChange={() =>
                      setFilters({
                        ...filters,
                        amoblado: filters.amoblado === true ? null : true,
                      })
                    }
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Amoblado</span>
                </label>
              )}
              {tienePatio && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.patio === true}
                    onChange={() =>
                      setFilters({
                        ...filters,
                        patio: filters.patio === true ? null : true,
                      })
                    }
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Con Patio</span>
                </label>
              )}
              {tieneSotano && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.sotano === true}
                    onChange={() =>
                      setFilters({
                        ...filters,
                        sotano: filters.sotano === true ? null : true,
                      })
                    }
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Con Sotano</span>
                </label>
              )}
            </div>
          )}
        </div>
      )}

      {/* Filtro por Servicios */}
      {serviciosUnicos.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm">
          <button
            onClick={() => toggleSection('servicios')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition"
          >
            <h3 className="font-semibold text-gray-900">Servicios</h3>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${expandedSections.servicios ? 'rotate-180' : ''}`}
            />
          </button>

          {expandedSections.servicios && (
            <div className="px-4 py-3 border-t border-gray-200 space-y-2">
              {serviciosUnicos.map(servicio => (
                <label key={servicio} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(filters.servicios || []).includes(servicio)}
                    onChange={() =>
                      setFilters({
                        ...filters,
                        servicios: (filters.servicios || []).includes(servicio)
                          ? (filters.servicios || []).filter(s => s !== servicio)
                          : [...(filters.servicios || []), servicio],
                      })
                    }
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">{servicio}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}