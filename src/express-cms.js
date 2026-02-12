import express from 'express';
import { MongoClient } from 'mongodb';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;
const DATABASE_URI = process.env.DATABASE_URI || 'mongodb://localhost/ixtlan-cms';

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
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
    const posts = await db.collection('blog-posts').find({ published: true }).toArray();
    res.json({
      docs: posts.map(p => ({ ...p, id: p._id.toString() })),
      totalDocs: posts.length,
      totalPages: 1,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/blog-posts', async (req, res) => {
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
    const studies = await db.collection('case-studies').find({ published: true }).toArray();
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
    const resources = await db.collection('resources').find({ published: true }).toArray();
    res.json({
      docs: resources.map(r => ({ ...r, id: r._id.toString() })),
      totalDocs: resources.length,
      totalPages: 1,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Simple Admin UI
app.get('/admin', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Ixtlan Designs CMS</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          padding: 40px;
          max-width: 600px;
          width: 90%;
        }
        h1 {
          color: #333;
          margin-bottom: 10px;
          font-size: 28px;
        }
        .status {
          color: #666;
          margin-bottom: 30px;
          font-size: 14px;
        }
        .status.connected {
          color: #22c55e;
          font-weight: bold;
        }
        .features {
          list-style: none;
          margin: 30px 0;
        }
        .features li {
          padding: 12px 0;
          border-bottom: 1px solid #eee;
          color: #555;
          display: flex;
          align-items: center;
        }
        .features li:before {
          content: "✓";
          display: inline-block;
          width: 24px;
          height: 24px;
          background: #22c55e;
          color: white;
          border-radius: 50%;
          text-align: center;
          line-height: 24px;
          margin-right: 12px;
          font-size: 12px;
          flex-shrink: 0;
        }
        .note {
          background: #f0f9ff;
          border-left: 4px solid #0ea5e9;
          padding: 15px;
          border-radius: 4px;
          margin: 20px 0;
          color: #0c4a6e;
          font-size: 14px;
        }
        .endpoints {
          background: #1e293b;
          color: #e2e8f0;
          padding: 15px;
          border-radius: 6px;
          font-family: 'Courier New', monospace;
          font-size: 12px;
          margin: 20px 0;
          overflow-x: auto;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 Ixtlan Designs CMS</h1>
        <div class="status connected">✓ Connected to MongoDB Atlas</div>

        <h2 style="font-size: 18px; margin-top: 30px; margin-bottom: 15px; color: #333;">API Endpoints</h2>
        <div class="endpoints">
GET /api/blog-posts<br/>
GET /api/case-studies<br/>
GET /api/resources<br/>
POST /api/blog-posts
        </div>

        <h2 style="font-size: 18px; margin-top: 30px; margin-bottom: 15px; color: #333;">Features</h2>
        <ul class="features">
          <li>MongoDB Atlas Connection</li>
          <li>Blog Posts Management</li>
          <li>Case Studies Collection</li>
          <li>Resources Library</li>
          <li>Hugo Integration Ready</li>
        </ul>

        <div class="note">
          <strong>📝 Note:</strong> Full admin UI coming soon! For now, use the API endpoints to manage content. The blog posts are fetched by Hugo for your static site.
        </div>

        <div class="note" style="background: #fef3c7; border-left-color: #f59e0b; color: #92400e;">
          <strong>🔧 Quick Start:</strong> Content you create via POST requests will be available at http://localhost:39335/ixtlandesigns/blog/
        </div>
      </div>
    </body>
    </html>
  `);
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
