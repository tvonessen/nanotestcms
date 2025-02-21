import { withPayload } from '@payloadcms/next/withPayload';

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withPayload({
  ...nextConfig,
  images: {
    remotePatterns: [
      {
        hostname: 'localhost',
        port: '3301',
      },
      {
        hostname: 'localhost',
        port: '3303',
      },
      {
        hostname: 'api.dicebear.com',
      },
      {
        hostname: 'nanotest.jutoserver.de',
      },
      {
        hostname: 'nanotest-dev.jutoserver.de',
      },
    ],
  },
  // redirects: async () => [
  //   {
  //     source: '/tima',
  //     destination: '/solutions/tima',
  //     permanent: false,
  //   },
  // ],
});
