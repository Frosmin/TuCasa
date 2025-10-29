"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePropertyForm } from "../../publicar/hooks/usePropertyForm";
import { fecthOferta, updateOferta } from "../editar.service";
import { mapOfertaFormData } from "./mapOferta";
import { buildPropertyPayload, handleApiError } from "../../publicar/utils/property.utils";
import { useToast } from '@/components/Toast';
import PropertyForm from "../../publicar/components/PropertyForm";
import PropertyPreview from "../../publicar/components/PropertyPreview";
import LoadingSpinner from "@/components/Loading";


export default function EditarPage() {
    const params = useParams();
    const { showSuccess, showError } = useToast();
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const id = Number(params.id);

    const {
        formData,
        setFormData,
        isSubmitting,
        handleInputChange,
        handlePropertyTypeChange,
        handleToggle,
        handleImageUpload,
        handleServiciosChange,
        handleImageRemove,
    } = usePropertyForm();

    useEffect(() => {
        const loadOferta = async () => {
            try {
                const data = await fecthOferta(id);
                const mapped = mapOfertaFormData(data);
                // setFormData(mapped);
                setLoading(false);
            } catch (error) {
                console.error('Error al cargar la oferta:', error);
            }
        }

        if (id) loadOferta();

    }, [id, setFormData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = buildPropertyPayload(formData);
            const result = await updateOferta(payload, id);
            console.log('Respuesta del servidor:', result);
            showSuccess('Oferta actualizada con éxito');

            setTimeout(() =>{
                router.back();
            }, 1000);

        } catch (error: any) {
            console.error('Error al actualizar la oferta:', error);
            if (error.data) {
                const errorMessage = handleApiError(error.data);
                showError(`Errores de validación:\n${errorMessage}`);
            } else {
                showError('Error al actualizar la oferta. Por favor, intenta de nuevo.');
            }
        }
    }

    if(loading) {
        return <LoadingSpinner/>
    }



    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

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
                            mode= 'edicion'
                        />
                    </div>

                    {/* Vista Previa */}
                    <PropertyPreview formData={formData} />
                </div>
            </div>
        </div>
    );
}