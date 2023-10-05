/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns:[{
      protocol: 'https',
      hostname:'slack-edge.com',
    }, {
      protocol: 'https',
      hostname:'lh3.googleusercontent.com',
    }],
  },
  typescript: {
      ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
