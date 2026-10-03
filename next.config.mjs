// URL do backend Spring Boot. Em dev usa localhost; em producao/HML defina
// BACKEND_URL (ex.: https://api.seudominio.com) nas variaveis de ambiente.
const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080'

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // Encaminha /api e /uploads para o backend Spring Boot.
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
      {
        // Arquivos enviados (uploads) servidos pelo backend.
        source: '/uploads/:path*',
        destination: `${backendUrl}/uploads/:path*`,
      },
    ]
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
}

export default nextConfig
