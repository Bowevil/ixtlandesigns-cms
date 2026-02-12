import { buildConfig } from 'payload/config';
import path from 'path';
import BlogPosts from './src/collections/BlogPosts';
import CaseStudies from './src/collections/CaseStudies';
import Resources from './src/collections/Resources';
import Media from './src/collections/Media';
import Users from './src/collections/Users';

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- Ixtlan Designs CMS',
    },
  },
  collections: [Users, BlogPosts, CaseStudies, Resources, Media],
  serverURL: process.env.SERVER_URL || 'http://localhost:3000',
  db: {
    adapter: 'mongoose',
    url: process.env.DATABASE_URI || 'mongodb://localhost/ixtlan-cms',
  },
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
});
