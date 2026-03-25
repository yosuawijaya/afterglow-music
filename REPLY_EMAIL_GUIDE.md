# 📧 Panduan Fitur Reply Email di Admin

Fitur baru untuk membalas email submissions langsung dari halaman Admin menggunakan Resend API.

## ✨ Fitur

1. **Tab Submissions** - Lihat semua submissions yang masuk
2. **View Details** - Lihat detail lengkap submission
3. **Reply Email** - Balas email langsung dari admin panel
4. **Update Status** - Ubah status submission (Pending, Reviewed, Accepted, Rejected)
5. **Listen Link** - Langsung buka link lagu yang di-submit

## 🎯 Cara Menggunakan

### 1. Akses Tab Submissions

Di halaman Admin, klik tab **"Submissions"** di sidebar.

### 2. Lihat Daftar Submissions

Tabel akan menampilkan:
- ID submission
- Nama artist
- Judul lagu
- Email
- Genre
- Status (dropdown untuk update)
- Tanggal submit
- Actions (View, Reply, Listen)

### 3. View Details

Klik tombol **"View"** untuk melihat detail lengkap:
- Personal Info (nama, email, phone, TTL, tempat lahir)
- Artist Info (nama artist, genre, bio, katalog)
- Song Info (judul, link, lyrics, notes)

### 4. Reply Email

1. Klik tombol **"Reply"** pada submission yang ingin dibalas
2. Modal form akan muncul dengan:
   - To: Email artist (otomatis terisi)
   - Subject: "Re: [Song Title] - Afterglow Music" (otomatis)
   - Message: Template awal sudah ada, edit sesuai kebutuhan
3. Tulis pesan balasan Anda
4. Klik **"Send Reply"**
5. Email akan dikirim via Resend API

**Template Default:**
```
Hi [Artist Name],

Terima kasih telah mengirimkan demo "[Song Title]" ke Afterglow Music.

[Tulis pesan Anda di sini]
```

### 5. Update Status

Gunakan dropdown di kolom **Status** untuk mengubah status submission:
- **Pending** (kuning) - Baru masuk, belum direview
- **Reviewed** (biru) - Sudah direview
- **Accepted** (hijau) - Diterima untuk kolaborasi
- **Rejected** (merah) - Ditolak

Status akan otomatis tersimpan saat dropdown diubah.

### 6. Listen to Song

Klik tombol **"Listen"** untuk membuka link lagu di tab baru.

## 🔧 Technical Details

### API Endpoint Baru

**POST** `/api/submissions/:id/reply`

Request body:
```json
{
  "to": "artist@email.com",
  "subject": "Re: Song Title - Afterglow Music",
  "message": "Your reply message here..."
}
```

Response:
```json
{
  "message": "Reply sent successfully"
}
```

### Email Format

Email yang dikirim akan menggunakan format HTML dengan:
- Header Afterglow Music
- Pesan yang ditulis admin (dengan line breaks preserved)
- Footer dengan branding dan link website

**From:** `Afterglow Music <submissions@mamangstudio.web.id>`

## 📝 Tips

1. **Personalisasi Pesan** - Edit template default untuk membuat pesan lebih personal
2. **Quick Reply** - Gunakan template yang sama untuk reply serupa
3. **Status Management** - Update status setelah reply untuk tracking
4. **Listen First** - Dengarkan lagu dulu sebelum reply untuk feedback yang lebih baik

## 🎨 Contoh Reply Messages

### Accepted
```
Hi [Name],

Terima kasih telah mengirimkan demo "[Song]" ke Afterglow Music.

Kami sangat tertarik dengan karya kamu! Tim kami ingin mendiskusikan lebih lanjut tentang kemungkinan kolaborasi.

Apakah kamu available untuk meeting minggu depan? Kami akan hubungi via WhatsApp untuk schedule.

Keep creating!

Best regards,
Afterglow Music Team
```

### Need More Info
```
Hi [Name],

Terima kasih telah mengirimkan demo "[Song]" ke Afterglow Music.

Kami sudah mendengarkan karya kamu dan tertarik untuk tahu lebih lanjut. Bisakah kamu share:
- Full version dari lagu ini
- Info tentang proses produksi
- Ekspektasi kamu untuk kolaborasi

Ditunggu ya!

Best regards,
Afterglow Music Team
```

### Rejected (Polite)
```
Hi [Name],

Terima kasih telah mengirimkan demo "[Song]" ke Afterglow Music.

Kami appreciate karya kamu, namun untuk saat ini belum sesuai dengan direction label kami. Kami encourage kamu untuk terus berkarya dan submit lagi di masa depan!

Keep the music alive! 🎵

Best regards,
Afterglow Music Team
```

## 🔐 Security

- Email hanya bisa dikirim oleh admin yang sudah login
- Resend API key disimpan di Cloudflare Workers secrets
- Rate limiting handled by Resend (100 emails/day untuk free tier)

## 🚀 Deploy

Fitur ini sudah terintegrasi dengan setup yang ada. Pastikan:
1. `RESEND_API_KEY` sudah di-set di Cloudflare Workers
2. Domain email sudah diverifikasi di Resend
3. Deploy ulang workers: `npm run deploy` di folder `workers/`

---

**Need Help?** Check `QUICK_EMAIL_SETUP.md` untuk setup Resend API.
