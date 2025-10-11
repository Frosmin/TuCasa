'use client';

import { useState } from 'react';
import { Upload, Eye, Home, Building2, Store, DoorClosed, ArrowRight, ArrowLeft, X } from 'lucide-react';
import Image from 'next/image';

type PropertyType = 'CASA' | 'DEPARTAMENTO' | 'LOTE' | 'TIENDA';
type OperationType = 'VENTA' | 'ALQUILER' | 'ANTICRETICO';

export default function VenderPage() {
    const [step, setStep] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        // Datos del inmueble
        operacion: '' as OperationType | '',
        propertyType: 'CASA' as PropertyType,
        direccion: '',
        latitud: '',
        longitud: '',
        superficie: '',
        precio: '',
        moneda: 'Bs',
        tipoPago: 'mensual',
        duracion: '',
        descripcion: '',
        descripcionOferta: '',
        idPropietario: 1, // Por ahora hardcodeado
        serviciosIds: [] as number[],
        
        // Campos específicos para Casa
        dormitorios: '',
        banos: '',
        numPisos: '',
        garaje: false,
        patio: false,
        amoblado: false,
        sotano: false,
        
        images: [] as string[],
    });

    const propertyTypes = [
        { id: 'CASA', label: 'Casa', icon: Home },
        { id: 'DEPARTAMENTO', label: 'Departamento', icon: Building2 },
        { id: 'LOTE', label: 'Lote', icon: Home },
        { id: 'TIENDA', label: 'Tienda', icon: Store },
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
        if (currentImageIndex >= indexToRemove && currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Construir el payload según el formato requerido
            const inmuebleData: any = {
                direccion: formData.direccion,
                latitud: parseFloat(formData.latitud),
                longitud: parseFloat(formData.longitud),
                superficie: parseFloat(formData.superficie),
                idPropietario: formData.idPropietario,
                descripcion: formData.descripcion,
                tipo: formData.propertyType,
                serviciosIds: formData.serviciosIds,
            };

            // Agregar campos específicos de CASA solo si el tipo es CASA
            if (formData.propertyType === 'CASA') {
                inmuebleData.numDormitorios = parseInt(formData.dormitorios) || 0;
                inmuebleData.numBanos = parseInt(formData.banos) || 0;
                inmuebleData.numPisos = parseInt(formData.numPisos) || 0;
                inmuebleData.garaje = formData.garaje;
                inmuebleData.patio = formData.patio;
                inmuebleData.amoblado = formData.amoblado;
                inmuebleData.sotano = formData.sotano;
            }

            const payload = {
                inmueble: inmuebleData,
                descripcion: formData.descripcionOferta,
                tipo: formData.operacion,
                precio: parseFloat(formData.precio),
                moneda: formData.moneda,
                // duracion solo para ANTICRETICO, los demás son null
                duracion: formData.operacion === 'ANTICRETICO' && formData.duracion ? parseInt(formData.duracion) : null,
                // tipoPago es null para VENTA, para ALQUILER y ANTICRETICO se usa el valor del formulario
                tipoPago: formData.operacion === 'VENTA' ? 'unico' : formData.tipoPago,
            };

            console.log('Payload a enviar:', JSON.stringify(payload, null, 2));

            const response = await fetch('http://localhost:8000/tucasabackend/api/oferta', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Error del servidor:', errorData);
                console.error('Payload que causó el error:', payload);
                
                // Mostrar el mensaje de error específico si está disponible
                if (errorData.errors && errorData.errors.length > 0) {
                    const errorMessages = errorData.errors.map((err: any) => 
                        `${err.field}: ${err.defaultMessage}`
                    ).join('\n');
                    alert(`Errores de validación:\n${errorMessages}`);
                } else if (errorData.message) {
                    alert(`Error: ${errorData.message}`);
                }
                
                throw new Error(`Error al crear la oferta: ${response.status}`);
            }

            const data = await response.json();
            console.log('Respuesta del servidor:', data);
            alert('¡Propiedad publicada exitosamente!');
            
            // Resetear formulario
            setStep(1);
            setFormData({
                operacion: '',
                propertyType: 'CASA',
                direccion: '',
                latitud: '',
                longitud: '',
                superficie: '',
                precio: '',
                moneda: 'Bs',
                tipoPago: 'mensual',
                duracion: '',
                descripcion: '',
                descripcionOferta: '',
                idPropietario: 1,
                serviciosIds: [],
                dormitorios: '',
                banos: '',
                numPisos: '',
                garaje: false,
                patio: false,
                amoblado: false,
                sotano: false,
                images: [],
            });
        } catch (error) {
            console.error('Error:', error);
            alert('Error al publicar la propiedad. Por favor, intenta de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
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
                                onClick={() => handleOperationSelect('VENTA')}
                                className="group p-8 border-2 border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 text-center"
                            >
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500 transition-colors">
                                    <Home className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Venta</h3>
                                <p className="text-sm text-gray-600">Vende tu propiedad</p>
                            </button>

                            <button
                                onClick={() => handleOperationSelect('ALQUILER')}
                                className="group p-8 border-2 border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-300 text-center"
                            >
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500 transition-colors">
                                    <Building2 className="w-8 h-8 text-green-600 group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Alquiler</h3>
                                <p className="text-sm text-gray-600">Alquila tu propiedad</p>
                            </button>

                            <button
                                onClick={() => handleOperationSelect('ANTICRETICO')}
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
                                {formData.operacion}
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

                            {/* Campos específicos para Casa */}
                            {formData.propertyType === 'CASA' && (
                                <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <h3 className="font-semibold text-gray-900 mb-3">Detalles de la casa</h3>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Número de dormitorios *
                                            </label>
                                            <input
                                                type="number"
                                                name="dormitorios"
                                                value={formData.dormitorios}
                                                onChange={handleInputChange}
                                                placeholder="Ej: 3"
                                                required
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Número de baños *
                                            </label>
                                            <input
                                                type="number"
                                                name="banos"
                                                value={formData.banos}
                                                onChange={handleInputChange}
                                                placeholder="Ej: 2"
                                                required
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Número de pisos *
                                        </label>
                                        <input
                                            type="number"
                                            name="numPisos"
                                            value={formData.numPisos}
                                            onChange={handleInputChange}
                                            placeholder="Ej: 2"
                                            required
                                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        />
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
                                                    garaje: !prev.garaje
                                                }))}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                                    formData.garaje ? 'bg-blue-600' : 'bg-gray-300'
                                                }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                        formData.garaje ? 'translate-x-6' : 'translate-x-1'
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
                                                    patio: !prev.patio
                                                }))}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                                    formData.patio ? 'bg-blue-600' : 'bg-gray-300'
                                                }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                        formData.patio ? 'translate-x-6' : 'translate-x-1'
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
                                                    amoblado: !prev.amoblado
                                                }))}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                                    formData.amoblado ? 'bg-blue-600' : 'bg-gray-300'
                                                }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                        formData.amoblado ? 'translate-x-6' : 'translate-x-1'
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
                                                    sotano: !prev.sotano
                                                }))}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                                    formData.sotano ? 'bg-blue-600' : 'bg-gray-300'
                                                }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                        formData.sotano ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Dirección y Coordenadas */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Dirección *
                                </label>
                                <input
                                    type="text"
                                    name="direccion"
                                    value={formData.direccion}
                                    onChange={handleInputChange}
                                    placeholder="Av. Siempre Viva 123"
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>

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
                                        onChange={handleInputChange}
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
                                        onChange={handleInputChange}
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
                                        onChange={handleInputChange}
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
                                        onChange={handleInputChange}
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
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    >
                                        <option value="Bs">Bolivianos (Bs)</option>
                                        <option value="$">Dólares ($)</option>
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
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        >
                                            <option value="mensual">Mensual</option>
                                            <option value="anual">Anual</option>
                                            <option value="unico">Único</option>
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
                                        onChange={handleInputChange}
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
                                    onChange={handleInputChange}
                                    placeholder="Hermosa casa con jardín y garaje"
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
                                    onChange={handleInputChange}
                                    placeholder="Oferta de venta en zona céntrica"
                                    rows={3}
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                                />
                            </div>

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
                                        Cargar fotos
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Arrastra y suelta o haz clic para seleccionar
                                    </p>
                                    <p className="text-xs text-gray-400 mt-2">
                                        (Las imágenes no se enviarán por ahora)
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
                                        {formData.propertyType}
                                    </span>
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                                        {formData.operacion}
                                    </span>
                                </div>

                                <div>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {formData.precio ? `${formData.moneda} ${formData.precio}` : `${formData.moneda} 0`}
                                        {formData.operacion !== 'VENTA' && formData.tipoPago === 'mensual' && <span className="text-lg text-gray-500 font-normal"> /mes</span>}
                                        {formData.operacion !== 'VENTA' && formData.tipoPago === 'anual' && <span className="text-lg text-gray-500 font-normal"> /año</span>}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-gray-700 font-medium">
                                        {formData.direccion || 'Dirección no especificada'}
                                    </p>
                                    {(formData.latitud || formData.longitud) && (
                                        <p className="text-gray-600 text-sm">
                                            Coordenadas: {formData.latitud || '0'}, {formData.longitud || '0'}
                                        </p>
                                    )}
                                    {formData.superficie && (
                                        <p className="text-gray-600">
                                            Superficie: <span className="font-semibold">{formData.superficie} m²</span>
                                        </p>
                                    )}
                                </div>

                                {/* Características de Casa */}
                                {formData.propertyType === 'CASA' && (
                                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
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
                                        {formData.numPisos && (
                                            <div className="text-sm">
                                                <span className="text-gray-600">Pisos:</span>
                                                <span className="font-semibold text-gray-900 ml-1">{formData.numPisos}</span>
                                            </div>
                                        )}
                                        <div className="text-sm">
                                            <span className="text-gray-600">Garaje:</span>
                                            <span className="font-semibold text-gray-900 ml-1">{formData.garaje ? 'Sí' : 'No'}</span>
                                        </div>
                                        <div className="text-sm">
                                            <span className="text-gray-600">Patio:</span>
                                            <span className="font-semibold text-gray-900 ml-1">{formData.patio ? 'Sí' : 'No'}</span>
                                        </div>
                                        <div className="text-sm">
                                            <span className="text-gray-600">Amoblado:</span>
                                            <span className="font-semibold text-gray-900 ml-1">{formData.amoblado ? 'Sí' : 'No'}</span>
                                        </div>
                                        <div className="text-sm">
                                            <span className="text-gray-600">Sótano:</span>
                                            <span className="font-semibold text-gray-900 ml-1">{formData.sotano ? 'Sí' : 'No'}</span>
                                        </div>
                                    </div>
                                )}

                                <div className="pt-4 border-t border-gray-200">
                                    <h3 className="font-semibold text-gray-900 mb-2">Descripción del Inmueble</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {formData.descripcion || 'Sin descripción aún...'}
                                    </p>
                                </div>

                                {formData.descripcionOferta && (
                                    <div className="pt-4 border-t border-gray-200">
                                        <h3 className="font-semibold text-gray-900 mb-2">Descripción de la Oferta</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {formData.descripcionOferta}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}