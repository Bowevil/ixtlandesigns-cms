import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DATABASE_URI = process.env.DATABASE_URI || 'mongodb://localhost/ixtlan-cms';

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Authentication middleware for write operations
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  const expectedToken = process.env.PAYLOAD_SECRET;

  if (!token || token !== expectedToken) {
    return res.status(401).json({ error: 'Authentication required. Provide Authorization: Bearer token' });
  }
  next();
};

// Serve Admin Dashboard (MUST be before static middleware)
app.get('/admin', (req, res) => {
  res.sendFile(join(__dirname, '..', 'public', 'admin-dashboard.html'));
});

// Serve static files (for mobile.html)
app.use(express.static('public'));

// MongoDB Connection
let db;
const client = new MongoClient(DATABASE_URI);

async function connectDB() {
  try {
    await client.connect();
    db = client.db('ixtlan-cms');
    console.log('✓ Connected to MongoDB Atlas');
    return true;
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message);
    return false;
  }
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CMS Server Running' });
});

// Blog Posts endpoints
app.get('/api/blog-posts', async (req, res) => {
  try {
    const filter = req.query.admin === 'true' ? {} : { published: true };
    const posts = await db.collection('blog-posts').find(filter).toArray();
    res.json({
      docs: posts.map(p => ({ ...p, id: p._id.toString() })),
      totalDocs: posts.length,
      totalPages: 1,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/blog-posts', requireAuth, async (req, res) => {
  try {
    const result = await db.collection('blog-posts').insertOne({
      ...req.body,
      createdAt: new Date(),
    });
    res.json({ id: result.insertedId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Case Studies endpoints
app.get('/api/case-studies', async (req, res) => {
  try {
    const filter = req.query.admin === 'true' ? {} : { published: true };
    const studies = await db.collection('case-studies').find(filter).toArray();
    res.json({
      docs: studies.map(s => ({ ...s, id: s._id.toString() })),
      totalDocs: studies.length,
      totalPages: 1,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Resources endpoints
app.get('/api/resources', async (req, res) => {
  try {
    const filter = req.query.admin === 'true' ? {} : { published: true };
    const resources = await db.collection('resources').find(filter).toArray();
    res.json({
      docs: resources.map(r => ({ ...r, id: r._id.toString() })),
      totalDocs: resources.length,
      totalPages: 1,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve Admin Dashboard
// Update blog post
app.put('/api/blog-posts/:id', requireAuth, async (req, res) => {
  try {
    const result = await db.collection('blog-posts').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete blog post
app.delete('/api/blog-posts/:id', requireAuth, async (req, res) => {
  try {
    const result = await db.collection('blog-posts').deleteOne(
      { _id: new ObjectId(req.params.id) }
    );
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single blog post
app.get('/api/blog-posts/:id', async (req, res) => {
  try {
    const post = await db.collection('blog-posts').findOne(
      { _id: new ObjectId(req.params.id) }
    );
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Case Studies endpoints
app.put('/api/case-studies/:id', requireAuth, async (req, res) => {
  try {
    const result = await db.collection('case-studies').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/case-studies/:id', requireAuth, async (req, res) => {
  try {
    const result = await db.collection('case-studies').deleteOne(
      { _id: new ObjectId(req.params.id) }
    );
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/case-studies/:id', async (req, res) => {
  try {
    const study = await db.collection('case-studies').findOne(
      { _id: new ObjectId(req.params.id) }
    );
    res.json(study);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/case-studies', requireAuth, async (req, res) => {
  try {
    const result = await db.collection('case-studies').insertOne({
      ...req.body,
      createdAt: new Date(),
    });
    res.json({ id: result.insertedId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Resources endpoints
app.put('/api/resources/:id', requireAuth, async (req, res) => {
  try {
    const result = await db.collection('resources').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/resources/:id', requireAuth, async (req, res) => {
  try {
    const result = await db.collection('resources').deleteOne(
      { _id: new ObjectId(req.params.id) }
    );
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/resources/:id', async (req, res) => {
  try {
    const resource = await db.collection('resources').findOne(
      { _id: new ObjectId(req.params.id) }
    );
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/resources', requireAuth, async (req, res) => {
  try {
    const result = await db.collection('resources').insertOne({
      ...req.body,
      createdAt: new Date(),
    });
    res.json({ id: result.insertedId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Media endpoints
app.get('/api/media', async (req, res) => {
  try {
    const media = await db.collection('media').find({}).toArray();
    res.json({
      docs: media.map(m => ({ ...m, id: m._id.toString() })),
      totalDocs: media.length,
      totalPages: 1,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/media', requireAuth, async (req, res) => {
  try {
    const result = await db.collection('media').insertOne({
      ...req.body,
      createdAt: new Date(),
    });
    res.json({ id: result.insertedId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/media/:id', requireAuth, async (req, res) => {
  try {
    const result = await db.collection('media').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/media/:id', requireAuth, async (req, res) => {
  try {
    const result = await db.collection('media').deleteOne(
      { _id: new ObjectId(req.params.id) }
    );
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/media/:id', async (req, res) => {
  try {
    const media = await db.collection('media').findOne(
      { _id: new ObjectId(req.params.id) }
    );
    res.json(media);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const start = async () => {
  const connected = await connectDB();

  if (!connected) {
    console.error('Failed to connect to MongoDB. Check your DATABASE_URI.');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log('');
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║      Ixtlan Designs CMS - MongoDB Atlas Connected      ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    console.log('');
    console.log(`✓ Server running on port ${PORT}`);
    console.log(`✓ Admin Dashboard: http://localhost:${PORT}/admin`);
    console.log('');
    console.log('Available API Endpoints:');
    console.log(`  GET  http://localhost:${PORT}/api/health`);
    console.log(`  GET  http://localhost:${PORT}/api/blog-posts`);
    console.log(`  GET  http://localhost:${PORT}/api/case-studies`);
    console.log(`  GET  http://localhost:${PORT}/api/resources`);
    console.log(`  POST http://localhost:${PORT}/api/blog-posts`);
    console.log('');
    console.log('Hugo Integration:');
    console.log(`  PAYLOAD_API_URL=http://localhost:${PORT}/api npm run dev`);
    console.log('');
  });
};

start();
