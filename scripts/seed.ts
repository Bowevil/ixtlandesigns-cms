import payload from 'payload';
import 'dotenv/config';

const SEED_DATA = {
  users: [
    {
      email: 'admin@ixtlandesigns.com',
      password: 'changeme123',
      name: 'Admin User',
    },
  ],
  blogPosts: [
    {
      title: 'Welcome to Ixtlan Designs CMS',
      slug: 'welcome-to-ixtlan-designs-cms',
      description: 'Getting started with our new content management system',
      date: new Date('2024-02-12'),
      content: [
        {
          type: 'paragraph',
          children: [
            {
              text: 'Welcome to Ixtlan Designs! This is your first blog post created through Payload CMS. You can easily create, edit, and publish content using our intuitive admin interface.',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              text: 'This is a great place to share your thoughts, insights, and updates with your audience.',
            },
          ],
        },
      ],
      tags: [{ tag: 'cms' }, { tag: 'welcome' }],
      published: true,
    },
  ],
  caseStudies: [
    {
      title: 'Example Case Study: Modern Web Design',
      slug: 'example-case-study-modern-web-design',
      description: 'A showcase of our web design capabilities',
      client: 'Example Client Inc.',
      date: new Date('2024-02-01'),
      challenge: [
        {
          type: 'paragraph',
          children: [
            {
              text: 'The client needed a modern, responsive website that could handle high traffic and provide an excellent user experience.',
            },
          ],
        },
      ],
      solution: [
        {
          type: 'paragraph',
          children: [
            {
              text: 'We designed and built a custom website using modern web technologies, focusing on performance, accessibility, and user experience.',
            },
          ],
        },
      ],
      results: [
        {
          type: 'paragraph',
          children: [
            {
              text: 'The new website increased traffic by 300%, improved conversion rates by 45%, and received a 98/100 Lighthouse performance score.',
            },
          ],
        },
      ],
      technologies: [
        { tech: 'Next.js' },
        { tech: 'React' },
        { tech: 'TypeScript' },
        { tech: 'Tailwind CSS' },
      ],
      published: true,
    },
  ],
  resources: [
    {
      title: 'Web Design Best Practices Guide',
      slug: 'web-design-best-practices-guide',
      description: 'Essential tips for creating beautiful and functional websites',
      category: 'guide',
      date: new Date('2024-02-05'),
      content: [
        {
          type: 'paragraph',
          children: [
            {
              text: 'Creating a great website requires attention to design, functionality, and user experience. Here are our top practices:',
            },
          ],
        },
        {
          type: 'list',
          children: [
            {
              type: 'list-item',
              children: [
                {
                  text: 'Keep design clean and minimal',
                },
              ],
            },
            {
              type: 'list-item',
              children: [
                {
                  text: 'Prioritize user experience',
                },
              ],
            },
            {
              type: 'list-item',
              children: [
                {
                  text: 'Test on multiple devices',
                },
              ],
            },
            {
              type: 'list-item',
              children: [
                {
                  text: 'Optimize for performance',
                },
              ],
            },
          ],
        },
      ],
      tags: [{ tag: 'design' }, { tag: 'web' }, { tag: 'tips' }],
      published: true,
    },
  ],
};

async function seed() {
  console.log('\n🌱 Starting database seed...\n');

  try {
    // Initialize Payload
    await payload.init({
      secret: process.env.PAYLOAD_SECRET || 'test-secret',
      mongoURL: process.env.DATABASE_URI || 'mongodb://localhost/ixtlan-cms',
    });

    // Seed blog posts
    console.log('📝 Seeding blog posts...');
    for (const post of SEED_DATA.blogPosts) {
      try {
        const existing = await payload.find({
          collection: 'blog-posts',
          where: {
            slug: {
              equals: post.slug,
            },
          },
        });

        if (existing.docs.length === 0) {
          await payload.create({
            collection: 'blog-posts',
            data: post,
          });
          console.log(`  ✓ Created: ${post.title}`);
        } else {
          console.log(`  ⊘ Already exists: ${post.title}`);
        }
      } catch (error) {
        console.error(`  ✗ Error creating blog post:`, error);
      }
    }

    // Seed case studies
    console.log('\n📊 Seeding case studies...');
    for (const study of SEED_DATA.caseStudies) {
      try {
        const existing = await payload.find({
          collection: 'case-studies',
          where: {
            slug: {
              equals: study.slug,
            },
          },
        });

        if (existing.docs.length === 0) {
          await payload.create({
            collection: 'case-studies',
            data: study,
          });
          console.log(`  ✓ Created: ${study.title}`);
        } else {
          console.log(`  ⊘ Already exists: ${study.title}`);
        }
      } catch (error) {
        console.error(`  ✗ Error creating case study:`, error);
      }
    }

    // Seed resources
    console.log('\n📚 Seeding resources...');
    for (const resource of SEED_DATA.resources) {
      try {
        const existing = await payload.find({
          collection: 'resources',
          where: {
            slug: {
              equals: resource.slug,
            },
          },
        });

        if (existing.docs.length === 0) {
          await payload.create({
            collection: 'resources',
            data: resource,
          });
          console.log(`  ✓ Created: ${resource.title}`);
        } else {
          console.log(`  ⊘ Already exists: ${resource.title}`);
        }
      } catch (error) {
        console.error(`  ✗ Error creating resource:`, error);
      }
    }

    console.log('\n✅ Seeding complete!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

seed();
