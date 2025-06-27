export function GET() {
  const robotsTxt = `User-agent: *
Allow: /

# Allow important pages
Allow: /page/football
Allow: /page/basketball
Allow: /page/tennis
Allow: /page/day
Allow: /page/blog
Allow: /page/news
Allow: /page/about
Allow: /page/contact

# Disallow admin and private areas
Disallow: /admin
Disallow: /api
Disallow: /page/vip
Disallow: /_next
Disallow: /static

# Sitemap location
Sitemap: https://sportypredict.com/sitemap.xml

# Crawl delay
Crawl-delay: 1`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}