/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@forge/ui'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'cdn.instagram.com' },
      { protocol: 'https', hostname: '*.cdninstagram.com' },
    ],
  },
}

export default nextConfig
