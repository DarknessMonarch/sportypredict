import { createMatchSlug } from '@/app/utility/UrlSlug';

async function getMatchUrls() {
  try {
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000' 
      : (process.env.NEXT_PUBLIC_API_URL || 'https://sportypredict.com');
    
    const timestamp = Date.now();
    const apiUrl = `${baseUrl}/api/predictions/sitemap?t=${timestamp}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);
    
    const response = await fetch(apiUrl, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'NextJS-Sitemap-Generator',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    const predictions = data.predictions || [];
    
    if (predictions.length === 0) {
      console.warn('Sitemap: No predictions returned from API');
      return [];
    }
    
    const matchUrls = predictions.map(prediction => {
      // Use original team names instead of cleanTeamA/cleanTeamB
      const teamA = prediction.teamA || prediction.homeTeam || prediction.cleanTeamA;
      const teamB = prediction.teamB || prediction.awayTeam || prediction.cleanTeamB;
      
      // Create slug using the proper slug generation function
      const slug = prediction.slug || createMatchSlug(teamA, teamB);
      
      const getSportPath = (sport, category) => {
        if (category === 'bet-of-the-day') return 'bet-of-the-day';
        if (category === 'vip') return 'vip';
        
        const sportMap = {
          'football': 'football',
          'basketball': 'basketball', 
          'tennis': 'tennis',
          'soccer': 'football'
        };
        
        return sportMap[sport?.toLowerCase()] || sportMap[category?.toLowerCase()] || 'football';
      };
      
      const sportPath = getSportPath(prediction.sport, prediction.category);
      
      const url = `https://sportypredict.com/${sportPath}/prediction/${slug}?date=${prediction.date}`;
      
      let lastModified;
      if (prediction.time) {
        lastModified = new Date(prediction.time);
      } else if (prediction.date) {
        lastModified = new Date(prediction.date);
      } else {
        lastModified = new Date(prediction.updatedAt || prediction.createdAt || new Date());
      }
      
      const today = new Date();
      if (lastModified < today && prediction.date && new Date(prediction.date) >= today) {
        lastModified = today;
      }
      
      return {
        url,
        lastModified,
        changeFrequency: 'daily',
        priority: 0.7,
      };
    });
    
    return matchUrls;
    
  } catch (error) {
    return [];
  }
}

async function getNewsUrls() {
  try {
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000' 
      : (process.env.NEXT_PUBLIC_API_URL || 'https://sportypredict.com');
    
    const timestamp = Date.now();
    const apiUrl = `${baseUrl}/api/news/sitemap?t=${timestamp}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    const response = await fetch(apiUrl, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'NextJS-Sitemap-Generator',
        'Cache-Control': 'no-cache'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn('Sitemap: Failed to fetch news API:', response.status);
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
        url: `https://sportypredict.com/news?article=${slug}`,
        lastModified: new Date(article.updatedAt || article.publishDate || article.createdAt),
        changeFrequency: 'daily',
        priority: article.featured ? 0.8 : 0.7,
      };
    });
    
    return newsUrls;
    
  } catch (error) {
    console.error('Sitemap: Error fetching news URLs:', error);
    return [];
  }
}

async function getBlogUrls() {
  try {
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000' 
      : (process.env.NEXT_PUBLIC_API_URL || 'https://sportypredict.com');
    
    const timestamp = Date.now();
    const apiUrl = `${baseUrl}/api/blog/sitemap?t=${timestamp}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    const response = await fetch(apiUrl, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'NextJS-Sitemap-Generator',
        'Cache-Control': 'no-cache'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn('Sitemap: Failed to fetch blog API:', response.status);
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
        url: `https://sportypredict.com/blog?blog=${slug}`,
        lastModified: new Date(blog.updatedAt || blog.publishedAt || blog.createdAt),
        changeFrequency: blog.featured ? 'weekly' : 'monthly',
        priority: blog.featured ? 0.8 : 0.6,
      };
    });
    
    return blogUrls;
    
  } catch (error) {
    console.error('Sitemap: Error fetching blog URLs:', error);
    return [];
  }
}

async function getCategoryUrls() {
  try {
    const categoryUrls = [];
    
    const newsCategories = ['football', 'basketball', 'tennis'];
    newsCategories.forEach(category => {
      categoryUrls.push({
        url: `https://sportypredict.com/news?category=${category}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
      });
    });
    
    const blogCategories = ['Sports', 'Betting', 'Analysis', 'Tips'];
    blogCategories.forEach(category => {
      categoryUrls.push({
        url: `https://sportypredict.com/blog?category=${encodeURIComponent(category)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    });
    
    return categoryUrls;
    
  } catch (error) {
    console.error('Sitemap: Error generating category URLs:', error);
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
      url: `${baseUrl}/bet-of-the-day`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/football`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/basketball`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tennis`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  const contentRoutes = [
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  const vipRoutes = [
    {
      url: `${baseUrl}/vip`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.75,
    },
  ];

  const staticRoutes = [
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/offers`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/refund`,
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

  const uniqueRoutes = allRoutes.filter((route, index, self) => 
    index === self.findIndex(r => r.url === route.url)
  );

  return uniqueRoutes;
}