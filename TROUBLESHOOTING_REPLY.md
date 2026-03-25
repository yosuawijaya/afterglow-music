# 🔧 Troubleshooting Reply Email Feature

Panduan untuk mengatasi masalah pada fitur reply email di Admin.

## ❌ Error: "Failed to send reply"

### 1. Check API URL Configuration

Pastikan `VITE_API_URL` di `.env` sudah benar:

```bash
# .env
VITE_API_URL=https://afterglow-music-api.afterglowmusic.workers.dev/api
```

**Test:**
```bash
echo $VITE_API_URL
# atau
cat .env | grep VITE_API_URL
```

### 2. Check Resend API Key

Pastikan `RESEND_API_KEY` sudah di-set di Cloudflare Workers:

```bash
cd workers
npx wrangler secret list
```

Jika belum ada, set dengan:
```bash
npx wrangler secret put RESEND_API_KEY
# Paste API key dari https://resend.com/api-keys
```

### 3. Check Worker Logs

Lihat real-time logs untuk debug:

```bash
cd workers
npx wrangler tail
```

Kemudian coba send reply dari Admin, dan lihat log output.

**Yang harus dicari:**
- `Reply endpoint hit:` - Endpoint dipanggil
- `Sending to Resend:` - Request ke Resend API
- `Resend response:` - Response dari Resend
- Error messages jika ada

### 4. Test Endpoint Manually

Gunakan curl untuk test endpoint:

```bash
./test-reply-endpoint.sh
```

Atau manual:
```bash
curl -X POST "https://afterglow-music-api.afterglowmusic.workers.dev/api/submissions/1/reply" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "your-email@example.com",
    "subject": "Test Reply",
    "message": "This is a test"
  }'
```

**Expected response:**
```json
{
  "message": "Reply sent successfully",
  "data": {
    "id": "xxx-xxx-xxx"
  }
}
```

### 5. Check Email Domain Verification

Pastikan domain `mamangstudio.web.id` sudah diverifikasi di Resend:

1. Login ke https://resend.com/domains
2. Cek status domain
3. Jika belum verified, ikuti instruksi DNS setup

**Alternatif:** Gunakan email default Resend untuk testing:
```typescript
from: 'onboarding@resend.dev'
```

### 6. Check CORS Issues

Jika error di browser console tentang CORS:

**Browser Console:**
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```

**Fix:** Pastikan CORS headers di `workers/index.ts` sudah benar:
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};
```

### 7. Check Request Payload

Buka Browser DevTools → Network tab → Cari request ke `/reply` → Check:

**Request Headers:**
```
Content-Type: application/json
```

**Request Payload:**
```json
{
  "to": "artist@email.com",
  "subject": "Re: Song Title - Afterglow Music",
  "message": "Your message here..."
}
```

**Response:**
- Status 200 = Success
- Status 400 = Bad request (missing fields)
- Status 500 = Server error (check logs)

## 🐛 Common Issues

### Issue: "Email service not configured"

**Cause:** `RESEND_API_KEY` tidak di-set di Workers

**Fix:**
```bash
cd workers
npx wrangler secret put RESEND_API_KEY
# Paste your API key
```

### Issue: "Failed to send email: Forbidden"

**Cause:** API key tidak valid atau expired

**Fix:**
1. Generate new API key di https://resend.com/api-keys
2. Update secret:
```bash
cd workers
npx wrangler secret put RESEND_API_KEY
```

### Issue: "Failed to send email: Domain not verified"

**Cause:** Domain email belum diverifikasi di Resend

**Fix Option 1:** Verifikasi domain
1. Login ke https://resend.com/domains
2. Add domain `mamangstudio.web.id`
3. Add DNS records sesuai instruksi
4. Wait for verification

**Fix Option 2:** Gunakan default email untuk testing
Edit `workers/index.ts`:
```typescript
from: 'onboarding@resend.dev',  // Default Resend email
```

### Issue: Network error / Timeout

**Cause:** Worker tidak bisa akses Resend API

**Fix:**
1. Check internet connection
2. Check Resend API status: https://resend.com/status
3. Try again after a few minutes

### Issue: Email tidak masuk ke inbox

**Possible causes:**
1. Email masuk ke spam folder
2. Email address typo
3. Recipient email server reject

**Fix:**
1. Check spam/junk folder
2. Verify email address di submission data
3. Check Resend logs: https://resend.com/emails

## 🧪 Testing Checklist

Sebelum deploy ke production, test:

- [ ] Load submissions list
- [ ] Click "Reply" button
- [ ] Modal form muncul dengan data yang benar
- [ ] Edit message
- [ ] Click "Send Reply"
- [ ] Success message muncul
- [ ] Email diterima di inbox
- [ ] Email format benar (HTML, footer, branding)
- [ ] Check spam folder jika tidak masuk inbox

## 📊 Monitoring

### Check Email Delivery

Login ke Resend dashboard:
https://resend.com/emails

Lihat:
- Sent emails
- Delivery status
- Bounce/complaint rates
- Error logs

### Check Worker Metrics

```bash
cd workers
npx wrangler tail --format pretty
```

Atau di Cloudflare dashboard:
https://dash.cloudflare.com → Workers → afterglow-music-api → Metrics

## 🆘 Still Not Working?

1. **Check all environment variables:**
```bash
# Frontend
cat .env

# Workers
cd workers
npx wrangler secret list
cat wrangler.toml | grep NOTIFICATION_EMAIL
```

2. **Redeploy everything:**
```bash
# Frontend
npm run build
npm run deploy

# Workers
cd workers
npm run deploy
```

3. **Test with minimal payload:**
```bash
curl -X POST "YOUR_WORKER_URL/api/submissions/1/reply" \
  -H "Content-Type: application/json" \
  -d '{"to":"test@test.com","subject":"Test","message":"Hi"}'
```

4. **Check browser console for errors:**
- Open DevTools (F12)
- Go to Console tab
- Look for red error messages
- Share error message for help

## 📞 Need More Help?

1. Share worker logs: `npx wrangler tail`
2. Share browser console errors
3. Share network request/response from DevTools
4. Check `REPLY_EMAIL_GUIDE.md` for usage guide
5. Check `QUICK_EMAIL_SETUP.md` for initial setup

---

**Last Updated:** March 2026
