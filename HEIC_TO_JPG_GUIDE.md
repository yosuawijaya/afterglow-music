# HEIC to JPG Conversion Guide

Panduan lengkap cara convert HEIC ke JPG sebelum upload.

## 🍎 iPhone/iPad

### Method 1: Change Camera Settings (Recommended)
Ubah setting agar foto langsung disimpan sebagai JPG:

1. Buka **Settings** (Pengaturan)
2. Scroll ke **Camera**
3. Tap **Formats**
4. Pilih **Most Compatible** (bukan High Efficiency)
5. ✅ Sekarang semua foto baru akan disimpan sebagai JPG!

### Method 2: Share as JPG
Convert foto HEIC yang sudah ada:

1. Buka **Photos** app
2. Pilih foto yang mau di-convert
3. Tap tombol **Share** (icon kotak dengan panah)
4. Scroll ke bawah, tap **Save to Files**
5. Pilih lokasi (iCloud Drive atau On My iPhone)
6. Foto otomatis convert ke JPG saat save!

### Method 3: AirDrop to Mac
1. Select foto di iPhone
2. AirDrop ke Mac
3. Mac otomatis convert ke JPG
4. Upload dari Mac

### Method 4: Email to Yourself
1. Select foto
2. Share via Email
3. Email otomatis convert ke JPG
4. Download dari email di komputer

## 💻 Mac

### Method 1: Preview App
1. Buka foto HEIC di **Preview**
2. **File** → **Export**
3. Format: pilih **JPEG**
4. Quality: 80-90%
5. Click **Save**
6. ✅ Sekarang punya file JPG!

### Method 2: Photos App
1. Buka **Photos** app
2. Select foto
3. **File** → **Export** → **Export 1 Photo**
4. Photo Kind: pilih **JPEG**
5. Click **Export**

### Method 3: Quick Action (Automator)
Buat shortcut untuk batch convert:

1. Buka **Automator**
2. New Document → **Quick Action**
3. Add action: **Change Type of Images**
4. Set to: **JPEG**
5. Save as "Convert to JPG"
6. Right-click foto HEIC → Quick Actions → Convert to JPG

### Method 4: Terminal (Batch Convert)
```bash
# Install ImageMagick
brew install imagemagick

# Convert single file
magick convert input.heic output.jpg

# Batch convert all HEIC in folder
for file in *.heic; do magick convert "$file" "${file%.heic}.jpg"; done
```

## 🌐 Online Tools (Any Device)

### 1. CloudConvert (Recommended)
- URL: https://cloudconvert.com/heic-to-jpg
- ✅ Free, no watermark
- ✅ Batch convert
- ✅ Privacy: files deleted after 24h

### 2. HEICtoJPEG
- URL: https://heictojpeg.com
- ✅ Simple & fast
- ✅ No registration
- ✅ Drag & drop

### 3. Convertio
- URL: https://convertio.co/heic-jpg/
- ✅ Support 300+ formats
- ✅ Cloud storage integration
- ⚠️ Free: max 100MB

### 4. FreeConvert
- URL: https://www.freeconvert.com/heic-to-jpg
- ✅ No file size limit
- ✅ Batch convert
- ✅ Quality settings

## 🪟 Windows

### Method 1: CopyTrans HEIC
1. Download: https://www.copytrans.net/copytransheic/
2. Install (free)
3. Right-click HEIC file
4. **Convert to JPEG with CopyTrans**
5. ✅ Done!

### Method 2: iMazing HEIC Converter
1. Download: https://imazing.com/heic
2. Drag & drop HEIC files
3. Choose quality
4. Click **Convert**

### Method 3: Windows Photos App (Windows 11)
1. Open HEIC in Photos app
2. Click **...** (three dots)
3. **Save as**
4. Format: JPEG
5. Save

## 🔧 Desktop Apps

### Free:
- **XnConvert** (Windows/Mac/Linux) - Batch converter
- **GIMP** (All platforms) - Open HEIC, export as JPG
- **IrfanView** (Windows) - With HEIC plugin

### Paid:
- **Adobe Photoshop** - Open HEIC, save as JPG
- **Affinity Photo** - Native HEIC support

## 📱 Mobile Apps

### iOS:
- **HEIC to JPG Converter** (Free)
- **Image Converter** (Free)
- **Photo Converter** (Free with ads)

### Android:
- **HEIC to JPG Converter** (Free)
- **Image Converter** (Free)

## ⚡ Quick Tips

### Prevent HEIC in Future:
1. **iPhone:** Settings → Camera → Formats → Most Compatible
2. **Mac:** Photos → Preferences → Export → JPEG

### Batch Convert:
- Use online tools for 10+ files
- Use desktop apps for 100+ files
- Use command line for 1000+ files

### Quality Settings:
- **Web use:** 80-85% quality
- **Print:** 90-95% quality
- **Archive:** 100% quality

## 🎯 Recommended Workflow

### For Admin Dashboard:
1. **Before upload:** Convert HEIC to JPG
2. **Compress:** Use TinyPNG or Squoosh
3. **Resize:** 1200x630px for news cover
4. **Upload:** JPG file to admin
5. ✅ No HEIC issues!

### For iPhone Users:
1. Change camera settings to "Most Compatible"
2. All new photos = JPG automatically
3. For old HEIC photos: use Share → Save to Files
4. Upload JPG from Files app

## 🆘 Still Having Issues?

### Check File Extension:
```bash
# Mac/Linux Terminal
file yourimage.heic

# Should show: HEIC image data
```

### Verify After Conversion:
```bash
file yourimage.jpg

# Should show: JPEG image data
```

### Browser Console:
Open browser console (F12) and check:
- File type being uploaded
- Any error messages
- Network tab for upload request

## 📞 Support

If masih ada masalah:
1. Screenshot error message
2. Check file type di file properties
3. Try different browser
4. Clear browser cache
5. Contact admin

---

**Remember:** Prevention is better than cure! Set iPhone to "Most Compatible" format! 📸
