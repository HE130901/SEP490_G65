/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Accept all hostnames
      },
    ],
  },
};

module.exports = nextConfig;
