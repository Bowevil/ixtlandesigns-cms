# Ixtlan Designs CMS

Headless content management system for Ixtlan Designs website. MongoDB + Express.js API with admin dashboard.

**Admin Dashboard:** https://ixtlandesigns-cms.vercel.app/admin
**API Base URL:** https://ixtlandesigns-cms.vercel.app/api
**Database:** MongoDB Atlas (ixtlan-cms)

---

## 📋 Overview

This is a **headless CMS** that powers content for the Ixtlan Designs Hugo website. It provides:

- 📝 **Admin Dashboard** - User-friendly content editor
- 🔗 **REST API** - Programmatic access for Hugo sync
- 🔐 **Authentication** - Secure write operations
- 📦 **Collections** - Blog posts, case studies, resources, media
- 🗄️ **MongoDB** - Persistent data storage

### Architecture
```
┌─────────────────────┐
│  Admin Dashboard    │  (Web UI)
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  Express.js Server  │  (Node.js)
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  MongoDB Atlas      │  (Database)
└─────────────────────┘
           │
           ▼
    Hugo Static Site
    (Git sync)
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn
- MongoDB Atlas account
- (Optional) Vercel account for deployment

### Local Development

**1. Clone repository**
```bash
git clone https://github.com/bowevil/ixtlandesigns-cms.git
cd ixtlandesigns-cms
```

**2. Install dependencies**
```bash
npm install
```

**3. Create `.env.local` file**
```bash
# Copy environment template
cp .env.example .env.local
```

**4. Add credentials to `.env.local`**
```
DATABASE_URI=mongodb+srv://michael_db_new_admin:PASSWORD@clusterixtlandesigns.ayu1dhb.mongodb.net/ixtlan-cms
PAYLOAD_SECRET=8f3d9k2m0p7x5q1w9e4r6t2y8u0i3o5p
NODE_ENV=development
```

**5. Start server**
```bash
npm run dev
```

**6. Access services**
- **Admin Dashboard:** http://localhost:3000/admin
- **API:** http://localhost:3000/api/
- **Health Check:** http://localhost:3000/api/health

---

## 📁 Project Structure

```
ixtlandesigns-cms/
├── src/
│   └── express-cms.js          # Main Express server
├── public/
│   ├── admin-dashboard.html    # Admin UI
│   └── mobile.html             # Mobile interface
├── scripts/
│   ├── deploy-checklist.sh     # Pre-deployment verification
│   └── migrate-hugo-content.js # Data migration tool
├── .env.local                  # Local config (not committed)
├── vercel.json                 # Vercel deployment config
├── package.json                # Node.js dependencies
└── README.md
```

---

## 🔗 API Endpoints

### Health Check
```bash
GET /api/health
# Response: { status: "ok", message: "CMS Server Running" }
```

### Blog Posts

**Get all published posts (public read)**
```bash
GET /api/blog-posts
# Response: { docs: [...], totalDocs: N }
```

**Get all posts (admin view - includes drafts)**
```bash
GET /api/blog-posts?admin=true
```

**Get single post**
```bash
GET /api/blog-posts/:id
```

**Create post (requires auth)**
```bash
POST /api/blog-posts
Authorization: Bearer {PAYLOAD_SECRET}

{
  "title": "New Post",
  "slug": "new-post",
  "description": "Short description",
  "published": false,
  "content": [{
    "type": "paragraph",
    "children": [{ "text": "Post content" }]
  }],
  "tags": ["tag1", "tag2"],
  "category": "Technology"
}
```

**Update post (requires auth)**
```bash
PUT /api/blog-posts/:id
Authorization: Bearer {PAYLOAD_SECRET}

{ "published": true, "title": "Updated Title" }
```

**Delete post (requires auth)**
```bash
DELETE /api/blog-posts/:id
Authorization: Bearer {PAYLOAD_SECRET}
```

### Case Studies
```bash
GET    /api/case-studies           # Get all (published only)
GET    /api/case-studies/:id       # Get single
POST   /api/case-studies           # Create (auth required)
PUT    /api/case-studies/:id       # Update (auth required)
DELETE /api/case-studies/:id       # Delete (auth required)
```

### Resources
```bash
GET    /api/resources              # Get all (published only)
GET    /api/resources/:id          # Get single
POST   /api/resources              # Create (auth required)
PUT    /api/resources/:id          # Update (auth required)
DELETE /api/resources/:id          # Delete (auth required)
```

### Media
```bash
GET    /api/media                  # Get all
GET    /api/media/:id              # Get single
POST   /api/media                  # Upload (auth required)
PUT    /api/media/:id              # Update (auth required)
DELETE /api/media/:id              # Delete (auth required)
```

---

## 🔐 Authentication

### How It Works
All **write operations** (POST, PUT, DELETE) require authentication.

**Request:**
```bash
curl -X POST http://localhost:3000/api/blog-posts \
  -H "Authorization: Bearer {PAYLOAD_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{ "title": "New Post", ... }'
