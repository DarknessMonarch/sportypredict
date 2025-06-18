export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/page/football',
          '/page/basketball', 
          '/page/tennis',
          '/page/day',
          '/page/extra',
          '/page/blog',
          '/page/news',
          '/page/vip',
          '/page/contact',
          '/page/offers',
          '/page/about',
          '/page/terms',
          '/page/disclaimer',
          '/page/privacy',
          '/page/refund',
          '/sitemap.xml', 
        ],
        disallow: [
          '/',  
          '/authentication/*',
          '/api/*',
          '/page/payment',
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