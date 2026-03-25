# News Integration dengan Releases

## Yang Sudah Dibuat

### 1. Database Schema
- Tabel `news` sudah ditambahkan ke `workers/schema.sql`
- Ada kolom `release_id` untuk menghubungkan news dengan release
- Cover image dari release akan otomatis jadi cover news

### 2. Auto-Create News dari Release
Ketika admin menambahkan release baru, ada checkbox **"Auto-create News Article"** yang:
- ✅ Otomatis checked (default)
- ✅ Membuat news article dengan cover artwork dari release
- ✅ Generate slug otomatis dari artist + title
- ✅ Membuat konten news yang sudah siap publish

### 3. Link dari Home ke News
Di section "Latest Releases" di homepage, ada tombol **"View All News →"** yang mengarah ke halaman News.

## Cara Menggunakan

### Setup Database (Pertama Kali)
```bash
cd workers

# Jalankan migration untuk menambahkan tabel news (REMOTE/PRODUCTION)
npx wrangler d1 execute afterglow-music-db --file=add-news-table.sql --remote

# Atau untuk local development
npx wrangler d1 execute afterglow-music-db --file=add-news-table.sql --local
```

### Menambahkan Release dengan Auto-News
1. Login ke Admin Dashboard
2. Klik tab "Releases"
3. Klik "+ Add Release"
4. Isi form:
   - Artist Name
   - Song/Album Title
   - Upload Artwork (ini akan jadi cover news juga!)
   - Listen URL
   - ✅ **Auto-create News Article** (biarkan checked)
5. Klik "Save"
6. News akan otomatis dibuat dengan cover yang sama!

### Mengelola News Secara Manual
1. Login ke Admin Dashboard
2. Klik tab **"News"** (icon koran)
3. Klik "+ Add News" untuk membuat news baru
4. Isi form:
   - Title
   - Slug (auto-generate dari title jika kosong)
   - Excerpt (deskripsi singkat)
   - **Content** - Gunakan rich text editor dengan toolbar:
     - Headers (H1, H2, H3)
     - Bold, Italic, Underline, Strike
     - Ordered/Unordered Lists
     - Links & Blockquotes
     - Clean formatting
   - Upload Cover Image
   - Author
   - ✅ Published (uncheck untuk save as draft)
5. Klik "Save"

### Edit/Delete News
- Di tab News, klik tombol "Edit" untuk mengubah news
- Klik "Delete" untuk menghapus news
- Status badge menunjukkan apakah news Published atau Draft

### Melihat News
- User bisa klik tombol "View All News →" di section Latest Releases
- Atau langsung ke `/news`
- Cover image dari release akan muncul sebagai featured image di news

## File yang Dimodifikasi

1. `workers/schema.sql` - Tambah tabel news
2. `workers/add-news-table.sql` - Migration file untuk database yang sudah ada
3. `workers/index.ts` - API endpoint untuk auto-create news
4. `src/pages/Admin.tsx` - Form release dengan checkbox auto-create news
5. `src/components/Releases.tsx` - Tambah link ke news
6. `src/components/Releases.css` - Styling untuk tombol "View All News"

## Keuntungan

✅ Admin tidak perlu upload cover 2x (di release dan di news)
✅ Cover artwork otomatis duplikat ke news
✅ News otomatis ter-publish ketika release dibuat
✅ User bisa langsung lihat news dari homepage
✅ Konsisten antara release dan news
✅ **Verified badge** (centang biru) otomatis muncul untuk "Afterglow Music"

## Notes

- Checkbox "Auto-create News" hanya muncul saat **menambah release baru**, tidak saat edit
- Cover image dari release akan otomatis jadi cover image di news
- News yang dibuat otomatis langsung published (is_published = 1)
- Slug news dibuat otomatis dari artist + title (lowercase, replace spaces dengan dash)
- **Verified Badge** (centang biru) otomatis muncul untuk author "Afterglow Music"
- Badge menggunakan SVG file di `/public/assets/icons/verified.svg` - bisa diganti dengan design custom Anda
