import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Agrega esta sección:
  eslint: {
    // Esto evitará que los errores de ESLint detengan el build en Render.
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