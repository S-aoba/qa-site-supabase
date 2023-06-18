/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['oemouiykifbcqdiqxbwq.supabase.co'],
  },
}

module.exports = nextConfig
