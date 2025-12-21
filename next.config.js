/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'images.pexels.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  // Increase static page generation timeout
  staticPageGenerationTimeout: 120,
  // Disable static optimization for better dynamic content
  experimental: {
    // This ensures pages are rendered dynamically
  },
}

module.exports = nextConfig