```

**Without auth → 401 Unauthorized**
```bash
curl -X POST http://localhost:3000/api/blog-posts \
  -H "Content-Type: application/json" \
  -d '{ "title": "New Post" }'

# Response: { error: "Authentication required. Provide Authorization: Bearer token" }
```

### Token
- Token = `PAYLOAD_SECRET` from environment
- Pass as: `Authorization: Bearer {token}`
- Set in `.env.local` locally, Vercel env vars in production

---

## 📊 Admin Dashboard

### Access
- **Local:** http://localhost:3000/admin
- **Production:** https://ixtlandesigns-cms.vercel.app/admin

### Features
- ✅ Create/edit/delete content
- ✅ Rich text editor
- ✅ Publish/draft status
- ✅ Tag management
- ✅ Bulk operations
- ✅ Content preview
- ✅ Revision history

### Collections
1. **Blog Posts** - Articles with tags, categories, dates
2. **Case Studies** - Client work documentation
3. **Resources** - Links, tools, references
4. **Media** - Images and files

---

## 🧪 Testing & Debugging

### Automated Scripts

**Pre-deployment checklist**
```bash
./scripts/deploy-checklist.sh
```
Verifies everything is ready for Vercel deployment.

**Test API endpoints**
```bash
cd ../ixtlandesigns
./scripts/test-cms-api.sh local
./scripts/test-cms-api.sh production
```

**Full end-to-end test**
```bash
cd ../ixtlandesigns
./scripts/test-end-to-end.sh
```

### Manual Testing

**Test with curl**
```bash
# Health check
curl http://localhost:3000/api/health

# Get posts
curl http://localhost:3000/api/blog-posts

# Create post (requires auth)
curl -X POST http://localhost:3000/api/blog-posts \
  -H "Authorization: Bearer 8f3d9k2m0p7x5q1w9e4r6t2y8u0i3o5p" \
  -H "Content-Type: application/json" \
  -d '{ "title": "Test", "slug": "test", "published": false }'
```

### Debugging

**Check MongoDB connection**
```bash
# In server logs:
✓ Connected to MongoDB Atlas
```

**Verify environment variables**
```bash
echo $DATABASE_URI
echo $PAYLOAD_SECRET
```

**Enable detailed logging**
```bash
DEBUG=* npm run dev
```

---

## 🚀 Deployment

### Vercel Deployment

**1. Pre-flight check**
```bash
./scripts/deploy-checklist.sh
```

**2. Connect GitHub (Manual - Web Dashboard)**
- Go to https://vercel.com
- Click "Add New..." → "Project"
- Select `bowevil/ixtlandesigns-cms`
- Framework: Node.js (auto-detected)

**3. Set Environment Variables**
In Vercel dashboard → Settings → Environment Variables:

```
DATABASE_URI = mongodb+srv://michael_db_new_admin:uSJU350VMcqshgee@clusterixtlandesigns.ayu1dhb.mongodb.net/ixtlan-cms
PAYLOAD_SECRET = 8f3d9k2m0p7x5q1w9e4r6t2y8u0i3o5p
NODE_ENV = production
```

**4. Deploy**
Click "Deploy" → Wait 2-3 minutes → Get production URL

**5. Update GitHub Secret**
```bash
gh secret set PAYLOAD_API_URL --repo bowevil/ixtlandesigns
# Input: https://ixtlandesigns-cms-xxx.vercel.app/api
```

### Vercel Configuration
**File:** `vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/express-cms.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/admin",
      "dest": "/src/express-cms.js"
    },
    {
      "src": "/api/(.*)",
      "dest": "/src/express-cms.js"
    }
  ]
}
```

---

## 📦 Database

### MongoDB Atlas Setup

**Cluster:** `clusterixtlandesigns`
**Database:** `ixtlan-cms`
**User:** `michael_db_new_admin`

**Connection String:**
```
mongodb+srv://michael_db_new_admin:PASSWORD@clusterixtlandesigns.ayu1dhb.mongodb.net/ixtlan-cms
```

### Collections

**blog-posts**
```javascript
{
  _id: ObjectId,
  title: String,
  slug: String,
  description: String,
  content: Array, // Rich text blocks
  published: Boolean,
  tags: Array,
  category: String,
  createdAt: Date,
  updatedAt: Date
}
```

**case-studies**
```javascript
{
  _id: ObjectId,
  title: String,
  slug: String,
  description: String,
  content: Array,
  published: Boolean,
  createdAt: Date
}
```

**resources**
```javascript
{
  _id: ObjectId,
  title: String,
  slug: String,
  description: String,
  url: String,
  published: Boolean,
  tags: Array,
  createdAt: Date
}
```

**media**
```javascript
{
  _id: ObjectId,
  filename: String,
  url: String,
  type: String, // "image", "document", etc
  size: Number,
  uploadedAt: Date
}
```

---

## 🔄 Integration with Hugo

### How Content Flows

1. **Create in CMS** - Edit in admin dashboard
2. **Mark Published** - Set `published: true`
3. **Sync Script** - Fetches from API
4. **Convert to Markdown** - CMS JSON → Hugo markdown
5. **Commit to Git** - Auto-commit changes
6. **Push to GitHub** - Triggers Actions
7. **Hugo Builds** - Generates static HTML
8. **Deploy** - Published to GitHub Pages

### Sync Script
**Location:** `../ixtlandesigns/scripts/fetch-payload-content.js`

```bash
# Run sync
PAYLOAD_API_URL=https://ixtlandesigns-cms.vercel.app/api npm run fetch-content

