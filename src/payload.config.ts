import path from 'node:path';
import { fileURLToPath } from 'node:url';
// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { HTMLConverterFeature, LinkFeature, lexicalEditor } from '@payloadcms/richtext-lexical';
import { buildConfig } from 'payload';
import sharp from 'sharp';

import { Media } from './collections/Media';
import Solutions from './collections/Solutions';
import TeamMembers from './collections/TeamMembers';
import { Users } from './collections/Users';
import { AboutContent } from './globals/AboutContent';
import { HomepageContent } from './globals/HomepageContent';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Solutions, TeamMembers],
  csrf: ['http://localhost:3301'],
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
  plugins: [],
  globals: [HomepageContent, AboutContent],
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
});
