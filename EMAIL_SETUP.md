# Email Notification Setup

Setiap kali ada submission baru dari form "Submit Your Song", sistem akan otomatis mengirim email notifikasi ke alamat email yang Anda tentukan.

## Setup Steps

### 1. Daftar di Resend (Free)

1. Buka https://resend.com/signup
2. Daftar dengan email Anda (gratis untuk 3,000 emails/bulan)
3. Verifikasi email Anda

### 2. Dapatkan API Key

1. Login ke dashboard Resend: https://resend.com/api-keys
2. Klik "Create API Key"
3. Beri nama: `Afterglow Music Notifications`
4. Copy API key yang diberikan (hanya muncul sekali!)

### 3. Setup Domain Email (Optional tapi Recommended)

**Opsi A: Gunakan Domain Sendiri (Recommended)**
1. Di Resend dashboard, klik "Domains"
2. Klik "Add Domain"
3. Masukkan domain Anda (contoh: `afterglowmusic.com`)
4. Tambahkan DNS records yang diberikan ke domain provider Anda
5. Tunggu verifikasi (biasanya 5-10 menit)
6. Setelah verified, email akan dikirim dari `submissions@afterglowmusic.com`

**Opsi B: Gunakan Domain Resend (Untuk Testing)**
- Bisa langsung pakai tanpa setup domain
- Email akan dikirim dari `onboarding@resend.dev`
- Tapi hanya bisa kirim ke email yang sudah diverifikasi

### 4. Configure Cloudflare Worker

**Update wrangler.toml:**
```toml
[vars]
NOTIFICATION_EMAIL = "your-email@example.com"  # Ganti dengan email Anda
```

**Set Secret (API Key):**
```bash
cd workers
npx wrangler secret put RESEND_API_KEY
# Paste API key dari Resend, tekan Enter
```

### 5. Deploy Worker

```bash
cd workers
npm run deploy
```

## Format Email yang Dikirim

Email akan berisi:
- **Subject:** 🎵 New Submission: [Song Title] by [Artist Name]
- **From:** Afterglow Music <submissions@afterglowmusic.com>
- **To:** Email yang Anda set di NOTIFICATION_EMAIL

**Isi Email:**
- Personal Information (nama, email, phone, tempat/tanggal lahir)
- Artist Information (nama artist, genre, bio, katalog)
- Song Details (judul lagu, link, lyrics, notes)
- Timestamp submission

## Testing

### Local Testing:
```bash
cd workers
npm run dev
```

Kemudian test submit form di http://localhost:5173/submit

### Production Testing:
Setelah deploy, buka website Anda dan submit form. Cek email dalam 1-2 menit.

## Troubleshooting

**Email tidak masuk?**
1. Cek spam folder
2. Pastikan RESEND_API_KEY sudah di-set dengan benar:
   ```bash
   npx wrangler secret list
   ```
3. Cek logs:
   ```bash
   npx wrangler tail
   ```
4. Pastikan domain sudah verified (jika pakai domain sendiri)

**Error "Invalid API Key"?**
- Set ulang secret:
  ```bash
  npx wrangler secret put RESEND_API_KEY
  ```

**Email hanya bisa kirim ke satu alamat?**
- Jika pakai domain Resend (onboarding@resend.dev), harus verify email penerima dulu
- Solusi: Setup domain sendiri (gratis)

## Alternative: Gunakan Email Service Lain

Jika tidak mau pakai Resend, bisa ganti dengan:

### SendGrid:
```typescript
await fetch('https://api.sendgrid.com/v3/mail/send', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    personalizations: [{ to: [{ email: env.NOTIFICATION_EMAIL }] }],
    from: { email: 'submissions@afterglowmusic.com' },
    subject: `New Submission: ${submission.songTitle}`,
    content: [{ type: 'text/html', value: emailHtml }],
  }),
});
```

### Mailgun:
```typescript
const formData = new FormData();
formData.append('from', 'submissions@afterglowmusic.com');
formData.append('to', env.NOTIFICATION_EMAIL);
formData.append('subject', `New Submission: ${submission.songTitle}`);
formData.append('html', emailHtml);

await fetch(`https://api.mailgun.net/v3/${env.MAILGUN_DOMAIN}/messages`, {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${btoa(`api:${env.MAILGUN_API_KEY}`)}`,
  },
  body: formData,
});
```

## Pricing

**Resend Free Tier:**
- 3,000 emails/bulan
- 100 emails/hari
- Unlimited domains
- Cukup untuk kebanyakan use case

Jika butuh lebih, upgrade ke Pro ($20/bulan untuk 50,000 emails).
