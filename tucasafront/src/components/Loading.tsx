import React from 'react'

interface LoadingProps {
    /**
     * Mensaje a mostrar durante la carga
     * @default "Cargando..."
     */
    message?: string

    /**
     * Tamaño del spinner
     * @default "md"
     */
    size?: 'sm' | 'md' | 'lg'

    /**
     * Si es true, ocupa toda la pantalla
     * @default true
     */
    fullScreen?: boolean

    /**
     * Mostrar solo el spinner sin mensaje
     * @default false
     */
    minimal?: boolean
}

const sizeClasses = {
    sm: 'w-8 h-8 border-3',
    md: 'w-12 h-12 border-4',
    lg: 'w-16 h-16 border-4',
}

const LoadingSpinner = ({
    message = 'Cargando...',
    size = 'md',
    fullScreen = true,
    minimal = false,
}: LoadingProps) => {
    const spinnerClasses = `${sizeClasses[size]}  rounded-full animate-spin`

    if (fullScreen) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 flex justify-center">
                        <div className={spinnerClasses}></div>
                    </div>
                    {!minimal && (
                        <p className="text-gray-600 font-medium text-lg">{message}</p>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center gap-3 p-6">
            <div className={spinnerClasses}></div>
            {!minimal && (
                <p className="text-gray-600 font-medium">{message}</p>
            )}
        </div>
    )
}

export default LoadingSpinner