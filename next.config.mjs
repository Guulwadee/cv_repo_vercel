/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ['*']
    },
    typedRoutes: true,
    optimizePackageImports: [
      'lucide-react'
    ]
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ]
  },
  webpack: (config) => {
    config.externals = config.externals || [];
    return config;
  },
  // Sentry (optional)
  sentry: {
    hideSourceMaps: true
  }
};

export default nextConfig;
