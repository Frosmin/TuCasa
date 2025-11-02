import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Añade esta sección:
  experimental: {
    turbopack: {
      // Esto le dice a Turbopack que la raíz del proyecto es este directorio
      // y evita que busque en carpetas superiores.
      root: process.cwd(),
    },
  },

  eslint: {
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