/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.b-e.az',
      },
      {
        protocol: 'https',
        hostname: 'img.b-e.az',
      },
    ],
  },
};

export default nextConfig;