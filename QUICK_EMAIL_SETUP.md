# 📧 Quick Email Setup (5 Menit)

Ikuti langkah ini untuk menerima email notifikasi setiap ada submission baru.

## Step 1: Daftar Resend (Gratis)

1. Buka: https://resend.com/signup
2. Daftar dengan email Anda
3. Verifikasi email

## Step 2: Dapatkan API Key

1. Login ke: https://resend.com/api-keys
2. Klik **"Create API Key"**
3. Nama: `Afterglow Music`
4. **COPY API KEY** (hanya muncul sekali!)

## Step 3: Setup di Cloudflare

Buka terminal dan jalankan:

```bash
cd workers

# Set API Key (paste API key dari Resend)
npx wrangler secret put RESEND_API_KEY

# Edit wrangler.toml, ganti email di line NOTIFICATION_EMAIL
# Contoh: NOTIFICATION_EMAIL = "youremail@gmail.com"
```

## Step 4: Update Email Penerima

Edit file `workers/wrangler.toml`, cari baris:

```toml
NOTIFICATION_EMAIL = "your-email@example.com"
```

Ganti dengan email Anda:

```toml
NOTIFICATION_EMAIL = "youremail@gmail.com"
```

## Step 5: Deploy

```bash
npm run deploy
```

## ✅ Done!

Sekarang setiap ada submission baru, Anda akan dapat email dengan format:

**Subject:** 🎵 New Submission: [Song Title] by [Artist Name]

**Isi:**
- Data lengkap submitter (nama, email, phone, TTL)
- Info artist (nama, genre, bio, katalog)
- Detail lagu (judul, link, lyrics)

---

## 🔧 Troubleshooting

**Email tidak masuk?**
- Cek folder spam
- Pastikan API key sudah di-set: `npx wrangler secret list`
- Cek logs: `npx wrangler tail`

**Mau pakai domain sendiri?**
- Baca file `EMAIL_SETUP.md` untuk setup lengkap
- Dengan domain sendiri, email dari: `submissions@yourdomain.com`
- Tanpa domain, email dari: `onboarding@resend.dev`

**Mau ganti email service?**
- Bisa pakai SendGrid, Mailgun, atau SMTP lainnya
- Lihat contoh di `EMAIL_SETUP.md`

**Reply email tidak berfungsi?**
- Lihat `TROUBLESHOOTING_REPLY.md` untuk panduan lengkap
- Test endpoint: `./test-reply-endpoint.sh`
- Check worker logs: `cd workers && npx wrangler tail`
