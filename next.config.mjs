/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurações para resolver problemas de HMR e fetch
  experimental: {
    // Desabilita o turbopack temporariamente para resolver problemas de HMR
    turbo: false,
  },
  
  // Configurações de desenvolvimento
  devIndicators: {
    buildActivity: false,
  },
  
  // Configurações de rede para resolver problemas de fetch
  async rewrites() {
    return []
  },
  
  // Headers para resolver problemas de CORS e fetch
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  
  // Configurações de imagens
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Configurações para resolver problemas de build
  typescript: {
    ignoreBuildErrors: false,
  },
  
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // Configurações de webpack para resolver problemas de HMR
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Configurações específicas para desenvolvimento
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    
    return config
  },
}

export default nextConfig