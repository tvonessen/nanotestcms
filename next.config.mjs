import { withPayload } from '@payloadcms/next/withPayload';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
};

export default withPayload({
  ...nextConfig,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 7,
    remotePatterns: [
      {
        hostname: 'localhost',
      },
      {
        hostname: 'api.dicebear.com',
      },
      {
        hostname: 'nanotest.eu',
      },
      {
        hostname: 'www.nanotest.eu',
      },
      {
        hostname: 'nanotest.jutoserver.de',
      },
    ],
    qualities: [65, 70, 75, 85, 100],
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== 'production',
  },
});