# Or via wrapper
../ixtlandesigns/scripts/sync-content.sh
```

---

## 🛠️ Development

### Local Development Workflow

```bash
# 1. Start CMS server
npm run dev

# 2. Open admin dashboard
open http://localhost:3000/admin

# 3. Create/edit content

# 4. Test API
curl http://localhost:3000/api/blog-posts

# 5. Sync to Hugo (in separate terminal)
cd ../ixtlandesigns
./scripts/sync-content.sh

# 6. View in Hugo
hugo server
# Open http://localhost:1313
```

### Code Structure

**Express Server (`src/express-cms.js`)**
- MongoDB connection setup
- Route handlers for API endpoints
- Authentication middleware
- Admin dashboard serving

**Admin Dashboard (`public/admin-dashboard.html`)**
- HTML/CSS/JavaScript UI
- Form validation
- Rich text editor
- API communication

---

## 🔒 Security

### Best Practices

✅ **Authentication**
- All write ops require Bearer token
- Token = PAYLOAD_SECRET

✅ **Secrets Management**
- `.env.local` in `.gitignore` (never committed)
- Use Vercel environment variables in production
- Rotate passwords regularly

✅ **Data Validation**
- Validate all inputs
- Sanitize HTML in rich text
- Check authorization on protected routes

✅ **HTTPS**
- Always use HTTPS in production
- Vercel provides automatic SSL

---

## 🔗 Related Projects

### Hugo Site Repository
Main website that consumes CMS content.

```bash
git clone https://github.com/bowevil/ixtlandesigns.git
```

**Scripts:** `../ixtlandesigns/scripts/`
- `test-cms-api.sh` - Test this CMS
- `sync-content.sh` - Fetch content from here
- `check-pipeline.sh` - Verify integration

---

## 🐛 Troubleshooting

### Server Won't Start

**Error: Cannot connect to MongoDB**
```bash
# Check DATABASE_URI is correct in .env.local
echo $DATABASE_URI

# Verify MongoDB Atlas cluster is running
# Check connection string matches your password
```

**Error: Port 3000 in use**
```bash
# Kill process using port
lsof -i :3000
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### API Returns 401

**Error: Authentication required**
```bash
# Verify you're sending Authorization header
curl -H "Authorization: Bearer YOUR_TOKEN" \
  -X POST http://localhost:3000/api/blog-posts

# Check PAYLOAD_SECRET matches in .env.local
echo $PAYLOAD_SECRET
```

### Content Not Syncing

**Hugo not getting updates from CMS**
```bash
# 1. Test CMS API
./scripts/test-cms-api.sh local

# 2. Run sync manually
../ixtlandesigns/scripts/sync-content.sh

# 3. Check Git commits
cd ../ixtlandesigns
git log --oneline | head -5
```

### MongoDB Connection Issues

**Verify connection string**
```bash
# Should be formatted correctly
mongodb+srv://username:password@cluster.mongodb.net/database
# ✅ Has username
# ✅ Has password
# ✅ Has cluster name
# ✅ Has database name
```

---

## 📝 Common Tasks

### Export All Content

Create a backup:
```bash
# Via MongoDB Atlas
# Settings → Backup → Download Backup
```

Or via API:
```bash
curl http://localhost:3000/api/blog-posts > backup.json
curl http://localhost:3000/api/case-studies >> backup.json
curl http://localhost:3000/api/resources >> backup.json
```

---

## 🤝 Contributing

### Bug Reports
Found an issue? Check GitHub Issues or create a new one.

### Feature Requests
- Rich text formatting improvements
- Media gallery
- User management
- Advanced search

---

## 📞 Support

### Quick Diagnostics
```bash
# Full system check
./scripts/deploy-checklist.sh

# API test
../ixtlandesigns/scripts/test-cms-api.sh local

# Integration test
../ixtlandesigns/scripts/test-end-to-end.sh
```

---

## 🔄 Environment Variables

### Local Development (`.env.local`)
```
DATABASE_URI=mongodb+srv://...
PAYLOAD_SECRET=your-secret-key
NODE_ENV=development
```

### Production (Vercel)
Set in Vercel Dashboard:
- `DATABASE_URI`
- `PAYLOAD_SECRET`
- `NODE_ENV=production`

---

## 📄 License

Copyright © 2026 Ixtlan Designs. All rights reserved.

---

**Built with ❤️ using Express.js + MongoDB**
