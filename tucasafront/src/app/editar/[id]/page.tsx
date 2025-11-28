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
import { UploadService } from "@/app/publicar/services/upload.service";


export default function EditarPage() {
    const params = useParams();
    const { showSuccess, showError, showInfo } = useToast();
    const [loading, setLoading] = useState(true);
    const [localImageFiles, setLocalImageFiles] = useState<{ file: File; url: string }[]>([]);
    const router = useRouter();
    const id = Number(params.id);
    const [submitting, setSubmitting] = useState(false);

    const {
        formData,
        setFormData,
        isSubmitting,
        handleInputChange,
        handlePropertyTypeChange,
        handleToggle,
        handleServiciosChange,
        handleLocationChange,
        handleAddressChange,
        handleZonaChange,
    } = usePropertyForm();

    useEffect(() => {
        const loadOferta = async () => {
            try {
                const data = await fecthOferta(id);
                const mapped = mapOfertaFormData(data);
                setFormData(mapped);
                setLoading(false);
            } catch (error) {
                console.error('Error al cargar la oferta:', error);
            }
        }

        if (id) loadOferta();

    }, [id, setFormData]);

    const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const newFiles = Array.from(files);
        const newImageObjs = newFiles.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
        setLocalImageFiles(prev => [...prev, ...newImageObjs]);
        setFormData((prev) => ({
            ...prev,
            images: [...prev.images, ...newImageObjs.map((i) => i.url)],
        }));

        e.target.value = "";
    }


    const handleLocalImageRemove = (index: number) => {
        if (formData.images.length <=1){
            showError('Los inmuebles deben tener almenos 1 imagen de referencia');
            return;
        }
        const urlToRemove = formData.images[index];

        setFormData(prev => {
            const updatedImages = prev.images.filter((_, i) => i !== index);
            return { ...prev, images: updatedImages };
        });

        if (urlToRemove.startsWith("blob:")) {
            URL.revokeObjectURL(urlToRemove);
            setLocalImageFiles(prev => prev.filter(img => img.url !== urlToRemove));
        }
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const existingUrls = formData.images.filter(url => !url.startsWith("blob:"));

            const newLocalImages = localImageFiles.filter(img => formData.images.includes(img.url));

            let uploadedImageUrls: string[] = [];
            if (newLocalImages.length > 0) {
                const assets = await UploadService.uploadImages(newLocalImages.map(i => i.file));
                uploadedImageUrls = assets.map(a => a.url);
            }

            const finalImages = [...existingUrls, ...uploadedImageUrls];

            if (finalImages.length === 0) {
                showInfo("Debes agregar al menos una imagen.");
                setSubmitting(false);
                return;
            }

            const finalFormData = {
                ...formData,
                images: finalImages,
            };

            const payload = buildPropertyPayload(finalFormData);
            console.log(payload)
            const result = await updateOferta(payload, id);
            console.log('Respuesta del servidor:', result);
            showSuccess('Oferta actualizada con éxito');

            setTimeout(() => {
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
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return <LoadingSpinner />
    }



    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Formulario */}
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Cambia los datos de tu oferta
                        </h1>
                        <p className="text-gray-600 mb-2">
                            Operación:{" "}
                            <span className="font-semibold text-blue-600">
                                {formData.operacion}
                            </span>
                        </p>
                        <p className="text-gray-600 mb-8">
                            tipo de propiedad: <span className="font-semibold text-blue-600">
                                {formData.propertyType}
                            </span>
                        </p>

                        <PropertyForm
                            formData={formData}
                            onInputChange={handleInputChange}
                            onPropertyTypeChange={handlePropertyTypeChange}
                            onToggle={handleToggle}
                            onImageUpload={handleLocalImageUpload}
                            onImageRemove={handleLocalImageRemove}
                            onServiciosChange={handleServiciosChange}
                            onSubmit={handleSubmit}
                            isSubmitting={isSubmitting}
                            onLocationChange={handleLocationChange}
                            onAddressChange={handleAddressChange}
                            onZonaChange={handleZonaChange}
                            mode='edicion'
                        />
                    </div>

                    {/* Vista Previa */}
                    <PropertyPreview formData={formData} />
                </div>
            </div>
        </div>
    );
}