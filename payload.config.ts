import { buildConfig } from 'payload';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import path from 'path';
import { fileURLToPath } from 'url';
import BlogPosts from './src/collections/BlogPosts.ts';
import CaseStudies from './src/collections/CaseStudies.ts';
import Resources from './src/collections/Resources.ts';
import Media from './src/collections/Media.ts';
import Users from './src/collections/Users.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || 'default-secret-change-in-production',
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- Ixtlan Designs CMS',
    },
  },
  collections: [Users, BlogPosts, CaseStudies, Resources, Media],
  serverURL: process.env.SERVER_URL || 'http://localhost:3000',
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || 'mongodb://localhost/ixtlan-cms',
  }),
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
});
