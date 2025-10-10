'use client';

import { useState } from 'react';
import { Upload, Eye, Home, Building2, Store, DoorClosed } from 'lucide-react';
import Image from 'next/image';

type PropertyType = 'casa' | 'departamento' | 'lote' | 'tienda' | 'cuarto';

export default function VenderPage() {
    const [formData, setFormData] = useState({
        propertyType: 'departamento' as PropertyType,
        direccion: '',
        zona: '',
        superficie: '',
        precio: '',
        operacion: '',
        descripcion: '',
        images: [] as string[],
    });

    const propertyTypes = [
        { id: 'casa', label: 'Casa', icon: Home },
        { id: 'departamento', label: 'Departamento', icon: Building2 },
        { id: 'lote', label: 'Lote', icon: Home },
        { id: 'tienda', label: 'Tienda', icon: Store },
        { id: 'cuarto', label: 'Cuarto', icon: DoorClosed },
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePropertyTypeChange = (type: PropertyType) => {
        setFormData(prev => ({ ...prev, propertyType: type }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newImages = Array.from(files).map(file => URL.createObjectURL(file));
            setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form data:', formData);
        alert('Propiedad publicada (simulación)');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Formulario */}
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            ¿Qué tipo de propiedad quieres publicar?
                        </h1>
                        <p className="text-gray-600 mb-8">Selecciona una opción para empezar.</p>

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

                            {/* Tipo de Operación */}
                            <select
                                name="operacion"
                                value={formData.operacion}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            >
                                <option value="">Tipo de operación</option>
                                <option value="venta">Venta</option>
                                <option value="alquiler">Alquiler</option>
                                <option value="anticrético">Anticrético</option>
                            </select>

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
                                <div className="grid grid-cols-4 gap-3">
                                    {formData.images.map((img, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                                            <Image
                                                src={img}
                                                alt={`Preview ${idx + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Botones */}
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <button
                                    type="button"
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition-colors"
                                >
                                    <Eye className="w-5 h-5" />
                                    Vista previa
                                </button>
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
                            {/* Imagen Principal */}
                            <div className="w-full h-64 bg-gray-100 rounded-xl overflow-hidden relative">
                                {formData.images.length > 0 ? (
                                    <Image
                                        src={formData.images[0]}
                                        alt="Preview principal"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <Upload className="w-16 h-16 text-gray-300" />
                                    </div>
                                )}
                            </div>

                            {/* Información */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                                        {formData.propertyType.charAt(0).toUpperCase() + formData.propertyType.slice(1)}
                                    </span>
                                    {formData.operacion && (
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                                            {formData.operacion.charAt(0).toUpperCase() + formData.operacion.slice(1)}
                                        </span>
                                    )}
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

                                <div className="pt-4 border-t border-gray-200">
                                    <h3 className="font-semibold text-gray-900 mb-2">Descripción</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {formData.descripcion || 'Sin descripción aún...'}
                                    </p>
                                </div>

                                {formData.images.length > 1 && (
                                    <div className="pt-4">
                                        <h3 className="font-semibold text-gray-900 mb-3">Galería</h3>
                                        <div className="grid grid-cols-4 gap-2">
                                            {formData.images.slice(1, 5).map((img, idx) => (
                                                <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-gray-200 relative">
                                                    <Image
                                                        src={img}
                                                        alt={`Gallery ${idx + 2}`}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
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