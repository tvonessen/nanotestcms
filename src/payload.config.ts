import path from 'node:path';
import { fileURLToPath } from 'node:url';
// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { HTMLConverterFeature, LinkFeature, lexicalEditor } from '@payloadcms/richtext-lexical';
import { buildConfig } from 'payload';
import sharp from 'sharp';

import { Media } from './collections/Media';
import Solutions from './collections/Solutions';
import { Users } from './collections/Users';
import { AboutContent } from './globals/AboutContent';
import { HomepageContent } from './globals/HomepageContent';
import { LegalContent } from './globals/LegalContent';
import { SolutionCategories } from '@/collections/SolutionCategories';
import { nodemailerAdapter } from '@payloadcms/email-nodemailer';
import nodemailer from 'nodemailer';
import { nodemailerOptions } from './config/nodemailer';
import { sendEmailEndpoint } from './utils/send-email';
import validateCaptcha from './utils/validate-captcha';
import revalidateHandler from '@/utils/revalidate';
import { TeamMembers } from './collections/TeamMembers';
import { DistroPartners } from './collections/DistroPartners';
import { ContactUsContent } from './globals/ContactUsContent';
import { Documents } from './collections/Documents';

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
        enabledCollections: ['solutions'],
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
    locales: [{code: 'en', label: "English"}, {code: 'de', label: "Deutsch"}],
    defaultLocale: 'en',
    fallback: true
  },
  plugins: [],
  globals: [HomepageContent, AboutContent, LegalContent, ContactUsContent],
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL:
    process.env.NODE_ENV === 'development'
      ? process.env.NEXT_DEV_SERVER_URL
      : process.env.NEXT_PUBLIC_SERVER_URL,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url:
      (process.env.NODE_ENV === 'development'
        ? process.env.DATABASE_URI_DEV
        : process.env.DATABASE_URI_PROD) ?? false,
  }),
  sharp,
});
