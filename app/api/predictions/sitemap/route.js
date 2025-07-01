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
    
    const dates = [];
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    const batchSize = 10; // Process 10 dates at a time
    const batches = [];
    
    for (let i = 0; i < dates.length; i += batchSize) {
      batches.push(dates.slice(i, i + batchSize));
    }

    let allPredictions = [];
    let fetchStats = {
      successful: 0,
      failed: 0,
      totalRequests: dates.length,
      dateResults: {},
      batchesProcessed: 0,
      totalBatches: batches.length
    };

    for (const batch of batches) {
      const batchPromises = batch.map(async (dateStr) => {
      try {
        const apiUrl = `${SERVER_API}/predictions/all/${dateStr}`;
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
            'User-Agent': 'NextJS-Sitemap-API'
          },
          signal: AbortSignal.timeout(30000) // Increased timeout for year-long fetch
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
              
              const getSportPath = (sport, category) => {
                if (category === 'bet-of-the-day') return 'day';
                if (category === 'vip') return 'vip';
                
                const sportMap = {
                  'football': 'football',
                  'basketball': 'basketball', 
                  'tennis': 'tennis',
                  'soccer': 'football' 
                };
                
                return sportMap[sport?.toLowerCase()] || 'football';
              };
              
              const sportPath = getSportPath(prediction.sport, prediction.category);
              
              return {
                teamA: prediction.teamA,
                teamB: prediction.teamB,
                cleanTeamA,
                cleanTeamB,
                category: prediction.category || 'general',
                date: dateStr,
                league: prediction.league,
                sport: prediction.sport,
                sportPath, // Add sport path for URL generation
                tip: prediction.tip,
                time: prediction.time,
                odd: prediction.odd,
                stake: prediction.stake, // Include stake for VIP predictions
                vipSlip: prediction.vipSlip, // Include VIP slip info
                updatedAt: prediction.updatedAt || prediction.createdAt || new Date().toISOString(),
                createdAt: prediction.createdAt || new Date().toISOString(),
                slug
              };
            });
            
            fetchStats.dateResults[dateStr] = {
              success: true,
              count: predictionsWithMeta.length,
              totalCount: data.totalCount || predictionsWithMeta.length
            };
            
            return { success: true, predictions: predictionsWithMeta, date: dateStr };
          } else {
            fetchStats.dateResults[dateStr] = {
              success: false,
              error: 'Invalid data format',
              count: 0
            };
            return { success: false, predictions: [], date: dateStr };
          }
        } else {
          const errorText = await response.text().catch(() => 'Unknown error');
          fetchStats.dateResults[dateStr] = {
            success: false,
            error: `HTTP ${response.status}: ${errorText}`,
            count: 0
          };
          return { success: false, predictions: [], date: dateStr };
        }
      } catch (error) {
        fetchStats.dateResults[dateStr] = {
          success: false,
          error: error.message,
          count: 0
        };
        return { success: false, predictions: [], date: dateStr };
      }
          });
      
      const batchResults = await Promise.allSettled(batchPromises);
      
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          if (result.value.success) {
            allPredictions = [...allPredictions, ...result.value.predictions];
            fetchStats.successful++;
          } else {
            fetchStats.failed++;
          }
        } else {
          fetchStats.failed++;
          const dateStr = batch[index];
          fetchStats.dateResults[dateStr] = {
            success: false,
            error: result.reason?.message || 'Promise rejected',
            count: 0
          };
        }
      });
      
      fetchStats.batchesProcessed++;
      
      if (fetchStats.batchesProcessed < batches.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    const uniquePredictions = allPredictions.filter((prediction, index, self) => 
      index === self.findIndex(p => 
        p.teamA === prediction.teamA && 
        p.teamB === prediction.teamB && 
        p.category === prediction.category &&
        p.date === prediction.date &&
        (p.category !== 'vip' || (p.stake === prediction.stake && p.vipSlip === prediction.vipSlip))
      )
    );
    
    const sortedPredictions = uniquePredictions.sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      
      if (a.category !== b.category) {
        if (a.category === 'vip' && b.category !== 'vip') return 1;
        if (b.category === 'vip' && a.category !== 'vip') return -1;
        return a.category.localeCompare(b.category);
      }
      
      if (a.time && b.time) {
        const timeA = new Date(a.time).getTime();
        const timeB = new Date(b.time).getTime();
        if (timeA !== timeB) return timeA - timeB;
      }
      
      if (a.teamA !== b.teamA) return a.teamA.localeCompare(b.teamA);
      return a.teamB.localeCompare(b.teamB);
    });
    
    const urlReadyPredictions = sortedPredictions.map(prediction => ({
      ...prediction,
      url: `/page/${prediction.sportPath}/single/${prediction.slug}?date=${prediction.date}`,
    }));
    
    const predictionsByCategory = sortedPredictions.reduce((acc, pred) => {
      const key = pred.category;
      if (!acc[key]) acc[key] = [];
      acc[key].push(pred);
      return acc;
    }, {});
    
    const predictionsByDate = sortedPredictions.reduce((acc, pred) => {
      const key = pred.date;
      if (!acc[key]) acc[key] = [];
      acc[key].push(pred);
      return acc;
    }, {});
    
    const response = {
      predictions: urlReadyPredictions,
      total: urlReadyPredictions.length,
      dates,
      fetchStats,
      analytics: {
        predictionsByCategory: Object.keys(predictionsByCategory).map(category => ({
          category,
          count: predictionsByCategory[category].length
        })),
        predictionsByDate: Object.keys(predictionsByDate).map(date => ({
          date,
          count: predictionsByDate[date].length
        })),
        duplicatesRemoved: allPredictions.length - uniquePredictions.length
      },
      generatedAt: new Date().toISOString(),
    };
    
    return Response.json(response);
    
  } catch (error) {
    console.error('Sitemap API Error:', error);
    
    return Response.json({ 
      predictions: [], 
      total: 0,
      error: 'Failed to fetch predictions for sitemap',
      errorDetails: error.message,
      generatedAt: new Date().toISOString(),
    }, { status: 200 });
  }
}