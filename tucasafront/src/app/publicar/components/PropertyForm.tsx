// publicar/components/PropertyForm.tsx

import { PropertyFormData } from '../types/property.types';
import { CURRENCY_OPTIONS, PAYMENT_TYPE_OPTIONS } from '../data/property.constants';
import PropertyTypeSelector from './PropertyTypeSelector';
import CasaFields from './CasaFields';
import TiendaFields from './TiendaFields';
import DepartamentoFields from './DepartamentoFields';
import LoteFields from './LoteFields';
import ImageUploader from './ImageUploader';

interface PropertyFormProps {
  formData: PropertyFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onPropertyTypeChange: (type: any) => void;
  onToggle: (field: keyof PropertyFormData) => void;
  onServiciosChange: (ids: number[]) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: (index: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export default function PropertyForm({
  formData,
  onInputChange,
  onPropertyTypeChange,
  onToggle,
  onServiciosChange,
  onImageUpload,
  onImageRemove,
  onSubmit,
  isSubmitting,
}: PropertyFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Tipo de Propiedad */}
      <PropertyTypeSelector
        selectedType={formData.propertyType}
        onChange={onPropertyTypeChange}
      />

      {/* Campos específicos para Casa */}
      {formData.propertyType === 'CASA' && (
        <CasaFields
          formData={formData}
          onChange={onInputChange}
          onToggle={onToggle}
          onServiciosChange={onServiciosChange}
        />
      )}

      {formData.propertyType === 'TIENDA' && (
        <TiendaFields
          formData={formData}
          onChange={onInputChange}
          onToggle={onToggle}
          onServiciosChange={onServiciosChange}
        />
      )}
      {/* Campos específicos para Lote */}
      {formData.propertyType === 'LOTE' && (
        <LoteFields
          formData={formData}
          onChange={onInputChange}
          onToggle={onToggle}
          onServiciosChange={onServiciosChange} 
        />
      )}

      {/* Campos específicos para Departamento */}
      {formData.propertyType === 'DEPARTAMENTO' && (
        <DepartamentoFields
          formData={formData}
          onChange={onInputChange}
          onToggle={onToggle}
          onServiciosChange={onServiciosChange}
        />
      )}

      {/* Dirección */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Dirección *
        </label>
        <input
          type="text"
          name="direccion"
          value={formData.direccion}
          onChange={onInputChange}
          placeholder="Av. Siempre Viva 123"
          required
          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      {/* Coordenadas */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Latitud *
          </label>
          <input
            type="number"
            step="any"
            name="latitud"
            value={formData.latitud}
            onChange={onInputChange}
            placeholder="-17.3935"
            required
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Longitud *
          </label>
          <input
            type="number"
            step="any"
            name="longitud"
            value={formData.longitud}
            onChange={onInputChange}
            placeholder="-66.1570"
            required
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      {/* Superficie y Precio */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Superficie (m²) *
          </label>
          <input
            type="number"
            step="any"
            name="superficie"
            value={formData.superficie}
            onChange={onInputChange}
            placeholder="120.5"
            required
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Precio *
          </label>
          <input
            type="number"
            step="any"
            name="precio"
            value={formData.precio}
            onChange={onInputChange}
            placeholder="3000.00"
            required
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      {/* Moneda y Tipo de Pago */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Moneda *
          </label>
          <select
            name="moneda"
            value={formData.moneda}
            onChange={onInputChange}
            required
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          >
            {CURRENCY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {/* Tipo de Pago solo para ALQUILER y ANTICRETICO */}
        {formData.operacion !== 'VENTA' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Pago *
            </label>
            <select
              name="tipoPago"
              value={formData.tipoPago}
              onChange={onInputChange}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            >
              {PAYMENT_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Duración (solo para ANTICRETICO) */}
      {formData.operacion === 'ANTICRETICO' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duración del anticrético (meses) *
          </label>
          <input
            type="number"
            name="duracion"
            value={formData.duracion}
            onChange={onInputChange}
            placeholder="24"
            required
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      )}

      {/* Descripción del Inmueble */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción del Inmueble *
        </label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={onInputChange}
          rows={3}
          required
          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
        />
      </div>

      {/* Descripción de la Oferta */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción de la Oferta *
        </label>
        <textarea
          name="descripcionOferta"
          value={formData.descripcionOferta}
          onChange={onInputChange}
          rows={3}
          required
          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
        />
      </div>

      {/* Upload de Imágenes */}
      <ImageUploader
        images={formData.images}
        onUpload={onImageUpload}
        onRemove={onImageRemove}
      />

      {/* Botón Submit */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Publicando...' : 'Publicar ahora'}
        </button>
      </div>
    </form>
  );
}