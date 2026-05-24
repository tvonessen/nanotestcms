import { withPayload } from '@payloadcms/next/withPayload';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
};

export default withPayload({
  ...nextConfig,
  images: {
    remotePatterns: [
      {
        hostname: process.env.HOSTNAME,
        port: process.env.PORT,
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
        hostname: 'nanotest-dev.jutoserver.de',
      },
    ],
    qualities: [70, 85, 100],
  },
});
