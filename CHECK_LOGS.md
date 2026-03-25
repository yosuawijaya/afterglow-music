# 📊 Cara Check Logs Worker

Untuk melihat logs real-time dari Cloudflare Worker:

## Option 1: Terminal (Recommended)

```bash
cd workers
npx wrangler tail
```

Kemudian di browser, coba send reply email. Logs akan muncul real-time di terminal.

## Option 2: Cloudflare Dashboard

1. Buka: https://dash.cloudflare.com
2. Pilih account Anda
3. Klik "Workers & Pages"
4. Klik "afterglow-music-api"
5. Tab "Logs" atau "Real-time Logs"

## What to Look For

Saat send reply, Anda akan lihat:

```
Reply endpoint hit: { path: '/api/submissions/6/reply', id: '6', pathParts: [...] }
Reply request body: { to: 'email@example.com', subject: '...' }
Sending to Resend: { from: '...', to: [...], subject: '...' }
Resend response: { status: 200, body: '{"id":"..."}' }
```

## Common Log Messages

### ✅ Success
```
Resend response: { status: 200, body: '{"id":"xxx-xxx-xxx"}' }
```

### ❌ Missing API Key
```
RESEND_API_KEY not configured
```
**Fix:** `npx wrangler secret put RESEND_API_KEY`

### ❌ Invalid API Key
```
Resend API error: {"statusCode":403,"message":"Forbidden"}
```
**Fix:** Generate new API key di https://resend.com/api-keys

### ❌ Domain Not Verified
```
Resend API error: {"statusCode":403,"message":"Domain not verified"}
```
**Fix:** Verifikasi domain di https://resend.com/domains

### ❌ Missing Fields
```
Missing required fields: to, subject, message
```
**Fix:** Check frontend code, pastikan semua fields terkirim

## Test Endpoint Manually

```bash
curl -X POST "https://afterglow-music-api.afterglowmusic.workers.dev/api/submissions/1/reply" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Reply",
    "message": "This is a test message"
  }' \
  -v
```

Look for:
- HTTP status code (200 = success)
- Response body
- Any error messages

## Quick Debug Commands

```bash
# Check if worker is deployed
cd workers
npx wrangler deployments list

# Check secrets
npx wrangler secret list

# View recent logs
npx wrangler tail --format pretty

# Test endpoint
./test-reply-endpoint.sh
```

---

**Setelah deploy, tunggu 1-2 menit untuk propagasi, lalu coba lagi!**
