import path from 'node:path';
import { fileURLToPath } from 'node:url';
// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { nodemailerAdapter } from '@payloadcms/email-nodemailer';
import { HTMLConverterFeature, LinkFeature, lexicalEditor } from '@payloadcms/richtext-lexical';
import nodemailer from 'nodemailer';
import { buildConfig } from 'payload';
import sharp from 'sharp';
import { SolutionCategories } from '@/collections/SolutionCategories';
import { locales } from '@/config/locales';
import revalidateHandler from '@/utils/revalidate';
import { DistroPartners } from './collections/DistroPartners';
import { Documents } from './collections/Documents';
import { Media } from './collections/Media';
import Solutions from './collections/Solutions';
import { TeamMembers } from './collections/TeamMembers';
import { Users } from './collections/Users';
import { nodemailerOptions } from './config/nodemailer';
import { AboutContent } from './globals/AboutContent';
import { ContactUsContent } from './globals/ContactUsContent';
import { HomepageContent } from './globals/HomepageContent';
import { LegalContent } from './globals/LegalContent';
import { sendEmailEndpoint } from './utils/send-email';
import validateCaptcha from './utils/validate-captcha';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Documents,
    Solutions,
    SolutionCategories,
    TeamMembers,
    DistroPartners,
  ],
  cors: ['https://www.google.com'],
  csrf: ['http://localhost:3301', 'http://localhost:3303', 'https://nanotest.jutoserver.de'],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      LinkFeature({
        enabledCollections: ['solutions', 'distro-partner', 'team-member'],
        maxDepth: 5,
      }),
      // The HTMLConverter Feature is the feature which manages the HTML serializers.
      // If you do not pass any arguments to it, it will use the default serializers.
      HTMLConverterFeature({}),
    ],
  }),
  email: nodemailerAdapter({
    defaultFromAddress: 'do-not-reply@nanotest.eu',
    defaultFromName: 'Nanotest Contact Form',
    transport: nodemailer.createTransport(nodemailerOptions),
  }),
  endpoints: [
    {
      path: '/send-email',
      method: 'post',
      handler: sendEmailEndpoint,
    },
    {
      path: '/dont-bother-me',
      method: 'post',
      handler: validateCaptcha,
    },
    {
      path: '/revalidate',
      method: 'post',
      handler: revalidateHandler,
    },
  ],
  localization: {
    locales,
    defaultLocale: 'en',
    fallback: true,
  },
  plugins: [],
  globals: [HomepageContent, AboutContent, LegalContent, ContactUsContent],
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI ?? false,
  }),
  sharp,
});
