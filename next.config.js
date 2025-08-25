/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for Vercel deployment
  output: 'standalone',
  
  // Handle build warnings
  eslint: {
    // Ignore ESLint errors during build (for deployment)
    ignoreDuringBuilds: true,
  },
  
  // TypeScript config
  typescript: {
    // Ignore TypeScript errors during build (for deployment)
    ignoreBuildErrors: false,
  },
  
  // Image optimization
  images: {
    domains: [],
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Experimental features for better performance
  experimental: {
    // Enable modern bundling
    serverComponentsExternalPackages: [],
  },
}

module.exports = nextConfig