import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Test data
const testBlogPost = {
  id: '1',
  title: 'Welcome to Ixtlan Designs',
  slug: 'welcome-to-ixtlan',
  date: '2024-02-12T00:00:00Z',
  description: 'Getting started with our CMS',
  content: [
    {
      type: 'paragraph',
      children: [
        {
          text: 'Welcome to Ixtlan Designs! This is a test blog post from our Payload CMS integration.',
        },
      ],
    },
  ],
  tags: [{ tag: 'welcome' }, { tag: 'cms' }],
  published: true,
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CMS Demo Server Running' });
});

// Blog Posts endpoint
app.get('/api/blog-posts', (req, res) => {
  // Return test data
  res.json({
    docs: [testBlogPost],
    totalDocs: 1,
    limit: 100,
    totalPages: 1,
    page: 1,
    pagingCounter: 1,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: null,
    nextPage: null,
  });
});

// Case Studies endpoint
app.get('/api/case-studies', (req, res) => {
  res.json({
    docs: [],
    totalDocs: 0,
    limit: 100,
    totalPages: 0,
    page: 1,
  });
});

// Resources endpoint
app.get('/api/resources', (req, res) => {
  res.json({
    docs: [],
    totalDocs: 0,
    limit: 100,
    totalPages: 0,
    page: 1,
  });
});

app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║        Ixtlan Designs CMS Demo Server Started           ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`✓ Listening on port ${PORT}`);
  console.log(`✓ Admin UI (coming soon): http://localhost:${PORT}/admin`);
  console.log('');
  console.log('Available API Endpoints:');
  console.log(`  GET http://localhost:${PORT}/api/health`);
  console.log(`  GET http://localhost:${PORT}/api/blog-posts`);
  console.log(`  GET http://localhost:${PORT}/api/case-studies`);
  console.log(`  GET http://localhost:${PORT}/api/resources`);
  console.log('');
  console.log('Hugo Site Integration:');
  console.log(`  PAYLOAD_API_URL=http://localhost:${PORT}/api npm run dev`);
  console.log('');
});
