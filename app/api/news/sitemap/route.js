const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;


export async function GET() {
  try {
    const response = await fetch(`${SERVER_API}/news?limit=1000&sort=-publishDate`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
      signal: AbortSignal.timeout(10000)
    });
    
    if (!response.ok) {
      console.warn('Failed to fetch news data for sitemap');
      return Response.json({ articles: [], total: 0 }, { status: 200 });
    }
    
    const data = await response.json();
    
    if (data.success && Array.isArray(data.articles)) {
      const articlesWithSlugs = data.articles.map(article => ({
        ...article,
        slug: article.slug || article.title
          ?.toLowerCase()
          ?.replace(/[^a-z0-9 -]/g, '')
          ?.replace(/\s+/g, '-')
          ?.replace(/-+/g, '-')
          ?.replace(/^-+|-+$/g, '') || 'untitled-article'
      }));
      
      return Response.json({
        articles: articlesWithSlugs,
        total: articlesWithSlugs.length,
        generatedAt: new Date().toISOString(),
      });
    }
    
    return Response.json({ articles: [], total: 0 });
    
  } catch (error) {
    console.error('Error in news sitemap API:', error);
    return Response.json({ 
      articles: [], 
      total: 0,
      error: 'Failed to fetch news for sitemap',
      generatedAt: new Date().toISOString(),
    }, { status: 200 });
  }
}

