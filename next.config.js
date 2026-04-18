// @ts-check
const path = require('path')

const SECURITY_HEADERS = [
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=(), compute-pressure=(self "https://www.youtube.com" "https://www.youtube-nocookie.com")',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https://github.com https://avatars.githubusercontent.com https://img.youtube.com https://i.ytimg.com",
      "frame-src 'self' https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com",
      "connect-src 'self' https://api.anthropic.com https://api.github.com",
      "media-src 'self'",
      "worker-src 'self' blob:",
      "frame-ancestors 'none'",
    ].join('; '),
  },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  output: process.env.STATIC_EXPORT === 'true' && process.env.VERCEL !== '1' ? 'export' : undefined,

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },

  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei', 'framer-motion'],

  typescript: {
    ignoreBuildErrors: false,
  },

  experimental: {
    optimizeCss: true,
  },

  turbopack: {
    root: __dirname,
    resolveAlias: {
      '@': __dirname,
      '@/components': path.resolve(__dirname, 'components'),
      '@/lib': path.resolve(__dirname, 'lib'),
      '@/data': path.resolve(__dirname, 'data'),
    },
  },

  async headers() {
    const isProduction = process.env.NODE_ENV === 'production'
    const securityHeaders = SECURITY_HEADERS

    const headers = [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store',
          },
        ],
      },
    ]

    if (isProduction) {
      headers.push({
        source: '/(.*)\\.(png|jpg|svg|woff2|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      })
    }

    return headers
  },

  webpack(config, { isServer }) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
      '@/components': path.resolve(__dirname, 'components'),
      '@/lib': path.resolve(__dirname, 'lib'),
      '@/data': path.resolve(__dirname, 'data'),
    }

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      }
    }

    return config
  },
}

module.exports = nextConfig
