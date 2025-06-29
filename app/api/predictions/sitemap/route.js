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
    
    // Generate dates for a full year ahead
    const dates = [];
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    // Process requests in batches to avoid overwhelming the server
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

    // Process each batch sequentially to avoid server overload
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
              
              return {
                teamA: prediction.teamA,
                teamB: prediction.teamB,
                cleanTeamA,
                cleanTeamB,
                category: prediction.category || 'general',
                date: dateStr,
                league: prediction.league,
                sport: prediction.sport,
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
      
      // Wait for current batch to complete
      const batchResults = await Promise.allSettled(batchPromises);
      
      // Process batch results
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
      
      // Small delay between batches to be respectful to the server
      if (fetchStats.batchesProcessed < batches.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    // Enhanced deduplication logic
    const uniquePredictions = allPredictions.filter((prediction, index, self) => 
      index === self.findIndex(p => 
        p.teamA === prediction.teamA && 
        p.teamB === prediction.teamB && 
        p.category === prediction.category &&
        p.date === prediction.date &&
        // For VIP predictions, also check stake and vipSlip
        (p.category !== 'vip' || (p.stake === prediction.stake && p.vipSlip === prediction.vipSlip))
      )
    );
    
    // Enhanced sorting with multiple criteria
    const sortedPredictions = uniquePredictions.sort((a, b) => {
      // First sort by date
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      
      // Then by category (prioritize non-VIP for public sitemap)
      if (a.category !== b.category) {
        if (a.category === 'vip' && b.category !== 'vip') return 1;
        if (b.category === 'vip' && a.category !== 'vip') return -1;
        return a.category.localeCompare(b.category);
      }
      
      // Then by time if available
      if (a.time && b.time) {
        const timeA = new Date(a.time).getTime();
        const timeB = new Date(b.time).getTime();
        if (timeA !== timeB) return timeA - timeB;
      }
      
      // Finally by team names for consistency
      if (a.teamA !== b.teamA) return a.teamA.localeCompare(b.teamA);
      return a.teamB.localeCompare(b.teamB);
    });
    
    // Group predictions by category and date for better analytics
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
      predictions: sortedPredictions,
      total: sortedPredictions.length,
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