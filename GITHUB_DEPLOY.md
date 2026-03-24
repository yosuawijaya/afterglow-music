# 🚀 Deploy ke GitHub & Cloudflare Pages

Panduan lengkap untuk deploy project ke GitHub dan auto-deploy ke Cloudflare Pages.

## Step 1: Persiapan

Pastikan file `.env` tidak akan ke-push ke GitHub (sudah ada di `.gitignore`):

```bash
# Cek apakah .env sudah di-ignore
git status
```

Jika `.env` muncul, tambahkan ke `.gitignore`:
```bash
echo ".env" >> .gitignore
```

## Step 2: Initialize Git & Push ke GitHub

### A. Initialize Git (jika belum)

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Afterglow Music website with submission form"
```

### B. Create GitHub Repository

1. Buka https://github.com/new
2. Repository name: `afterglow-music` (atau nama lain)
3. **JANGAN** centang "Initialize with README" (karena sudah ada local)
4. Klik **"Create repository"**

### C. Push ke GitHub

Copy command dari GitHub (akan muncul setelah create repo), atau jalankan:

```bash
# Ganti USERNAME dan REPO_NAME dengan milik Anda
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

**Contoh:**
```bash
git remote add origin https://github.com/afterglowmusic/afterglow-music.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy Frontend ke Cloudflare Pages

### A. Connect GitHub ke Cloudflare

1. Login ke Cloudflare Dashboard: https://dash.cloudflare.com
2. Pilih account Anda
3. Klik **"Workers & Pages"** di sidebar
4. Klik **"Create application"**
5. Tab **"Pages"** → **"Connect to Git"**

### B. Configure Build Settings

1. **Select repository:** Pilih repo `afterglow-music`
2. **Project name:** `afterglow-music` (atau nama lain)
3. **Production branch:** `main`
4. **Build settings:**
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`

### C. Environment Variables

Klik **"Add environment variable"** dan tambahkan:

| Variable Name | Value |
|--------------|-------|
| `VITE_API_URL` | `https://afterglow-music-api.afterglowmusic.workers.dev/api` |
| `VITE_UPLOADCARE_PUBLIC_KEY` | `ffbcea34c5af37feb491` |

### D. Deploy

1. Klik **"Save and Deploy"**
2. Tunggu build selesai (2-3 menit)
3. Setelah selesai, Anda akan dapat URL: `https://afterglow-music.pages.dev`

## Step 4: Deploy Worker (Backend) ke Cloudflare

### A. Deploy dari Local

```bash
cd workers

# Login ke Cloudflare (jika belum)
npx wrangler login

# Deploy worker
npm run deploy
```

### B. Verify Deployment

Worker akan deploy ke URL yang sudah Anda set di `wrangler.toml`:
```
https://afterglow-music-api.afterglowmusic.workers.dev
```

Test API:
```bash
curl https://afterglow-music-api.afterglowmusic.workers.dev/api/slides
```

## Step 5: Setup Custom Domain (Optional)

### A. Frontend (Cloudflare Pages)

1. Di Cloudflare Pages dashboard, pilih project Anda
2. Tab **"Custom domains"**
3. Klik **"Set up a custom domain"**
4. Masukkan domain: `afterglowmusic.com` atau `www.afterglowmusic.com`
5. Cloudflare akan auto-configure DNS

### B. Backend (Worker)

1. Di Cloudflare Workers dashboard, pilih worker Anda
2. Tab **"Triggers"**
3. **"Custom Domains"** → **"Add Custom Domain"**
4. Masukkan: `api.afterglowmusic.com`
5. Update `VITE_API_URL` di Cloudflare Pages environment variables:
   ```
   VITE_API_URL=https://api.afterglowmusic.com/api
   ```

## Step 6: Auto-Deploy Setup

### Frontend (Cloudflare Pages)

✅ **Sudah otomatis!** Setiap push ke branch `main` akan auto-deploy.

### Worker (Backend)

**Opsi A: Manual Deploy (Recommended untuk production)**
```bash
cd workers
npm run deploy
```

**Opsi B: GitHub Actions (Auto-deploy)**

Buat file `.github/workflows/deploy-worker.yml`:

```yaml
name: Deploy Worker

on:
  push:
    branches: [main]
    paths:
      - 'workers/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd workers
          npm ci
      
      - name: Deploy to Cloudflare Workers
        run: |
          cd workers
          npx wrangler deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

**Setup GitHub Secrets:**
1. Buka repo di GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. **"New repository secret"**
4. Name: `CLOUDFLARE_API_TOKEN`
5. Value: Dapatkan dari https://dash.cloudflare.com/profile/api-tokens
   - **"Create Token"** → **"Edit Cloudflare Workers"** template
   - Copy token dan paste di GitHub secret

## Step 7: Update & Redeploy

### Update Code

```bash
# Make changes to your code
git add .
git commit -m "Update: description of changes"
git push
```

**Frontend:** Auto-deploy dalam 2-3 menit
**Worker:** Deploy manual atau tunggu GitHub Actions

### Force Rebuild

Jika perlu rebuild tanpa code changes:

**Frontend:**
1. Cloudflare Pages dashboard
2. **"Deployments"** tab
3. Klik **"..."** pada latest deployment
4. **"Retry deployment"**

**Worker:**
```bash
cd workers
npm run deploy
```

## 🎉 Done!

Website Anda sekarang live di:
- **Frontend:** https://afterglow-music.pages.dev
- **Backend:** https://afterglow-music-api.afterglowmusic.workers.dev

Setiap push ke GitHub akan auto-deploy frontend!

## 📝 Checklist

- [ ] Push code ke GitHub
- [ ] Deploy frontend ke Cloudflare Pages
- [ ] Set environment variables di Cloudflare Pages
- [ ] Deploy worker ke Cloudflare Workers
- [ ] Set RESEND_API_KEY secret di worker
- [ ] Update NOTIFICATION_EMAIL di wrangler.toml
- [ ] Test submission form
- [ ] Check email notification
- [ ] (Optional) Setup custom domain
- [ ] (Optional) Setup GitHub Actions for worker

## 🔧 Troubleshooting

**Build failed di Cloudflare Pages?**
- Cek build logs di dashboard
- Pastikan `package.json` dan `package-lock.json` ter-commit
- Pastikan environment variables sudah di-set

**API tidak connect?**
- Cek CORS settings di worker
- Pastikan `VITE_API_URL` benar di environment variables
- Test API endpoint langsung dengan curl

**Email tidak terkirim?**
- Cek `RESEND_API_KEY` sudah di-set: `npx wrangler secret list`
- Cek logs: `npx wrangler tail`
- Pastikan `NOTIFICATION_EMAIL` sudah di-update di wrangler.toml
