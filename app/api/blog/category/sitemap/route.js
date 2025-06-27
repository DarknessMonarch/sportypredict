const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export async function GET() {
  try {
    const response = await fetch(`${SERVER_API}/blog/categories`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
      signal: AbortSignal.timeout(5000)
    });
    
    if (!response.ok) {
      console.warn('Failed to fetch blog categories');
      return Response.json({ categories: [] }, { status: 200 });
    }
    
    const data = await response.json();
    return Response.json(data);
    
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return Response.json({ 
      categories: [],
      error: 'Failed to fetch categories'
    }, { status: 200 });
  }
}

