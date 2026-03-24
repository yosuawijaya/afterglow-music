# Cloudflare D1 + Workers Setup Guide

## Prerequisites
- Node.js installed
- Cloudflare account (free tier works!)
- Wrangler CLI installed globally

## Step 1: Install Wrangler CLI
```bash
npm install -g wrangler
```

## Step 2: Login to Cloudflare
```bash
wrangler login
```

## Step 3: Create D1 Database
```bash
cd workers
npm install
npm run db:create
```

Ini akan membuat database dan memberikan `database_id`. Copy ID tersebut.

## Step 4: Update wrangler.toml
Buka file `wrangler.toml` dan ganti `your-database-id-here` dengan database ID yang kamu dapat dari step 3.

```toml
[[d1_databases]]
binding = "DB"
database_name = "afterglow-music-db"
database_id = "paste-your-database-id-here"  # <-- Ganti ini
```

## Step 5: Initialize Database Schema
```bash
npm run db:init
```

Ini akan membuat tables dan insert data default.

## Step 6: Test Locally
```bash
npm run dev
```

Worker akan jalan di `http://localhost:8787`

Test endpoints:
- GET http://localhost:8787/api/slides
- GET http://localhost:8787/api/releases
- GET http://localhost:8787/api/artists
- GET http://localhost:8787/api/settings

## Step 7: Deploy to Cloudflare
```bash
npm run deploy
```

Setelah deploy, kamu akan dapat URL seperti:
`https://afterglow-music-api.your-subdomain.workers.dev`

## Step 8: Update Frontend Environment
Buka file `.env` di root project dan update:

```env
VITE_API_URL=https://afterglow-music-api.your-subdomain.workers.dev/api
```

## Step 9: Build & Deploy Frontend
```bash
npm run build
```

Deploy hasil build ke:
- Cloudflare Pages (recommended)
- Vercel
- Netlify
- Atau hosting lainnya

## API Endpoints

### Hero Slides
- `GET /api/slides` - Get all slides
- `POST /api/slides` - Create new slide
- `PUT /api/slides/:id` - Update slide
- `DELETE /api/slides/:id` - Delete slide

### Releases
- `GET /api/releases` - Get all releases
- `POST /api/releases` - Create new release
- `PUT /api/releases/:id` - Update release
- `DELETE /api/releases/:id` - Delete release

### Artists
- `GET /api/artists` - Get all artists
- `POST /api/artists` - Create new artist
- `PUT /api/artists/:id` - Update artist
- `DELETE /api/artists/:id` - Delete artist

### Settings
- `GET /api/settings` - Get all settings
- `PUT /api/settings` - Update settings

## Database Management

### Query database directly:
```bash
npm run db:query "SELECT * FROM hero_slides"
```

### View all tables:
```bash
npm run db:query "SELECT name FROM sqlite_master WHERE type='table'"
```

## Troubleshooting

### Error: Database not found
Make sure you've updated the `database_id` in `wrangler.toml`

### CORS errors
The API already includes CORS headers. Make sure you're using the correct API URL.

### Can't connect to API
Check if the worker is deployed:
```bash
wrangler deployments list
```

## Free Tier Limits
- D1: 5GB storage, 5 million reads/day
- Workers: 100,000 requests/day
- More than enough for a music label website!

## Next Steps
1. Integrate API calls in frontend components
2. Add authentication for admin dashboard
3. Add image upload to Cloudflare R2
4. Set up custom domain
