# Image Upload Guide - Afterglow Music

Panduan lengkap untuk upload dan optimasi gambar di website Afterglow Music.

## 🎯 Format Gambar yang Didukung

### Input (Upload)
✅ **JPG/JPEG** - Format standar
✅ **PNG** - Dengan transparansi
✅ **HEIC** - Format iPhone/Mac (auto-convert ke JPG)
✅ **WebP** - Format modern
✅ **GIF** - Animasi (tidak recommended untuk cover)

### Output (Hasil)
Semua gambar akan dikonversi ke **JPG** dengan optimasi otomatis:
- Format: JPEG
- Quality: Smart (otomatis adjust)
- Progressive: Yes (load bertahap)
- Max size: 1920x1920px

## 🔄 Auto-Conversion HEIC ke JPG

### Masalah HEIC
- iPhone/Mac menyimpan foto dalam format HEIC
- HEIC tidak didukung semua browser
- File size lebih kecil tapi compatibility rendah

### Solusi (Sudah Diimplementasikan ✅)
Uploadcare otomatis convert HEIC ke JPG dengan transformations:
```
-/format/jpeg/-/quality/smart/-/progressive/yes/
```

**Cara Kerja:**
1. Upload gambar HEIC dari iPhone
2. Uploadcare detect format
3. Auto-convert ke JPG
4. Optimize quality & size
5. Return URL JPG yang optimized

## 📐 Ukuran Gambar Recommended

### Cover Image untuk News
- **Ukuran:** 1200x630px (16:9 ratio)
- **Format:** JPG
- **File size:** < 500KB
- **Use case:** Featured image, social media preview

### Album Artwork (Releases)
- **Ukuran:** 1000x1000px (1:1 ratio)
- **Format:** JPG
- **File size:** < 300KB
- **Use case:** Release cards, carousel

### Artist Photo
- **Ukuran:** 800x800px (1:1 ratio)
- **Format:** JPG
- **File size:** < 200KB
- **Use case:** Artist profile

### Hero Slides
- **Background:** 1920x1080px (16:9 ratio)
- **Cover:** 500x500px (1:1 ratio)
- **Format:** JPG
- **File size:** < 800KB (background), < 200KB (cover)

## 🚀 Optimasi Otomatis

### Yang Dilakukan Uploadcare:
1. **Format conversion** - HEIC → JPG
2. **Smart quality** - Balance antara quality & size
3. **Progressive loading** - Load bertahap (blur → sharp)
4. **Image shrink** - Max 1920x1920px
5. **CDN delivery** - Fast loading worldwide

### Transformations URL:
```
https://ucarecdn.com/[uuid]/-/format/jpeg/-/quality/smart/-/progressive/yes/
```

## 📱 Upload dari iPhone/Mac

### Cara Upload HEIC (Auto-Convert):
1. Buka Admin Dashboard
2. Pilih tab (Slides/Releases/Artists/News)
3. Klik "Choose file" atau drag & drop
4. Pilih foto dari iPhone/Mac
5. ✅ HEIC otomatis convert ke JPG!

### Tips:
- Tidak perlu convert manual
- Upload langsung dari Photos app
- Kualitas tetap bagus setelah convert
- File size lebih kecil (optimized)

## 🛠️ Manual Conversion (Jika Perlu)

### Online Tools:
1. **CloudConvert** - https://cloudconvert.com/heic-to-jpg
2. **HEICtoJPEG** - https://heictojpeg.com
3. **Convertio** - https://convertio.co/heic-jpg/

### Mac Built-in:
1. Buka foto di Preview
2. File → Export
3. Format: JPEG
4. Quality: 80-90%
5. Save

### iPhone Settings:
Settings → Camera → Formats → Most Compatible
(Akan save sebagai JPG instead of HEIC)

## ⚠️ Troubleshooting

### Gambar Tidak Muncul
- Check URL valid
- Check format supported
- Clear browser cache
- Try re-upload

### File Size Terlalu Besar
- Compress dulu sebelum upload
- Use TinyPNG: https://tinypng.com
- Atau Squoosh: https://squoosh.app

### HEIC Masih Muncul
- Pastikan code sudah update ✅
- Clear cache & refresh
- Check Uploadcare transformations

### Quality Jelek Setelah Upload
- Upload gambar dengan resolusi lebih tinggi
- Minimum 1200px untuk cover news
- Minimum 1000px untuk artwork

## 📊 Best Practices

### Before Upload:
1. ✅ Check ukuran minimum (lihat recommended)
2. ✅ Crop ke ratio yang benar (16:9 atau 1:1)
3. ✅ Brightness & contrast bagus
4. ✅ File name descriptive (artist-song-title.jpg)

### After Upload:
1. ✅ Preview di desktop & mobile
2. ✅ Check loading speed
3. ✅ Verify URL accessible
4. ✅ Test social media preview

## 🎨 Image Editing Tools

### Free Online:
- **Canva** - https://canva.com (templates ready)
- **Photopea** - https://photopea.com (Photoshop-like)
- **Remove.bg** - https://remove.bg (background removal)
- **Pixlr** - https://pixlr.com/editor

### Desktop:
- **GIMP** - Free Photoshop alternative
- **Photoshop** - Professional (paid)
- **Affinity Photo** - One-time purchase

### Mobile:
- **Snapseed** - Free, powerful
- **VSCO** - Filters & editing
- **Lightroom Mobile** - Professional

## 🔗 Uploadcare Features

### Transformations Available:
```
-/format/jpeg/          # Convert to JPG
-/quality/smart/        # Smart quality
-/progressive/yes/      # Progressive loading
-/resize/1200x630/      # Resize
-/crop/1200x630/center/ # Crop from center
-/blur/20/              # Blur effect
-/grayscale/            # Black & white
```

### Example Usage:
```typescript
// In ImageUpload component
const optimizedUrl = `${info.cdnUrl}-/format/jpeg/-/quality/smart/-/progressive/yes/`
```

## 📝 Checklist Upload Image

- [ ] Format: JPG, PNG, atau HEIC (auto-convert)
- [ ] Ukuran sesuai recommended
- [ ] File size < 500KB
- [ ] Quality bagus (tidak blur)
- [ ] Crop ratio benar
- [ ] Brightness & contrast OK
- [ ] Preview di mobile & desktop
- [ ] URL accessible

## 💡 Pro Tips

1. **Batch upload** - Upload multiple images sekaligus
2. **Reuse URLs** - Save URL untuk dipakai lagi
3. **CDN cache** - Image di-cache, loading cepat
4. **Lazy loading** - Image load saat scroll (built-in)
5. **Alt text** - Tambahkan deskripsi untuk SEO

---

**Note:** Semua image upload menggunakan Uploadcare CDN untuk performance optimal!
