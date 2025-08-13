// api/predictions/sitemap/route.js
const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

// Force timezone to Africa/Nairobi for consistent date handling
const TIMEZONE = 'Africa/Nairobi';

function getDateString(date) {
  // Use Intl.DateTimeFormat to get date in specific timezone
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(date);
}

function getCurrentLocalDate() {
  // Use Intl.DateTimeFormat to get date in specific timezone
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(now);
}

function getNairobiDate(dateInput) {
  // Create a date object and convert to Nairobi timezone
  let date;
  if (typeof dateInput === 'string') {
    date = new Date(dateInput);
  } else {
    date = new Date(dateInput);
  }
  
  // Convert to Nairobi timezone
  const nairobiDate = new Date(date.toLocaleString('en-US', { timeZone: TIMEZONE }));
  return nairobiDate;
}

function createTeamSlug(teamName) {
  if (!teamName) return '';
  return encodeURIComponent(teamName.toString().trim());
}

function createMatchSlug(teamA, teamB) {
  const slugA = createTeamSlug(teamA);
  const slugB = createTeamSlug(teamB);
  return `${slugA}-vs-${slugB}`;
}

export async function GET() {
  try {
    if (!SERVER_API) {
      return Response.json({ 
        predictions: [], 
        total: 0,
        error: 'SERVER_API environment variable not configured',
        generatedAt: new Date().toISOString(),
        timezone: TIMEZONE,
        currentLocalDate: getCurrentLocalDate()
      }, { status: 200 });
    }

    const currentDate = getCurrentLocalDate();
    const dates = [];
    
    // Generate dates in Nairobi timezone
    for (let i = 0; i < 365; i++) {
      const nairobiNow = getNairobiDate(new Date());
      nairobiNow.setDate(nairobiNow.getDate() + i);
      const dateStr = getDateString(nairobiNow);
      dates.push(dateStr);
    }
    
    const batchSize = 10; 
    const batches = [];
    
    for (let i = 0; i < dates.length; i += batchSize) {
      batches.push(dates.slice(i, i + batchSize));
    }

    let allPredictions = [];

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
            signal: AbortSignal.timeout(30000) 
          });
          
          if (response.ok) {
            const data = await response.json();
            
            if (data.status === "success" && Array.isArray(data.data)) {
              const predictionsWithMeta = data.data.map(prediction => {
                // Keep original team names for server compatibility
                const teamA = prediction.teamA || 'team-a';
                const teamB = prediction.teamB || 'team-b';
                
                // Create URL-safe slug using original team names
                const slug = createMatchSlug(teamA, teamB);
                
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
                
                // Convert all dates to Nairobi timezone
                let updatedAt = prediction.time || prediction.updatedAt || prediction.createdAt || new Date().toISOString();
                if (typeof updatedAt === 'string') {
                  updatedAt = getNairobiDate(updatedAt).toISOString();
                }
                
                let createdAt = prediction.createdAt || new Date().toISOString();
                if (typeof createdAt === 'string') {
                  createdAt = getNairobiDate(createdAt).toISOString();
                }
                
                return {
                  teamA: teamA,
                  teamB: teamB,
                  category: prediction.category || 'general',
                  date: dateStr,
                  league: prediction.league,
                  sport: prediction.sport,
                  sportPath,
                  tip: prediction.tip,
                  time: prediction.time ? getNairobiDate(prediction.time).toISOString() : null,
                  odd: prediction.odd,
                  stake: prediction.stake, 
                  vipSlip: prediction.vipSlip, 
                  updatedAt,
                  createdAt,
                  slug
                };
              });
              
              return predictionsWithMeta;
            }
          }
          
          return [];
        } catch (error) {
          console.error(`Error fetching predictions for ${dateStr}:`, error.message);
          return [];
        }
      });
      
      const batchResults = await Promise.allSettled(batchPromises);
      
      batchResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          allPredictions = [...allPredictions, ...result.value];
        }
      });
      
      // Small delay between batches
      if (batches.indexOf(batch) < batches.length - 1) {
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
      url: `/${prediction.sportPath}/prediction/${prediction.slug}?date=${prediction.date}`,
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
      currentDate,
      timezone: TIMEZONE,
      dates: dates.slice(0, 10),
      analytics: {
        predictionsByCategory: Object.keys(predictionsByCategory).map(category => ({
          category,
          count: predictionsByCategory[category].length
        })),
        predictionsByDate: Object.keys(predictionsByDate).map(date => ({
          date,
          count: predictionsByDate[date].length
        })),
        duplicatesRemoved: allPredictions.length - uniquePredictions.length,
        todaysPredictions: predictionsByDate[currentDate]?.length || 0
      },
      generatedAt: getNairobiDate(new Date()).toISOString(),
    };

    return Response.json(response);
    
  } catch (error) {
    console.error('Sitemap API Error:', error);
    return Response.json({ 
      predictions: [], 
      total: 0,
      error: 'Failed to fetch predictions for sitemap',
      errorDetails: error.message,
      timezone: TIMEZONE,
      currentLocalDate: getCurrentLocalDate(),
      generatedAt: getNairobiDate(new Date()).toISOString(),
    }, { status: 200 });
  }
}