/// <reference types="@cloudflare/workers-types" />

export interface Env {
  DB: D1Database;
  RESEND_API_KEY: string;
  NOTIFICATION_EMAIL: string;
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Handle CORS preflight
function handleOptions() {
  return new Response(null, {
    headers: corsHeaders,
  });
}

// Helper function to add CORS headers
function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}

// Helper function to send email notification
async function sendEmailNotification(env: Env, submission: any) {
  try {
    // Email to admin (notification)
    const adminEmailHtml = `
      <h2>🎵 New Song Submission Received!</h2>
      
      <h3>Personal Information</h3>
      <ul>
        <li><strong>Full Name:</strong> ${submission.fullName}</li>
        <li><strong>Email:</strong> ${submission.email}</li>
        <li><strong>Phone:</strong> ${submission.phone}</li>
        <li><strong>Date of Birth:</strong> ${submission.dateOfBirth}</li>
        <li><strong>Place of Birth:</strong> ${submission.placeOfBirth}</li>
      </ul>
      
      <h3>Artist Information</h3>
      <ul>
        <li><strong>Artist Name:</strong> ${submission.artistName}</li>
        <li><strong>Genre:</strong> ${submission.genre}</li>
        <li><strong>Bio:</strong> ${submission.bio}</li>
        ${submission.catalog ? `<li><strong>Previous Releases:</strong> ${submission.catalog}</li>` : ''}
      </ul>
      
      <h3>Song Details</h3>
      <ul>
        <li><strong>Song Title:</strong> ${submission.songTitle}</li>
        <li><strong>Song Link:</strong> <a href="${submission.songLink}">${submission.songLink}</a></li>
        ${submission.lyrics ? `<li><strong>Lyrics:</strong><br><pre>${submission.lyrics}</pre></li>` : ''}
        ${submission.notes ? `<li><strong>Additional Notes:</strong> ${submission.notes}</li>` : ''}
      </ul>
      
      <p><em>Submitted at: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}</em></p>
    `;

    // Email to artist (confirmation)
    const artistEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ff6b35;">Hi ${submission.fullName}! 👋</h2>
        
        <p>Terima kasih telah mengirimkan demo kamu ke <strong>Afterglow Music</strong>!</p>
        
        <p>Kami telah menerima pendaftaran kamu dengan detail sebagai berikut:</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Artist Name:</strong> ${submission.artistName}</p>
          <p><strong>Song Title:</strong> ${submission.songTitle}</p>
          <p><strong>Genre:</strong> ${submission.genre}</p>
        </div>
        
        <p>Tim kami akan mendengarkan karya kamu dan akan menghubungi kamu dalam waktu 7-14 hari kerja jika ada ketertarikan untuk kolaborasi lebih lanjut.</p>
        
        <p>Keep creating amazing music! 🎵</p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        
        <p style="color: #666; font-size: 14px;">
          <strong>Afterglow Music</strong><br>
          Independent Record Label<br>
          <a href="https://afterglow-music.pages.dev" style="color: #ff6b35;">afterglow-music.pages.dev</a>
        </p>
      </div>
    `;

    // Send email to admin
    const adminResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Afterglow Music <submissions@mamangstudio.web.id>',
        to: [env.NOTIFICATION_EMAIL],
        subject: `🎵 New Submission: ${submission.songTitle} by ${submission.artistName}`,
        html: adminEmailHtml,
      }),
    });

    if (!adminResponse.ok) {
      console.error('Failed to send admin email:', await adminResponse.text());
    }

    // Send confirmation email to artist
    const artistResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Afterglow Music <submissions@mamangstudio.web.id>',
        to: [submission.email],
        subject: `Terima kasih telah submit ke Afterglow Music! 🎵`,
        html: artistEmailHtml,
      }),
    });

    if (!artistResponse.ok) {
      console.error('Failed to send artist email:', await artistResponse.text());
    }
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return handleOptions();
    }

    try {
      // ===== SITEMAP ENDPOINT =====
      if (path === '/sitemap.xml' && method === 'GET') {
        const { results: news } = await env.DB.prepare(
          'SELECT slug, updated_at FROM news WHERE is_published = 1 ORDER BY published_at DESC'
        ).all()

        const baseUrl = 'https://afterglow-music.pages.dev'
        const today = new Date().toISOString().split('T')[0]

        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/news</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/submit</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`

        for (const article of news as any[]) {
          const lastmod = article.updated_at ? new Date(article.updated_at).toISOString().split('T')[0] : today
          sitemap += `
  <url>
    <loc>${baseUrl}/news/${article.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
        }

        sitemap += `
</urlset>`

        return new Response(sitemap, {
          headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=3600',
            ...corsHeaders,
          },
        })
      }

      // ===== IMAGE PROXY ENDPOINT =====
      if (path === '/api/proxy-image' && method === 'GET') {
        const imageUrl = url.searchParams.get('url');
        if (!imageUrl) {
          return jsonResponse({ error: 'Missing url parameter' }, 400);
        }

        try {
          const imageResponse = await fetch(imageUrl);
          if (!imageResponse.ok) {
            return jsonResponse({ error: 'Failed to fetch image' }, 502);
          }

          const imageBlob = await imageResponse.blob();
          return new Response(imageBlob, {
            headers: {
              'Content-Type': imageResponse.headers.get('Content-Type') || 'image/jpeg',
              'Cache-Control': 'public, max-age=31536000',
              ...corsHeaders,
            },
          });
        } catch (error: any) {
          return jsonResponse({ error: error.message }, 500);
        }
      }

      // ===== HERO SLIDES ENDPOINTS =====
      if (path === '/api/slides' && method === 'GET') {
        const { results } = await env.DB.prepare(
          'SELECT * FROM hero_slides ORDER BY order_index ASC'
        ).all();
        return jsonResponse(results);
      }

      if (path === '/api/slides' && method === 'POST') {
        const body = await request.json() as any;
        const result = await env.DB.prepare(
          'INSERT INTO hero_slides (artist, title, subtitle, image, cover, is_banner, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)'
        ).bind(
          body.artist,
          body.title,
          body.subtitle,
          body.image,
          body.cover,
          body.is_banner ? 1 : 0,
          body.order_index || 0
        ).run();
        
        return jsonResponse({ id: result.meta.last_row_id, ...body }, 201);
      }

      if (path.match(/^\/api\/slides\/\d+$/) && method === 'PUT') {
        const id = path.split('/').pop();
        const body = await request.json() as any;
        
        await env.DB.prepare(
          'UPDATE hero_slides SET artist = ?, title = ?, subtitle = ?, image = ?, cover = ?, is_banner = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
        ).bind(
          body.artist,
          body.title,
          body.subtitle,
          body.image,
          body.cover,
          body.is_banner ? 1 : 0,
          body.order_index || 0,
          id
        ).run();
        
        return jsonResponse({ id, ...body });
      }

      if (path.match(/^\/api\/slides\/\d+$/) && method === 'DELETE') {
        const id = path.split('/').pop();
        await env.DB.prepare('DELETE FROM hero_slides WHERE id = ?').bind(id).run();
        return jsonResponse({ message: 'Deleted successfully' });
      }

      // ===== RELEASES ENDPOINTS =====
      if (path === '/api/releases' && method === 'GET') {
        const { results } = await env.DB.prepare(
          'SELECT * FROM releases ORDER BY order_index ASC'
        ).all();
        // Convert snake_case to camelCase for frontend
        const releases = results.map((r: any) => ({
          id: r.id,
          artist: r.artist,
          title: r.title,
          artwork: r.artwork,
          listenUrl: r.listen_url,
          order_index: r.order_index
        }));
        return jsonResponse(releases);
      }

      if (path === '/api/releases' && method === 'POST') {
        const body = await request.json() as any;
        
        // Create release
        const result = await env.DB.prepare(
          'INSERT INTO releases (artist, title, artwork, listen_url, order_index) VALUES (?, ?, ?, ?, ?)'
        ).bind(
          body.artist,
          body.title,
          body.artwork,
          body.listenUrl,
          body.order_index || 0
        ).run();
        
        const releaseId = result.meta.last_row_id;
        
        // Auto-create news if checkbox is checked
        if (body.createNews) {
          const slug = `${body.artist}-${body.title}`.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
          
          const newsTitle = `${body.artist} - ${body.title} Out Now!`;
          const newsExcerpt = `Check out the latest release from ${body.artist}: "${body.title}". Available now on all streaming platforms!`;
          const newsContent = `<p>We're excited to announce the release of <strong>"${body.title}"</strong> by <strong>${body.artist}</strong>!</p>
<p>This latest track showcases ${body.artist}'s unique sound and artistic vision. Listen now on your favorite streaming platform.</p>
<p><a href="${body.listenUrl}" target="_blank" rel="noopener noreferrer">🎵 Listen Now</a></p>`;
          
          await env.DB.prepare(
            'INSERT INTO news (title, slug, excerpt, content, cover_image, author, published_at, is_published, release_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
          ).bind(
            newsTitle,
            slug,
            newsExcerpt,
            newsContent,
            body.artwork,
            'Afterglow Music',
            new Date().toISOString(),
            1,
            releaseId
          ).run();
        }
        
        return jsonResponse({ id: releaseId, ...body }, 201);
      }

      if (path.match(/^\/api\/releases\/\d+$/) && method === 'PUT') {
        const id = path.split('/').pop();
        const body = await request.json() as any;
        
        await env.DB.prepare(
          'UPDATE releases SET artist = ?, title = ?, artwork = ?, listen_url = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
        ).bind(
          body.artist,
          body.title,
          body.artwork,
          body.listenUrl,
          body.order_index || 0,
          id
        ).run();
        
        return jsonResponse({ id, ...body });
      }

      if (path.match(/^\/api\/releases\/\d+$/) && method === 'DELETE') {
        const id = path.split('/').pop();
        await env.DB.prepare('DELETE FROM releases WHERE id = ?').bind(id).run();
        return jsonResponse({ message: 'Deleted successfully' });
      }

      // ===== ARTISTS ENDPOINTS =====
      if (path === '/api/artists' && method === 'GET') {
        const { results } = await env.DB.prepare(
          'SELECT * FROM artists ORDER BY order_index ASC'
        ).all();
        return jsonResponse(results);
      }

      if (path === '/api/artists' && method === 'POST') {
        const body = await request.json() as any;
        const result = await env.DB.prepare(
          'INSERT INTO artists (name, genre, description, image, order_index) VALUES (?, ?, ?, ?, ?)'
        ).bind(
          body.name,
          body.genre,
          body.description,
          body.image || null,
          body.order_index || 0
        ).run();
        
        return jsonResponse({ id: result.meta.last_row_id, ...body }, 201);
      }

      if (path.match(/^\/api\/artists\/\d+$/) && method === 'PUT') {
        const id = path.split('/').pop();
        const body = await request.json() as any;
        
        await env.DB.prepare(
          'UPDATE artists SET name = ?, genre = ?, description = ?, image = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
        ).bind(
          body.name,
          body.genre,
          body.description,
          body.image || null,
          body.order_index || 0,
          id
        ).run();
        
        return jsonResponse({ id, ...body });
      }

      if (path.match(/^\/api\/artists\/\d+$/) && method === 'DELETE') {
        const id = path.split('/').pop();
        await env.DB.prepare('DELETE FROM artists WHERE id = ?').bind(id).run();
        return jsonResponse({ message: 'Deleted successfully' });
      }

      // ===== SETTINGS ENDPOINTS =====
      if (path === '/api/settings' && method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM settings').all();
        const settings: Record<string, string> = {};
        results.forEach((row: any) => {
          settings[row.key] = row.value;
        });
        return jsonResponse(settings);
      }

      if (path === '/api/settings' && method === 'PUT') {
        const body = await request.json() as any;
        
        for (const [key, value] of Object.entries(body)) {
          await env.DB.prepare(
            'INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)'
          ).bind(key, value).run();
        }
        
        return jsonResponse({ message: 'Settings updated successfully' });
      }

      // ===== SUBMISSIONS ENDPOINTS =====
      if (path === '/api/submissions' && method === 'GET') {
        const { results } = await env.DB.prepare(
          'SELECT * FROM submissions ORDER BY created_at DESC'
        ).all();
        // Convert snake_case to camelCase
        const submissions = results.map((s: any) => ({
          id: s.id,
          fullName: s.full_name,
          email: s.email,
          phone: s.phone,
          dateOfBirth: s.date_of_birth,
          placeOfBirth: s.place_of_birth,
          artistName: s.artist_name,
          genre: s.genre,
          bio: s.bio,
          catalog: s.catalog,
          songTitle: s.song_title,
          songLink: s.song_link,
          lyrics: s.lyrics,
          notes: s.notes,
          status: s.status,
          createdAt: s.created_at
        }));
        return jsonResponse(submissions);
      }

      if (path === '/api/submissions' && method === 'POST') {
        const body = await request.json() as any;
        const result = await env.DB.prepare(
          `INSERT INTO submissions (
            full_name, email, phone, date_of_birth, place_of_birth,
            artist_name, genre, bio, catalog, song_title, song_link,
            lyrics, notes, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          body.fullName,
          body.email,
          body.phone,
          body.dateOfBirth,
          body.placeOfBirth,
          body.artistName,
          body.genre,
          body.bio,
          body.catalog || null,
          body.songTitle,
          body.songLink,
          body.lyrics || null,
          body.notes || null,
          'pending'
        ).run();
        
        // Send email notification (non-blocking)
        if (env.RESEND_API_KEY && env.NOTIFICATION_EMAIL) {
          await sendEmailNotification(env, body);
        }
        
        return jsonResponse({ 
          id: result.meta.last_row_id, 
          ...body,
          status: 'pending'
        }, 201);
      }

      if (path.match(/^\/api\/submissions\/\d+\/status$/) && method === 'PUT') {
        const id = path.split('/')[3];
        const body = await request.json() as any;
        
        await env.DB.prepare(
          'UPDATE submissions SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
        ).bind(body.status, id).run();
        
        return jsonResponse({ message: 'Status updated successfully' });
      }

      // ===== NEWS ENDPOINTS =====
      if (path === '/api/news' && method === 'GET') {
        const url = new URL(request.url);
        const showAll = url.searchParams.get('all') === 'true';
        
        let query = 'SELECT * FROM news';
        if (!showAll) {
          query += ' WHERE is_published = 1';
        }
        query += ' ORDER BY published_at DESC, created_at DESC';
        
        const { results } = await env.DB.prepare(query).all();
        const news = results.map((n: any) => ({
          id: n.id,
          title: n.title,
          slug: n.slug,
          excerpt: n.excerpt,
          content: n.content,
          coverImage: n.cover_image,
          author: n.author,
          publishedAt: n.published_at,
          isPublished: n.is_published === 1,
          createdAt: n.created_at,
          updatedAt: n.updated_at
        }));
        return jsonResponse(news);
      }

      if (path.match(/^\/api\/news\/[^\/]+$/) && method === 'GET') {
        const slug = path.split('/').pop();
        const { results } = await env.DB.prepare(
          'SELECT * FROM news WHERE slug = ? AND is_published = 1'
        ).bind(slug).all();
        
        if (results.length === 0) {
          return jsonResponse({ error: 'News not found' }, 404);
        }
        
        const n = results[0] as any;
        const news = {
          id: n.id,
          title: n.title,
          slug: n.slug,
          excerpt: n.excerpt,
          content: n.content,
          coverImage: n.cover_image,
          author: n.author,
          publishedAt: n.published_at,
          isPublished: n.is_published === 1,
          createdAt: n.created_at,
          updatedAt: n.updated_at
        };
        return jsonResponse(news);
      }

      if (path === '/api/news' && method === 'POST') {
        const body = await request.json() as any;
        const result = await env.DB.prepare(
          'INSERT INTO news (title, slug, excerpt, content, cover_image, author, published_at, is_published) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        ).bind(
          body.title,
          body.slug,
          body.excerpt,
          body.content,
          body.coverImage || null,
          body.author || 'Afterglow Music',
          body.isPublished ? new Date().toISOString() : null,
          body.isPublished ? 1 : 0
        ).run();
        
        return jsonResponse({ id: result.meta.last_row_id, ...body }, 201);
      }

      if (path.match(/^\/api\/news\/\d+$/) && method === 'PUT') {
        const id = path.split('/').pop();
        const body = await request.json() as any;
        
        await env.DB.prepare(
          'UPDATE news SET title = ?, slug = ?, excerpt = ?, content = ?, cover_image = ?, author = ?, published_at = ?, is_published = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
        ).bind(
          body.title,
          body.slug,
          body.excerpt,
          body.content,
          body.coverImage || null,
          body.author || 'Afterglow Music',
          body.isPublished ? (body.publishedAt || new Date().toISOString()) : null,
          body.isPublished ? 1 : 0,
          id
        ).run();
        
        return jsonResponse({ id, ...body });
      }

      if (path.match(/^\/api\/news\/\d+$/) && method === 'DELETE') {
        const id = path.split('/').pop();
        await env.DB.prepare('DELETE FROM news WHERE id = ?').bind(id).run();
        return jsonResponse({ message: 'Deleted successfully' });
      }

      // 404 Not Found
      return jsonResponse({ error: 'Not Found' }, 404);

    } catch (error: any) {
      console.error('Error:', error);
      return jsonResponse({ error: error.message }, 500);
    }
  },
};
