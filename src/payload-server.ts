import express from 'express';
import payload from 'payload';
import config from '../payload.config.ts';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Initialize Payload
const start = async () => {
  try {
    // Log environment
    console.log('Loading Payload with secret:', process.env.PAYLOAD_SECRET ? 'SET' : 'NOT SET');

    // Initialize Payload with config
    await payload.init({
      config: config,
      express: app,
      onInit: async () => {
        console.log('');
        console.log('╔════════════════════════════════════════════════════════╗');
        console.log('║     Payload CMS - Ixtlan Designs Admin Dashboard       ║');
        console.log('╚════════════════════════════════════════════════════════╝');
        console.log('');
        console.log('✓ Payload CMS Initialized');
        console.log(`✓ Server running on port ${PORT}`);
        console.log(`✓ Admin Dashboard: http://localhost:${PORT}/admin`);
        console.log('');
        console.log('Available Collections:');
        console.log('  📝 Blog Posts      (title, content, date, tags, image)');
        console.log('  📊 Case Studies    (client, challenge, solution, results)');
        console.log('  📚 Resources       (guides, articles, tutorials, tools)');
        console.log('  🖼️  Media           (image uploads with auto-optimization)');
        console.log('');
        console.log('API Endpoints:');
        console.log(`  GET  http://localhost:${PORT}/api/blog-posts`);
        console.log(`  GET  http://localhost:${PORT}/api/case-studies`);
        console.log(`  GET  http://localhost:${PORT}/api/resources`);
        console.log(`  GET  http://localhost:${PORT}/api/media`);
        console.log('');
        console.log('Hugo Integration:');
        console.log(`  PAYLOAD_API_URL=http://localhost:${PORT}/api npm run dev`);
        console.log('');
      },
    });

    // Start Express server
    app.listen(PORT);
  } catch (error) {
    console.error('Failed to start Payload CMS:', error);
    process.exit(1);
  }
};

start();
