export default async function sitemap() {
  const baseUrl = "https://sportypredict.433tips.com";

  const authRoutes = [
    "/authentication/login",
    "/authentication/verification",
    "/authentication/signup",
    "/authentication/reset",
    "/authentication/resetCode",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.8,
  }));

  const mainRoutes = [
    {
      url: `${baseUrl}/page/football`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 0.9,
    },
  ];

  const sportRoutes = [
    {
      url: `${baseUrl}/page/day`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/page/basketball`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/page/extra`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/page/football`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/page/tennis`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/page/blog`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/page/news`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1.0,
    },
  ];

  const vipRoutes = [
    {
      url: `${baseUrl}/page/vip`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1.0,
    },
  ];

  const paymentRoutes = [
    {
      url: `${baseUrl}/page/payment`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  const staticRoutes = [
    {
      url: `${baseUrl}/page/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/page/offers`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/page/about`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/page/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/page/disclaimer`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/page/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/page/refund`,
      lastModified: new Date(),
      changeFrequency: "yearly",
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
