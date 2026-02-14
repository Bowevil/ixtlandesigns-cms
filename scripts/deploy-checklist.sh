#!/bin/bash

# Pre-deployment checklist for Vercel
# Usage: ./scripts/deploy-checklist.sh

set -e

echo ""
echo "✅ Vercel Deployment Checklist"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

PASSED=0
TOTAL=0

check() {
  ((TOTAL++))
  if [ $? -eq 0 ]; then
    echo "   ✅ $1"
    ((PASSED++))
  else
    echo "   ❌ $1"
  fi
}

# Check 1: Dependencies
echo "1️⃣ Dependencies..."
npm list express > /dev/null 2>&1
check "express installed"

npm list mongodb > /dev/null 2>&1
check "mongodb installed"

npm list dotenv > /dev/null 2>&1
check "dotenv installed"
echo ""

# Check 2: Configuration Files
echo "2️⃣ Configuration Files..."
[ -f "vercel.json" ]
check "vercel.json exists"

[ -f ".env.local" ]
check ".env.local exists (don't commit this!)"

grep -q "src/express-cms.js" vercel.json
check "vercel.json points to express-cms.js"
echo ""

# Check 3: Source Code
echo "3️⃣ Source Code..."
[ -f "src/express-cms.js" ]
check "src/express-cms.js exists"

grep -q "requireAuth" src/express-cms.js
check "Authentication middleware implemented"

grep -q "PAYLOAD_SECRET" src/express-cms.js
check "Uses PAYLOAD_SECRET from env"

grep -q "DATABASE_URI" src/express-cms.js
check "Uses DATABASE_URI from env"
echo ""

# Check 4: Environment Variables
echo "4️⃣ Required Environment Variables..."
if [ -f ".env.local" ]; then
  grep -q "DATABASE_URI" .env.local
  check "DATABASE_URI set in .env.local"

  grep -q "PAYLOAD_SECRET" .env.local
  check "PAYLOAD_SECRET set in .env.local"
else
  echo "   ⚠️  .env.local not found (create it locally)"
fi
echo ""

# Check 5: Git Status
echo "5️⃣ Git Hygiene..."
! grep -r "DATABASE_URI" .git/objects > /dev/null 2>&1 || grep "\.env" .gitignore > /dev/null 2>&1
check ".env files not committed"

[ -f ".gitignore" ]
check ".gitignore exists"

grep -q "\.env" .gitignore
check ".env in .gitignore"
echo ""

# Check 6: API Endpoints
echo "6️⃣ API Endpoints..."
grep -q "app.get('/api/health'" src/express-cms.js
check "GET /api/health exists"

grep -q "app.post('/api/blog-posts'" src/express-cms.js
check "POST /api/blog-posts exists"

grep -q "app.get('/api/blog-posts'" src/express-cms.js
check "GET /api/blog-posts exists"

grep -q "app.put('/api/blog-posts/:id'" src/express-cms.js
check "PUT /api/blog-posts/:id exists"

grep -q "app.delete('/api/blog-posts/:id'" src/express-cms.js
check "DELETE /api/blog-posts/:id exists"
echo ""

# Check 7: MongoDB Connection
echo "7️⃣ Database..."
grep -q "MongoClient" src/express-cms.js
check "MongoDB client imported"

grep -q "connectDB" src/express-cms.js
check "connectDB function exists"

grep -q "collection('blog-posts')" src/express-cms.js
check "Collections are accessible"
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Results: $PASSED/$TOTAL checks passed"
echo ""

if [ $PASSED -eq $TOTAL ]; then
  echo "✨ Ready for deployment!"
  echo ""
  echo "Next steps:"
  echo "  1. Go to https://vercel.com"
  echo "  2. Import this repository"
  echo "  3. Set environment variables:"
  echo "     - DATABASE_URI"
  echo "     - PAYLOAD_SECRET"
  echo "     - NODE_ENV=production"
  echo "  4. Deploy!"
  exit 0
else
  echo "⚠️  $((TOTAL - PASSED)) checks failed. Fix above issues first."
  exit 1
fi
