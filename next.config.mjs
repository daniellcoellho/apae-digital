/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // Encaminha /api para o backend Spring Boot em dev.
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
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
