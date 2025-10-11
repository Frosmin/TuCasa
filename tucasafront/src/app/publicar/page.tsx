'use client';

import { useState } from 'react';
import { Upload, Eye, Home, Building2, Store, DoorClosed, ArrowRight, ArrowLeft, X } from 'lucide-react';
import Image from 'next/image';

type PropertyType = 'casa' | 'departamento' | 'lote' | 'tienda';
type OperationType = 'venta' | 'alquiler' | 'anticrético';

export default function VenderPage() {
    const [step, setStep] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [formData, setFormData] = useState({
        operacion: '' as OperationType | '',
        propertyType: 'casa' as PropertyType,
        direccion: '',
        zona: '',
        superficie: '',
        precio: '',
        descripcion: '',
        dormitorios: '',
        banos: '',
        garaje: '',
        patio: '',
        amoblado: '',
        sotano: '',
        images: [] as string[],
    });

    const propertyTypes = [
        { id: 'casa', label: 'Casa', icon: Home },
        { id: 'departamento', label: 'Departamento', icon: Building2 },
        { id: 'lote', label: 'Lote', icon: Home },
        { id: 'tienda', label: 'Tienda', icon: Store },
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePropertyTypeChange = (type: PropertyType) => {
        setFormData(prev => ({ ...prev, propertyType: type }));
    };

    const handleOperationSelect = (operation: OperationType) => {
        setFormData(prev => ({ ...prev, operacion: operation }));
        setStep(2);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newImages = Array.from(files).map(file => URL.createObjectURL(file));
            setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
            setCurrentImageIndex(0);
        }
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => 
            prev === formData.images.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => 
            prev === 0 ? formData.images.length - 1 : prev - 1
        );
    };

    const goToImage = (index: number) => {
        setCurrentImageIndex(index);
    };

    const removeImage = (indexToRemove: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, idx) => idx !== indexToRemove)
        }));
        // Ajustar el índice actual si es necesario
        if (currentImageIndex >= indexToRemove && currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form data:', formData);
        alert('Propiedad publicada (simulación)');
    };

    // Paso 1: Selección de tipo de operación
    if (step === 1) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
                <div className="max-w-2xl w-full mx-4">
                    <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 text-center">
                            ¿Qué tipo de operación deseas realizar?
                        </h1>
                        <p className="text-gray-600 mb-10 text-center">Selecciona una opción para continuar</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button
                                onClick={() => handleOperationSelect('venta')}
                                className="group p-8 border-2 border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 text-center"
                            >
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500 transition-colors">
                                    <Home className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Venta</h3>
                                <p className="text-sm text-gray-600">Vende tu propiedad</p>
                            </button>

                            <button
                                onClick={() => handleOperationSelect('alquiler')}
                                className="group p-8 border-2 border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-300 text-center"
                            >
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500 transition-colors">
                                    <Building2 className="w-8 h-8 text-green-600 group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Alquiler</h3>
                                <p className="text-sm text-gray-600">Alquila tu propiedad</p>
                            </button>

                            <button
                                onClick={() => handleOperationSelect('anticrético')}
                                className="group p-8 border-2 border-gray-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-300 text-center"
                            >
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500 transition-colors">
                                    <Store className="w-8 h-8 text-purple-600 group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Anticrético</h3>
                                <p className="text-sm text-gray-600">Anticrético de propiedad</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Paso 2: Formulario completo
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Botón volver */}
                <button
                    onClick={() => setStep(1)}
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
                            Operación: <span className="font-semibold text-blue-600">
                                {formData.operacion.charAt(0).toUpperCase() + formData.operacion.slice(1)}
                            </span>
                        </p>
                        <p className="text-gray-600 mb-8">Selecciona el tipo de propiedad.</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Tipo de Propiedad */}
                            <div className="flex flex-wrap gap-3">
                                {propertyTypes.map(({ id, label, icon: Icon }) => (
                                    <button
                                        key={id}
                                        type="button"
                                        onClick={() => handlePropertyTypeChange(id as PropertyType)}
                                        className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 transition-all duration-300 font-medium ${
                                            formData.propertyType === id
                                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300'
                                        }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {label}
                                    </button>
                                ))}
                            </div>

                            {/* Campos específicos para Casa, HACER LO MISMO PARA CADA TIPO DE INMUEBLE, NO TOCAR LOS DEMÁS */}
                            {formData.propertyType === 'casa' && (
                                <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <h3 className="font-semibold text-gray-900 mb-3">Detalles de la casa</h3>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Número de dormitorios
                                            </label>
                                            <input
                                                type="number"
                                                name="dormitorios"
                                                value={formData.dormitorios}
                                                onChange={handleInputChange}
                                                placeholder="Ej: 3"
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Número de baños
                                            </label>
                                            <input
                                                type="number"
                                                name="banos"
                                                value={formData.banos}
                                                onChange={handleInputChange}
                                                placeholder="Ej: 2"
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-300">
                                            <label className="text-sm font-medium text-gray-700">
                                                ¿Tiene garaje?
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ 
                                                    ...prev, 
                                                    garaje: prev.garaje === 'si' ? 'no' : 'si' 
                                                }))}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                                    formData.garaje === 'si' ? 'bg-blue-600' : 'bg-gray-300'
                                                }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                        formData.garaje === 'si' ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                                />
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-300">
                                            <label className="text-sm font-medium text-gray-700">
                                                ¿Tiene patio?
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ 
                                                    ...prev, 
                                                    patio: prev.patio === 'si' ? 'no' : 'si' 
                                                }))}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                                    formData.patio === 'si' ? 'bg-blue-600' : 'bg-gray-300'
                                                }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                        formData.patio === 'si' ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                                />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-300">
                                            <label className="text-sm font-medium text-gray-700">
                                                ¿Está amoblado?
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ 
                                                    ...prev, 
                                                    amoblado: prev.amoblado === 'si' ? 'no' : 'si' 
                                                }))}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                                    formData.amoblado === 'si' ? 'bg-blue-600' : 'bg-gray-300'
                                                }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                        formData.amoblado === 'si' ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                                />
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-300">
                                            <label className="text-sm font-medium text-gray-700">
                                                ¿Tiene sótano?
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ 
                                                    ...prev, 
                                                    sotano: prev.sotano === 'si' ? 'no' : 'si' 
                                                }))}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                                    formData.sotano === 'si' ? 'bg-blue-600' : 'bg-gray-300'
                                                }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                        formData.sotano === 'si' ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Dirección y Zona */}
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="direccion"
                                    value={formData.direccion}
                                    onChange={handleInputChange}
                                    placeholder="Dirección"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                                <input
                                    type="text"
                                    name="zona"
                                    value={formData.zona}
                                    onChange={handleInputChange}
                                    placeholder="Zona"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            {/* Superficie y Precio */}
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="superficie"
                                    value={formData.superficie}
                                    onChange={handleInputChange}
                                    placeholder="Superficie (m²)"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                                <input
                                    type="text"
                                    name="precio"
                                    value={formData.precio}
                                    onChange={handleInputChange}
                                    placeholder="Precio (USD)"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            {/* Descripción */}
                            <textarea
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleInputChange}
                                placeholder="Descripción"
                                rows={5}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                            />

                            {/* Upload de Imágenes */}
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                                <input
                                    type="file"
                                    id="file-upload"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                <label htmlFor="file-upload" className="cursor-pointer">
                                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-lg font-semibold text-gray-700 mb-1">
                                        Cargar fotos y videos
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Arrastra y suelta o haz clic para seleccionar
                                    </p>
                                </label>
                            </div>

                            {/* Imágenes Cargadas */}
                            {formData.images.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                                        Imágenes cargadas ({formData.images.length})
                                    </h3>
                                    <div className="grid grid-cols-4 gap-3">
                                        {formData.images.map((img, idx) => (
                                            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 group">
                                                <Image
                                                    src={img}
                                                    alt={`Preview ${idx + 1}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(idx)}
                                                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                    title="Eliminar imagen"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                                <div className="absolute bottom-1 left-1 bg-black/60 text-white px-2 py-0.5 rounded text-xs font-medium">
                                                    {idx + 1}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Botones */}
                            <div className="grid  gap-4 pt-4">
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                                >
                                    Publicar ahora
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Vista Previa */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-24 h-fit">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Eye className="w-6 h-6 text-blue-600" />
                            Vista Previa
                        </h2>

                        <div className="space-y-6">
                            {/* Imagen Principal con Carousel */}
                            <div className="w-full h-64 bg-gray-100 rounded-xl overflow-hidden relative group">
                                {formData.images.length > 0 ? (
                                    <>
                                        <Image
                                            src={formData.images[currentImageIndex]}
                                            alt={`Preview ${currentImageIndex + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                        
                                        {/* Botones de navegación */}
                                        {formData.images.length > 1 && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={prevImage}
                                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                >
                                                    <ArrowLeft className="w-5 h-5 text-gray-800" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={nextImage}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                >
                                                    <ArrowRight className="w-5 h-5 text-gray-800" />
                                                </button>
                                                
                                                {/* Indicadores de puntos */}
                                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                                    {formData.images.map((_, idx) => (
                                                        <button
                                                            key={idx}
                                                            type="button"
                                                            onClick={() => goToImage(idx)}
                                                            className={`w-2 h-2 rounded-full transition-all ${
                                                                idx === currentImageIndex 
                                                                    ? 'bg-white w-6' 
                                                                    : 'bg-white/60 hover:bg-white/80'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                                
                                                {/* Contador de imágenes */}
                                                <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                    {currentImageIndex + 1} / {formData.images.length}
                                                </div>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <Upload className="w-16 h-16 text-gray-300" />
                                    </div>
                                )}
                            </div>

                            {/* Información */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                                        {formData.propertyType.charAt(0).toUpperCase() + formData.propertyType.slice(1)}
                                    </span>
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                                        {formData.operacion.charAt(0).toUpperCase() + formData.operacion.slice(1)}
                                    </span>
                                </div>

                                <div>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {formData.precio ? `$${formData.precio}` : '$0'}
                                        <span className="text-lg text-gray-500 font-normal"> USD</span>
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-gray-700 font-medium">
                                        {formData.direccion || 'Dirección no especificada'}
                                    </p>
                                    <p className="text-gray-600">
                                        {formData.zona || 'Zona no especificada'}
                                    </p>
                                    {formData.superficie && (
                                        <p className="text-gray-600">
                                            Superficie: <span className="font-semibold">{formData.superficie} m²</span>
                                        </p>
                                    )}
                                </div>

                                {/* Características de Casa, HACER LO MISMO PARA CADA TIPO DE INMUEBLE */}
                                {formData.propertyType === 'casa' && (
                                    <div className="grid grid-cols-2 gap-3 pt-2">
                                        {formData.dormitorios && (
                                            <div className="text-sm">
                                                <span className="text-gray-600">Dormitorios:</span>
                                                <span className="font-semibold text-gray-900 ml-1">{formData.dormitorios}</span>
                                            </div>
                                        )}
                                        {formData.banos && (
                                            <div className="text-sm">
                                                <span className="text-gray-600">Baños:</span>
                                                <span className="font-semibold text-gray-900 ml-1">{formData.banos}</span>
                                            </div>
                                        )}
                                        <div className="text-sm">
                                            <span className="text-gray-600">Garaje:</span>
                                            <span className="font-semibold text-gray-900 ml-1">{formData.garaje === 'si' ? 'Sí' : 'No'}</span>
                                        </div>
                                        <div className="text-sm">
                                            <span className="text-gray-600">Patio:</span>
                                            <span className="font-semibold text-gray-900 ml-1">{formData.patio === 'si' ? 'Sí' : 'No'}</span>
                                        </div>
                                        <div className="text-sm">
                                            <span className="text-gray-600">Amoblado:</span>
                                            <span className="font-semibold text-gray-900 ml-1">{formData.amoblado === 'si' ? 'Sí' : 'No'}</span>
                                        </div>
                                        <div className="text-sm">
                                            <span className="text-gray-600">Sótano:</span>
                                            <span className="font-semibold text-gray-900 ml-1">{formData.sotano === 'si' ? 'Sí' : 'No'}</span>
                                        </div>
                                    </div>
                                )}

                                <div className="pt-4 border-t border-gray-200">
                                    <h3 className="font-semibold text-gray-900 mb-2">Descripción</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {formData.descripcion || 'Sin descripción aún...'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}