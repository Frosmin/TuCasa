import React from 'react'

interface LoadingProps {
    /**
     * Mensaje a mostrar debajo del logo (opcional)
     * @default "Cargando..."
     */
    message?: string

    /**
     * Tamaño del loader (escala)
     * @default "md"
     */
    size?: 'sm' | 'md' | 'lg'

    /**
     * Si es true, ocupa toda la pantalla
     * @default true
     */
    fullScreen?: boolean

    /**
     * Si es true, oculta el mensaje de texto adicional (el logo siempre muestra tucasa.com)
     * @default false
     */
    minimal?: boolean
}

const scaleMap = {
    sm: 0.7,
    md: 1.1, // Escala base similar a tu ejemplo (1.3 era un poco grande para componentes inline)
    lg: 1.5,
}

const LoadingSpinner = ({
    message = 'Cargando...',
    size = 'md',
    fullScreen = true,
    minimal = false,
}: LoadingProps) => {
    
    // Estilos CSS encapsulados para este componente
    const loaderStyles = `
      .tucasa-loader-final-v3 {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        /* La escala se maneja via inline style react */
      }

      .bouncer {
        animation: bounce-pin 1.6s infinite ease-in-out;
        z-index: 2;
        position: relative;
      }

      .pin-shape {
        width: 86px;
        height: 86px;
        background-color: #bdd646; /* var(--tc-green) */
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: inset -3px -3px 8px rgba(0,0,0,0.04);
      }

      .house-wrapper {
        transform: rotate(45deg);
        position: relative;
        width: 40px;
        height: 40px;
        margin-bottom: 10px;
        margin-right: 10px;
        left: 9px; 
        display: flex;
        justify-content: center;
        align-items: flex-end;
      }

      .house-roof {
        position: absolute;
        top: 2px;
        width: 28px;
        height: 28px;
        background-color: #ffffff; /* var(--tc-white) */
        transform: rotate(45deg);
        border-radius: 4px;
        z-index: 0;
      }

      .house-base {
        position: relative;
        width: 34px;
        height: 25px;
        background-color: #3a8dff; /* var(--tc-blue-house) */
        z-index: 1;
        border-radius: 2px 2px 0 0;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .house-window {
        width: 12px;
        height: 12px;
        background-color: #ffffff;
        border-radius: 3px;
        margin-top: 5px;
      }

      .brand-text {
        margin-top: 10px;
        color: #103e7a; /* var(--tc-blue-text) */
        font-weight: 900;
        font-size: 26px;
        line-height: 1;
        text-align: center;
        letter-spacing: -0.8px;
        font-family: 'Arial Black', sans-serif;
      }
      
      .brand-text .dot-com {
        display: inline-block;
        font-size: 20px;
        font-weight: 800;
      }

      .shadow {
        width: 50px;
        height: 6px;
        background: rgba(16, 62, 122, 0.2);
        border-radius: 50%;
        margin-top: 12px;
        z-index: 0;
        animation: shadow-scale 1.6s infinite ease-in-out;
        filter: blur(2px);
      }

      @keyframes bounce-pin {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
      }

      @keyframes shadow-scale {
        0%, 100% { transform: scale(1); opacity: 0.4; }
        50% { transform: scale(0.6); opacity: 0.15; }
      }
    `

    const LoaderContent = (
        <div className="flex flex-col items-center">
            <style>{loaderStyles}</style>
            
            {/* Contenedor del Logo Animado */}
            <div 
                className="tucasa-loader-final-v3" 
                style={{ transform: `scale(${scaleMap[size]})` }}
            >
                <div className="bouncer">
                    <div className="pin-shape">
                        <div className="house-wrapper">
                            <div className="house-roof"></div>
                            <div className="house-base">
                                <div className="house-window"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="brand-text">
                    tucasa<span className="dot-com">.com</span>
                </div>
                <div className="shadow"></div>
            </div>

            {/* Mensaje adicional opcional debajo del logo */}
            {!minimal && message && message !== 'Cargando...' && (
                <p className="text-gray-500 font-medium text-sm mt-8 animate-pulse">
                    {message}
                </p>
            )}
        </div>
    )

    if (fullScreen) {
        return (
            <div className="min-h-screen bg-white/90 backdrop-blur-sm flex items-center justify-center z-50 fixed inset-0">
                {LoaderContent}
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center p-8 w-full h-full min-h-[200px]">
            {LoaderContent}
        </div>
    )
}

export default LoadingSpinner