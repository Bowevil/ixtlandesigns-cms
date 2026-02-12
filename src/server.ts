import express from 'express';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server is ready to receive Payload requests`);
  console.log(`✓ Access Payload Admin at: http://localhost:${PORT}/admin`);
  console.log(`✓ Database: ${process.env.DATABASE_URI || 'mongodb://localhost/ixtlan-cms'}`);
});
