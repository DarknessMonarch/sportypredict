

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export async function GET() {
  try {
    const response = await fetch(`${SERVER_API}/blog?limit=1000&sort=-publishedAt`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
      signal: AbortSignal.timeout(10000)
    });
    
    if (!response.ok) {
      console.warn('Failed to fetch blog data for sitemap');
      return Response.json({ blogs: [], total: 0 }, { status: 200 });
    }
    
    const data = await response.json();
    
    if (data.success && Array.isArray(data.blogs)) {
      const blogsWithSlugs = data.blogs.map(blog => ({
        ...blog,
        slug: blog.slug || blog.title
          ?.toLowerCase()
          ?.replace(/[^a-z0-9 -]/g, '')
          ?.replace(/\s+/g, '-')
          ?.replace(/-+/g, '-')
          ?.replace(/^-+|-+$/g, '') || 'untitled-blog'
      }));
      
      return Response.json({
        blogs: blogsWithSlugs,
        total: blogsWithSlugs.length,
        generatedAt: new Date().toISOString(),
      });
    }
    
    return Response.json({ blogs: [], total: 0 });
    
  } catch (error) {
    console.error('Error in blog sitemap API:', error);
    return Response.json({ 
      blogs: [], 
      total: 0,
      error: 'Failed to fetch blogs for sitemap',
      generatedAt: new Date().toISOString(),
    }, { status: 200 });
  }
}
