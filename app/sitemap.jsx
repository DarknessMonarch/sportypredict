export default async function sitemap() {
  const baseUrl = 'https://sportypredict.433tips.com';
  
  const authRoutes = [
    '/authentication/login',
    '/authentication/verification',
    '/authentication/signup',
    '/authentication/reset',
    '/authentication/forgot',
    '/authentication/resetCode',
  ].map(path => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.8,
  }));
  
  const mainRoutes = [
    {
      url: `${baseUrl}/page/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.9,
    },
  ];
  
  const sportRoutes = [
    {
      url: `${baseUrl}/page/day`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/page/football`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/page/basketball`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/page/extra`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/page/winning`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.9,
    },
  ];
  
  const vipRoutes = [
    {
      url: `${baseUrl}/page/vip`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.9,
    },
  ];
  
  const paymentRoutes = [
    {
      url: `${baseUrl}/page/payment`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/page/payment/manual`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.9,
    },
  ];
  
  const staticRoutes = [
    {
      url: `${baseUrl}/page/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/page/offer`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/page/about`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/page/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.9,
    },
  ];
  
  return [
    ...authRoutes,
    ...mainRoutes,
    ...sportRoutes,
    ...vipRoutes,
    ...paymentRoutes,
    ...staticRoutes,
  ];
}