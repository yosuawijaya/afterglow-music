# ⚡ Quick Deploy Guide

## 1️⃣ Push ke GitHub (2 menit)

```bash
# Initialize git (jika belum)
git init
git add .
git commit -m "Initial commit"

# Create repo di GitHub: https://github.com/new
# Kemudian push:
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

## 2️⃣ Deploy Frontend (3 menit)

1. Buka: https://dash.cloudflare.com
2. **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
3. Pilih repository Anda
4. Build settings:
   - Framework: **Vite**
   - Build command: `npm run build`
   - Output: `dist`
5. Environment variables:
   ```
   VITE_API_URL = https://afterglow-music-api.afterglowmusic.workers.dev/api
   VITE_UPLOADCARE_PUBLIC_KEY = ffbcea34c5af37feb491
   ```
6. **Save and Deploy**

## 3️⃣ Deploy Backend (1 menit)

```bash
cd workers
npx wrangler login
npm run deploy
```

## ✅ Done!

Website live di: `https://your-project.pages.dev`

---

**Update code:**
```bash
git add .
git commit -m "Update"
git push
```

Frontend auto-deploy! Worker deploy manual dengan `npm run deploy`.

Lihat `GITHUB_DEPLOY.md` untuk panduan lengkap.
