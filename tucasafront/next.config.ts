import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Opción simple:
    // domains: ['res.cloudinary.com'],

    // Opción recomendada con patrones:
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
