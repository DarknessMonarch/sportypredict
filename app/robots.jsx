export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/page/football',
          '/page/about',
          '/page/terms',
          '/page/contact',
          '/page/day',
          '/page/basketball',
          '/page/extra',
          '/page/vip',
          '/page/offer',
          '/page/vip',
          '/sitemap.xml', 
        ],
        disallow: [
          '/',  
          '/authentication/*',
          '/api/*',
          '/page/payment/*',
          '/page/settings/*',
          '/not-found',
          '/*.json$', 
          '/private/',
        ],
        crawlDelay: 2
      },
      {
        userAgent: 'GPTBot',
        disallow: ['/']
      },
      {
        userAgent: 'CCBot',
        disallow: ['/']
      }
    ],
    sitemap: 'https://sportypredict.433tips.com/sitemap.xml',
    host: 'https://sportypredict.433tips.com'
  }
}