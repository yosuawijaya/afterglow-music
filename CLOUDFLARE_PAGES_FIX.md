# 🔧 Fix Cloudflare Pages Deployment Error

## Problem
Cloudflare Pages is trying to run `npx wrangler deploy` which is for Workers, not for static site deployment. This causes a Vite version conflict.

## Solution

### Option 1: Fix in Cloudflare Dashboard (Recommended)

1. Go to your Cloudflare Pages project: https://dash.cloudflare.com
2. Select your project: `afterglow-music`
3. Go to **Settings** → **Builds & deployments**
4. Click **Edit configuration** or **Configure Production deployments**
5. Update the settings:

```
Framework preset: Vite
Build command: npm run build
Build output directory: dist
Root directory: (leave empty or /)
```

6. Make sure there's NO custom deploy command
7. Click **Save**
8. Go to **Deployments** tab
9. Click **Retry deployment** on the latest failed deployment

### Option 2: Add Build Configuration File

Create a `_headers` file in the `public` folder to ensure proper routing:

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin

/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

And create a `_redirects` file in the `public` folder for SPA routing:

```
/*    /index.html   200
```

### Option 3: Separate Repositories (If issues persist)

If Cloudflare keeps detecting the worker, consider:

1. **Frontend repo**: Just the React app (root level files)
2. **Backend repo**: Just the `workers/` folder

This ensures clean separation and no confusion.

## Environment Variables

Make sure these are set in Cloudflare Pages:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://afterglow-music-api.afterglowmusic.workers.dev/api` |
| `VITE_UPLOADCARE_PUBLIC_KEY` | `ffbcea34c5af37feb491` |

## Verify Deployment

After fixing:
1. Push a small change to trigger rebuild
2. Check build logs - should only see `npm run build`, NOT `wrangler deploy`
3. Visit your Pages URL to test

## Why This Happened

Cloudflare Pages auto-detected your project and saw the `workers/` folder with `wrangler.toml`, so it thought you wanted to deploy a Worker. But you actually want:
- **Cloudflare Pages**: For the React frontend (static files)
- **Cloudflare Workers**: For the API (already deployed separately)

They're two different services that work together!
