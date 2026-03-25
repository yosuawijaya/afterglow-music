// Script to generate sitemap dynamically from database
// Run this periodically or after adding new content

interface News {
  slug: string
  updatedAt: string
}

export async function generateSitemap(db: D1Database): Promise<string> {
  // Fetch all published news
  const { results: news } = await db.prepare(
    'SELECT slug, updated_at FROM news WHERE is_published = 1 ORDER BY published_at DESC'
  ).all() as { results: News[] }

  const baseUrl = 'https://afterglow-music.pages.dev'
  const today = new Date().toISOString().split('T')[0]

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- News Page -->
  <url>
    <loc>${baseUrl}/news</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Submit Page -->
  <url>
    <loc>${baseUrl}/submit</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- News Articles -->`

  for (const article of news) {
    const lastmod = article.updatedAt ? new Date(article.updatedAt).toISOString().split('T')[0] : today
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

  return sitemap
}

// Add endpoint to workers/index.ts:
// if (path === '/sitemap.xml' && method === 'GET') {
//   const sitemap = await generateSitemap(env.DB)
//   return new Response(sitemap, {
//     headers: {
//       'Content-Type': 'application/xml',
//       'Cache-Control': 'public, max-age=3600',
//       ...corsHeaders,
//     },
//   })
// }
