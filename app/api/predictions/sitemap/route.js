const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export async function GET() {
  try {
    if (!SERVER_API) {
      return Response.json({ 
        predictions: [], 
        total: 0,
        error: 'SERVER_API environment variable not configured',
        generatedAt: new Date().toISOString(),
      }, { status: 200 });
    }

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    const dayAfter = new Date(today);
    dayAfter.setDate(today.getDate() + 2);
    const dayAfterStr = dayAfter.toISOString().split('T')[0];
    
    const categories = ['football', 'basketball', 'tennis', 'extra', 'day'];
    const dates = [todayStr, tomorrowStr, dayAfterStr];
    
    let allPredictions = [];
    let fetchStats = {
      successful: 0,
      failed: 0,
      totalRequests: categories.length * dates.length
    };
    
    for (const category of categories) {
      for (const dateStr of dates) {
        try {
          const apiUrl = `${SERVER_API}/predictions/${category}/${dateStr}`;
          
          const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
              'Content-type': 'application/json',
              'User-Agent': 'NextJS-Sitemap-API'
            },
            signal: AbortSignal.timeout(10000)
          });
          
          if (response.ok) {
            const data = await response.json();
            
            if (data.status === "success" && Array.isArray(data.data)) {
              const predictionsWithMeta = data.data.map(prediction => {
                const cleanTeamA = prediction.teamA
                  ?.toLowerCase()
                  ?.replace(/[^a-z0-9\s]/g, '')
                  ?.replace(/\s+/g, '-')
                  ?.replace(/-+/g, '-')
                  ?.replace(/^-|-$/g, '') || 'team-a';
                  
                const cleanTeamB = prediction.teamB
                  ?.toLowerCase()
                  ?.replace(/[^a-z0-9\s]/g, '')
                  ?.replace(/\s+/g, '-')
                  ?.replace(/-+/g, '-')
                  ?.replace(/^-|-$/g, '') || 'team-b';
                
                const slug = `${cleanTeamA}-vs-${cleanTeamB}`;
                
                return {
                  teamA: prediction.teamA,
                  teamB: prediction.teamB,
                  cleanTeamA,
                  cleanTeamB,
                  category,
                  date: dateStr,
                  league: prediction.league,
                  sport: prediction.sport,
                  tip: prediction.tip,
                  time: prediction.time,
                  odd: prediction.odd,
                  updatedAt: prediction.updatedAt || prediction.createdAt || new Date().toISOString(),
                  createdAt: prediction.createdAt || new Date().toISOString(),
                  slug
                };
              });
              
              allPredictions = [...allPredictions, ...predictionsWithMeta];
              fetchStats.successful++;
            } else {
              fetchStats.failed++;
            }
          } else {
            fetchStats.failed++;
          }
        } catch (categoryError) {
          fetchStats.failed++;
        }
      }
    }
    
    const uniquePredictions = allPredictions.filter((prediction, index, self) => 
      index === self.findIndex(p => 
        p.teamA === prediction.teamA && 
        p.teamB === prediction.teamB && 
        p.category === prediction.category &&
        p.date === prediction.date
      )
    );
    
    const sortedPredictions = uniquePredictions.sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      if (a.category !== b.category) return a.category.localeCompare(b.category);
      if (a.time && b.time) return a.time.localeCompare(b.time);
      return 0;
    });
    
    const response = {
      predictions: sortedPredictions,
      total: sortedPredictions.length,
      categories,
      dates,
      fetchStats,
      generatedAt: new Date().toISOString(),
    };
    
    return Response.json(response);
    
  } catch (error) {
    return Response.json({ 
      predictions: [], 
      total: 0,
      error: 'Failed to fetch predictions for sitemap',
      errorDetails: error.message,
      generatedAt: new Date().toISOString(),
    }, { status: 200 });
  }
}