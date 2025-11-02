import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración de Turbopack en el nivel superior
  turbopack: {
    // Esto le dice a Turbopack que la raíz del proyecto es este directorio
    // y evita que busque en carpetas superiores.
    root: process.cwd(),
  },

  eslint: {
    // Mantenemos esto para ignorar los errores de linting en el build
    ignoreDuringBuilds: true,
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;