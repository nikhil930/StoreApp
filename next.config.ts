import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
  // ... other config options
}

export default nextConfig
