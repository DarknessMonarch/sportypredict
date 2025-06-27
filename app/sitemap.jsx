async function getMatchUrls() {
  try {
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000' 
      : (process.env.NEXT_PUBLIC_API_URL || 'https://sportypredict.com');
    
    const apiUrl = `${baseUrl}/api/predictions/sitemap`;
    
    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 },
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'NextJS-Sitemap-Generator'
      },
      signal: AbortSignal.timeout(15000)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Failed to fetch match data for sitemap. Status: ${response.status}, Body: ${errorText}`);
      return [];
    }
    
    const data = await response.json();
    const predictions = data.predictions || [];
    
    if (predictions.length === 0) {
      return [];
    }
    
    const matchUrls = predictions.map(prediction => {
      const slug = prediction.slug || `${prediction.cleanTeamA}-vs-${prediction.cleanTeamB}`;
      const category = prediction.category?.toLowerCase() || 'football';
      
      const url = `https://sportypredict.com/page/${category}/single/${slug}?date=${prediction.date}`;
      
      return {
        url,
        lastModified: new Date(prediction.updatedAt || prediction.createdAt || prediction.date),
        changeFrequency: 'daily',
        priority: 0.7,
      };
    });
    
    return matchUrls;
    
  } catch (error) {
    console.error('Error fetching predictions for sitemap:', error);
    return [];
  }
}

async function getNewsUrls() {
  try {
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000' 
      : (process.env.NEXT_PUBLIC_API_URL || 'https://sportypredict.com');
    
    const apiUrl = `${baseUrl}/api/news/sitemap`;
    
    const response = await fetch(apiUrl, {
      next: { revalidate: 7200 },
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'NextJS-Sitemap-Generator'
      },
      signal: AbortSignal.timeout(15000)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Failed to fetch news data for sitemap. Status: ${response.status}`);
      return [];
    }
    
    const data = await response.json();
    const articles = data.articles || [];
    
    const newsUrls = articles.map(article => {
      const slug = article.slug || article.title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');

      return {
        url: `https://sportypredict.com/page/news?article=${slug}`,
        lastModified: new Date(article.updatedAt || article.publishDate || article.createdAt),
        changeFrequency: 'daily',
        priority: article.featured ? 0.8 : 0.7,
      };
    });
    
    return newsUrls;
    
  } catch (error) {
    console.error('Error fetching news for sitemap:', error);
    return [];
  }
}

async function getBlogUrls() {
  try {
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000' 
      : (process.env.NEXT_PUBLIC_API_URL || 'https://sportypredict.com');
    
    const apiUrl = `${baseUrl}/api/blog/sitemap`;
    
    const response = await fetch(apiUrl, {
      next: { revalidate: 86400 },
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'NextJS-Sitemap-Generator'
      },
      signal: AbortSignal.timeout(15000)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Failed to fetch blog data for sitemap. Status: ${response.status}`);
      return [];
    }
    
    const data = await response.json();
    const blogs = data.blogs || [];
    
    if (blogs.length === 0) {
      return [];
    }
    
    const blogUrls = blogs.map(blog => {
      const slug = blog.slug || blog.title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');

      return {
        url: `https://sportypredict.com/page/blog?blog=${slug}`,
        lastModified: new Date(blog.updatedAt || blog.publishedAt || blog.createdAt),
        changeFrequency: blog.featured ? 'weekly' : 'monthly',
        priority: blog.featured ? 0.8 : 0.6,
      };
    });
    
    return blogUrls;
    
  } catch (error) {
    console.error('Error fetching blogs for sitemap:', error);
    return [];
  }
}

async function getCategoryUrls() {
  try {
    const categoryUrls = [];
    
    const newsCategories = ['football', 'basketball', 'tennis'];
    newsCategories.forEach(category => {
      categoryUrls.push({
        url: `https://sportypredict.com/page/news?category=${category}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
      });
    });
    
    const blogCategories = ['Sports', 'Betting', 'Analysis', 'Tips'];
    blogCategories.forEach(category => {
      categoryUrls.push({
        url: `https://sportypredict.com/page/blog?category=${encodeURIComponent(category)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    });
    
    return categoryUrls;
    
  } catch (error) {
    console.error('Error generating category URLs:', error);
    return [];
  }
}

export default async function sitemap() {
  const baseUrl = "https://sportypredict.com";

  const mainRoutes = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  const sportRoutes = [
    {
      url: `${baseUrl}/page/day`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/page/football`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/page/basketball`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/page/tennis`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/page/extra`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
  ];

  const contentRoutes = [
    {
      url: `${baseUrl}/page/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/page/news`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  const vipRoutes = [
    {
      url: `${baseUrl}/page/vip`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.75,
    },
  ];

  const staticRoutes = [
    {
      url: `${baseUrl}/page/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/page/offers`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/page/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/page/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/page/disclaimer`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/page/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/page/refund`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const [matchUrls, blogUrls, newsUrls, categoryUrls] = await Promise.allSettled([
    getMatchUrls(),
    getBlogUrls(), 
    getNewsUrls(),
    getCategoryUrls()
  ]);

  const matchUrlsResult = matchUrls.status === 'fulfilled' ? matchUrls.value : [];
  const blogUrlsResult = blogUrls.status === 'fulfilled' ? blogUrls.value : [];
  const newsUrlsResult = newsUrls.status === 'fulfilled' ? newsUrls.value : [];
  const categoryUrlsResult = categoryUrls.status === 'fulfilled' ? categoryUrls.value : [];

  const allRoutes = [
    ...mainRoutes,
    ...sportRoutes,
    ...contentRoutes,
    ...vipRoutes,
    ...staticRoutes,
    ...categoryUrlsResult,
    ...matchUrlsResult,
    ...blogUrlsResult,
    ...newsUrlsResult,
  ];

  return allRoutes;
}