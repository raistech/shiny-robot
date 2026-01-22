/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['a.storyblok.com'],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    appDir: true,
  },
  async redirects() {
    return [
      {
        source: '/posts/:slug',
        destination: '/blog/:slug',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig