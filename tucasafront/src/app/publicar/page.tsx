"use client";

import { ArrowLeft } from "lucide-react";
import { usePropertyForm } from "./hooks/usePropertyForm";
import OperationSelector from "./components/OperationSelector";
import PropertyForm from "./components/PropertyForm";
import PropertyPreview from "./components/PropertyPreview";

export default function VenderPage() {
  const {
    step,
    formData,
    isSubmitting,
    handleInputChange,
    handlePropertyTypeChange,
    handleOperationSelect,
    handleToggle,
    handleImageUpload,
    handleServiciosChange,
    handleImageRemove,
    handleSubmit,
    resetToStep1,
    handleLocationChange,
    handleAddressChange, 
  } = usePropertyForm();

  // Paso 1: Selección de tipo de operación
  if (step === 1) {
    return <OperationSelector onSelect={handleOperationSelect} />;
  }

  // Paso 2: Formulario completo
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={resetToStep1}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a seleccionar operación
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ¿Qué tipo de propiedad quieres publicar?
            </h1>
            <p className="text-gray-600 mb-2">
              Operación:{" "}
              <span className="font-semibold text-blue-600">
                {formData.operacion}
              </span>
            </p>
            <p className="text-gray-600 mb-8">
              Selecciona el tipo de propiedad.
            </p>

            <PropertyForm
              formData={formData}
              onInputChange={handleInputChange}
              onPropertyTypeChange={handlePropertyTypeChange}
              onToggle={handleToggle}
              onImageUpload={handleImageUpload}
              onImageRemove={handleImageRemove}
              onServiciosChange={handleServiciosChange}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              onLocationChange={handleLocationChange}
              onAddressChange={handleAddressChange} // AGREGAR AQUÍ
              mode="registro"
            />
          </div>

          {/* Vista Previa */}
          <PropertyPreview formData={formData} />
        </div>
      </div>
    </div>
  );
}
