# 🔄 Status Synchronization Guide

Panduan tentang bagaimana status submissions disinkronkan di seluruh sistem.

## 📊 Status Flow

```
Pending → Reviewed → Accepted/Rejected
```

### Status Definitions

1. **Pending** (Kuning)
   - Submission baru masuk
   - Belum direview
   - Default status

2. **Reviewed** (Biru)
   - Sudah direview oleh admin
   - Auto-set setelah reply email dikirim
   - Menunggu keputusan final

3. **Accepted** (Hijau)
   - Submission diterima untuk kolaborasi
   - Artist akan difollow-up lebih lanjut

4. **Rejected** (Merah)
   - Submission ditolak
   - Bisa dengan atau tanpa feedback

## 🔄 Auto-Sync Features

### 1. Status Update via Dropdown

Saat admin mengubah status via dropdown:
- ✅ Langsung update di UI (optimistic update)
- ✅ Kirim request ke API
- ✅ Simpan ke database
- ✅ Reload data untuk konfirmasi
- ✅ Toast notification muncul
- ✅ Dropdown disabled saat updating

### 2. Auto-Update After Reply

Saat admin send reply email:
- ✅ Email terkirim
- ✅ Status auto-update dari "Pending" → "Reviewed"
- ✅ Data submissions di-reload
- ✅ Toast notification muncul

### 3. Real-time Sync

Setiap kali data berubah:
- ✅ Local state update instant
- ✅ Database update via API
- ✅ Reload untuk konfirmasi sync
- ✅ Error handling dengan rollback

## 🎯 User Experience

### Visual Feedback

1. **Dropdown Colors**
   - Pending: Kuning (#fef3c7)
   - Reviewed: Biru (#dbeafe)
   - Accepted: Hijau (#d1fae5)
   - Rejected: Merah (#fee2e2)

2. **Loading States**
   - Dropdown disabled saat updating
   - Opacity 50% saat disabled
   - Cursor not-allowed

3. **Toast Notifications**
   - Success: "Status updated to [status]"
   - Error: "Failed to update status"
   - Auto-dismiss setelah 3 detik

## 🔧 Technical Implementation

### Frontend (Admin.tsx)

```typescript
const handleUpdateStatus = async (id: number, status: string) => {
  setUpdatingStatus(id) // Disable dropdown
  
  try {
    // API call
    await fetch(`/api/submissions/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    })
    
    // Optimistic update
    setSubmissions(submissions.map(s => 
      s.id === id ? { ...s, status } : s
    ))
    
    // Reload for confirmation
    await loadSubmissions()
    
    toast.success(`Status updated to ${status}`)
  } catch (error) {
    toast.error('Failed to update status')
    await loadSubmissions() // Rollback
  } finally {
    setUpdatingStatus(null) // Enable dropdown
  }
}
```

### Backend (workers/index.ts)

```typescript
if (path.match(/^\/api\/submissions\/\d+\/status$/) && method === 'PUT') {
  const id = path.split('/')[3]
  const body = await request.json()
  
  await env.DB.prepare(
    'UPDATE submissions SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
  ).bind(body.status, id).run()
  
  return jsonResponse({ message: 'Status updated successfully' })
}
```

### Database (schema.sql)

```sql
CREATE TABLE submissions (
  ...
  status TEXT DEFAULT 'pending',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## 🚀 Best Practices

### For Admins

1. **Review First**
   - Listen to the song before changing status
   - Read artist bio and notes

2. **Use Reply Feature**
   - Send reply before accepting/rejecting
   - Status auto-updates to "Reviewed"

3. **Status Workflow**
   ```
   New Submission (Pending)
   ↓
   Listen & Review
   ↓
   Send Reply (Auto → Reviewed)
   ↓
   Make Decision (Accepted/Rejected)
   ```

4. **Bulk Actions**
   - Update status one by one
   - Each update syncs immediately
   - No need to refresh page

## 🐛 Troubleshooting

### Status Not Updating?

1. **Check Network**
   - Open DevTools → Network tab
   - Look for PUT request to `/api/submissions/:id/status`
   - Check response status (200 = success)

2. **Check Database**
   ```bash
   cd workers
   npx wrangler d1 execute afterglow-music-db --command "SELECT id, status FROM submissions"
   ```

3. **Force Reload**
   - Refresh browser (Cmd/Ctrl + R)
   - Or switch to another tab and back

### Status Reverted After Update?

**Cause:** API call failed but optimistic update succeeded

**Fix:**
- Check worker logs: `cd workers && npx wrangler tail`
- Verify database connection
- Check if status value is valid (pending/reviewed/accepted/rejected)

### Multiple Status Updates Conflict?

**Cause:** Clicking dropdown too fast

**Prevention:**
- Dropdown disabled during update
- Wait for toast notification
- One update at a time

## 📈 Future Enhancements

Possible improvements:
- [ ] Bulk status update (select multiple submissions)
- [ ] Status history/audit log
- [ ] Email notification on status change
- [ ] Custom status labels
- [ ] Status filters and search
- [ ] Export submissions by status

---

**Status sync is now fully automated and reliable!** 🎉
