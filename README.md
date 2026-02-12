# Ixtlan Designs CMS

Payload CMS backend for managing blog posts, case studies, and resources for the Ixtlan Designs Hugo website.

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   - Copy `.env.example` to `.env`
   - Update `DATABASE_URI` if using MongoDB Atlas

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Access Payload Admin:**
   - Open http://localhost:3000/admin
   - Create your first admin user when prompted
   - Log in and start creating content

### MongoDB Setup

**Option 1: Local MongoDB (Development)**
```bash
# Install MongoDB locally (macOS with Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Should connect with: mongodb://localhost/ixtlan-cms
```

**Option 2: MongoDB Atlas (Cloud - Recommended for Production)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account and cluster (M0 tier)
3. Create database user
4. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/ixtlan-cms`
5. Update `.env` with connection string

## Collections

### Blog Posts
- **URL:** `/api/blog-posts`
- **Fields:** title, slug, date, description, content, tags, image, published
- **For:** Blog articles and news

### Case Studies
- **URL:** `/api/case-studies`
- **Fields:** title, slug, client, challenge, solution, results, technologies, image, published
- **For:** Client project showcases

### Resources
- **URL:** `/api/resources`
- **Fields:** title, slug, category (guide/article/tutorial), description, content, tags, image, published
- **For:** Guides, tutorials, tools

### Media
- **URL:** `/api/media`
- **Features:** Image uploads with auto-resizing
- **Formats:** WebP with fallbacks

## API Endpoints

All endpoints require authentication for write operations.

```
GET  /api/blog-posts?where[published][equals]=true
GET  /api/case-studies?where[published][equals]=true
GET  /api/resources?where[published][equals]=true
GET  /api/media
```

## Hugo Integration

The Hugo site fetches published content via `scripts/fetch-payload-content.js`:

1. Polls Payload API for published content
2. Converts rich text to Markdown
3. Generates frontmatter with metadata
4. Creates `.md` files in Hugo content directories

```bash
# From Hugo site directory
npm run fetch-content  # Fetch latest from Payload
npm run dev            # Start Hugo with fetched content
npm run build          # Build static site
```

## Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login and deploy:**
   ```bash
   vercel login
   vercel
   ```

3. **Add environment variables in Vercel Dashboard:**
   - `DATABASE_URI`: MongoDB Atlas connection string
   - `PAYLOAD_SECRET`: Random 32+ character string
   - `GITHUB_TOKEN`: GitHub personal access token (for webhooks)

4. **Get your production URL:**
   ```
   https://ixtlandesigns-cms.vercel.app
   ```

### Update GitHub Actions Secrets

In your GitHub repo settings, add:
- `PAYLOAD_API_URL`: Your Vercel URL (e.g., https://ixtlandesigns-cms.vercel.app/api)

This enables automatic site rebuilds when content is published in Payload.

## Webhooks

When you publish content in Payload, it automatically triggers a GitHub Actions rebuild:

1. User publishes in Payload admin
2. Payload sends webhook to GitHub
3. GitHub Actions fetches new content
4. Hugo rebuilds with new content
5. Site updates automatically

## User Management

### Create Admin User

```bash
npm run payload -- users:create
```

Enter email and secure password when prompted.

### Access Control

- **Authenticated users:** Can read/write all content
- **Public API:** Can only read published content
- **Media uploads:** Authenticated users only

## Troubleshooting

### "Cannot connect to MongoDB"
- Check `DATABASE_URI` in `.env`
- Ensure MongoDB is running (local) or connection string is correct (Atlas)
- For Atlas, check IP whitelist includes your IP

### "Port 3000 already in use"
```bash
PORT=3001 npm run dev
```

### Hugo not fetching content
- Check `PAYLOAD_API_URL` environment variable
- Ensure Payload is running: `npm run dev`
- Check content is published (not just drafted)

## Development

```bash
# Start with hot reload
npm run dev

# Build TypeScript
npm run build

# Run production
npm run start

# TypeScript types
npm run build  # Generates payload-types.ts
```

## Project Structure

```
src/
├── collections/        # Content types
│   ├── BlogPosts.ts
│   ├── CaseStudies.ts
│   ├── Resources.ts
│   ├── Media.ts
│   └── Users.ts
├── server.ts          # Express/Payload setup
└── payload.config.ts  # Main configuration
```

## Next Steps

- [ ] Set up MongoDB Atlas cluster
- [ ] Deploy to Vercel
- [ ] Configure GitHub webhook secrets
- [ ] Create first admin user
- [ ] Test content creation and Hugo fetch
- [ ] Update DNS for custom CMS domain (optional)

## Support

For Payload CMS documentation: https://payloadcms.com/docs
