import { withPayload } from '@payloadcms/next/withPayload';

const serverUrlHostname = (() => {
  try {
    return process.env.NEXT_PUBLIC_SERVER_URL
      ? new URL(process.env.NEXT_PUBLIC_SERVER_URL).hostname
      : null;
  } catch {
    return null;
  }
})();

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
      ...(serverUrlHostname ? [{ hostname: serverUrlHostname }] : []),
    ],
    qualities: [65, 70, 75, 85, 100],
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== 'production',
  },
});
