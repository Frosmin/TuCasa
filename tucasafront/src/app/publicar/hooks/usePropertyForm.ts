// publicar/hooks/usePropertyForm.ts
import { useState } from 'react';
import { PropertyFormData, OperationType, PropertyType } from '../types/property.types';
import { INITIAL_FORM_DATA } from '../data/property.constants';
import { PropertyService } from '../services/property.service';
import { buildPropertyPayload, handleApiError } from '../utils/property.utils';
import { useToast } from '@/components/Toast';
import { UploadService } from '../services/upload.service';

export function usePropertyForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<PropertyFormData>(INITIAL_FORM_DATA);
  const { showSuccess, showError } = useToast();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePropertyTypeChange = (type: PropertyType) => {
    setFormData((prev) => ({ ...prev, propertyType: type }));
  };

  const handleOperationSelect = (operation: OperationType) => {
    setFormData((prev) => ({ ...prev, operacion: operation }));
    setStep(2);
  };

  const handleToggle = (field: keyof PropertyFormData) => {
    setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleServiciosChange = (ids: number[]) => {
    setFormData((prev) => ({ ...prev, serviciosIds: ids }));
  };


  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsSubmitting(true);
      const assets = await UploadService.uploadImages(Array.from(files));
      const urls = assets.map((a) => a.url);
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
      showSuccess(`Imágenes subidas (${urls.length})`);
    } catch (err) {
      console.error(err);
      showError('Error al subir imágenes. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
      e.target.value = '';
    }
  };

  const handleImageRemove = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = buildPropertyPayload(formData);
      const data = await PropertyService.createProperty(payload);
      
      console.log('Respuesta del servidor:', data);
      showSuccess('¡Propiedad publicada exitosamente!');

      // Resetear formulario
      setStep(1);
      setFormData(INITIAL_FORM_DATA);
    } catch (error: any) {
      console.error('Error:', error);
      
      if (error.data) {
        const errorMessage = handleApiError(error.data);
        showError(`Errores de validación:\n${errorMessage}`);
      } else {
        showError('Error al publicar la propiedad. Por favor, intenta de nuevo.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetToStep1 = () => {
    setStep(1);
  };

  return {
    step,
    formData,
    isSubmitting,
    handleInputChange,
    handlePropertyTypeChange,
    handleOperationSelect,
    handleToggle,
    handleServiciosChange,
    handleImageUpload,
    handleImageRemove,
    handleSubmit,
    resetToStep1,
  };
}