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
