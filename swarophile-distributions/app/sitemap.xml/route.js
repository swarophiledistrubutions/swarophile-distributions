export async function GET() {
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://swarophile-distributions.vercel.app</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>yearly</changefreq>
      <priority>1.0</priority>
    </url>
  </urlset>`;

  return new Response(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}