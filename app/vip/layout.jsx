import { headers } from 'next/headers';

export async function generateMetadata({ params, searchParams }, parent) {
  const { slug } = await params;
  const date = searchParams?.date;
  
  let sport = 'football';
  
  try {
    const headersList = await headers();
    const pathname = headersList.get('x-pathname') || headersList.get('referer') || '';
    
    const sportMatch = pathname.match(/\/([^\/]+)\/prediction/);
    if (sportMatch && sportMatch[1]) {
      sport = sportMatch[1];
    } else if (params?.sport) {
      const resolvedParams = await params;
      sport = resolvedParams.sport;
    }
  } catch (error) {
    sport = 'football';
  }
  
  const teamNames = slug?.split('-vs-') || [];
  const teamA = teamNames[0]?.replace(/[-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Team A';
  const teamB = teamNames[1]?.replace(/[-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Team B';
  
  const matchDate = date ? new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long', 
    year: 'numeric'
  }) : 'Today';
  
  const sportConfig = {
    football: {
      title: `${teamA} vs ${teamB} Football Prediction & Betting Tips - ${matchDate}`,
      description: `Expert ${teamA} vs ${teamB} football prediction and betting tips for ${matchDate}. Get match preview, head-to-head stats, and best soccer betting odds.`,
      keywords: [
        `${teamA} vs ${teamB}`, `${teamA} ${teamB} prediction`, 
        `${teamA} vs ${teamB} betting tips`, `${teamA} ${teamB} odds`,
        'football prediction', 'soccer betting tips', 'match preview', 'football tips'
      ]
    },
    basketball: {
      title: `${teamA} vs ${teamB} Basketball Prediction & NBA Betting Tips - ${matchDate}`,
      description: `Expert ${teamA} vs ${teamB} basketball prediction and NBA betting tips for ${matchDate}. Get match analysis, player stats, and best basketball betting odds.`,
      keywords: [
        `${teamA} vs ${teamB}`, `${teamA} ${teamB} NBA`, `${teamA} ${teamB} basketball`,
        `${teamA} vs ${teamB} prediction`, 'NBA betting tips', 'basketball prediction', 'NBA tips'
      ]
    },
    tennis: {
      title: `${teamA} vs ${teamB} Tennis Prediction & Betting Tips - ${matchDate}`,
      description: `Expert ${teamA} vs ${teamB} tennis prediction and betting tips for ${matchDate}. Get match analysis, head-to-head record, and best tennis betting odds.`,
      keywords: [
        `${teamA} vs ${teamB}`, `${teamA} ${teamB} tennis`, 
        `${teamA} vs ${teamB} prediction`, 'tennis betting tips', 'ATP WTA prediction', 'tennis tips'
      ]
    },
     "bet-of-the-day": {
      title: `${teamA} vs ${teamB} - Bet of the Day Prediction - ${matchDate}`,
      description: `Today's best bet: ${teamA} vs ${teamB} prediction for ${matchDate}. Expert analysis and high-confidence betting tips.`,
      keywords: [
        `${teamA} vs ${teamB}`, 'bet of the day', `${teamA} ${teamB} prediction`, 
        'daily betting tip', 'best bet today', 'high confidence bet'
      ]
    }
  };
  
  const config = sportConfig[sport] || sportConfig.football;
  const canonicalUrl = `https://sportypredict.com/${sport}/prediction/${slug}${date ? `?date=${date}` : ''}`;
  
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    
    openGraph: {
      title: config.title + ' | SportyPredict',
      description: config.description,
      url: canonicalUrl,
      type: 'article',
      images: [{
        url: `https://sportypredict.com/assets/banner.png`,
        width: 1200,
        height: 630,
        alt: `${teamA} vs ${teamB} - SportyPredict ${sport.charAt(0).toUpperCase() + sport.slice(1)}`,
      }],
      article: {
        publishedTime: date ? new Date(date).toISOString() : new Date().toISOString(),
        section: sport.charAt(0).toUpperCase() + sport.slice(1),
        tags: config.keywords
      }
    },
    
    twitter: {
      title: config.title,
      description: config.description,
      card: 'summary_large_image'
    },
    
    alternates: {
      canonical: canonicalUrl,
    },
    
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  };
}

export default async function MatchLayout({ children, params, searchParams }) {
  const { slug } = await params;
  const date = searchParams?.date;
  
  let sport = (await params)?.sport || 'football';
  
  const teamNames = slug?.split('-vs-') || [];
  const teamA = teamNames[0]?.replace(/[-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Team A';
  const teamB = teamNames[1]?.replace(/[-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Team B';
  
  const startDate = date ? new Date(date) : new Date();
  const startDateISO = startDate.toISOString();
  
  const getVenueName = (sport) => {
    switch(sport) {
      case 'football': return 'Football Stadium';
      case 'basketball': return 'Basketball Arena';
      case 'tennis': return 'Tennis Court';
      default: return 'Sports Venue';
    }
  };
  
  const matchSchema = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `${teamA} vs ${teamB}`,
    description: `${teamA} vs ${teamB} ${sport} match prediction and betting tips`,
    sport: sport.charAt(0).toUpperCase() + sport.slice(1),
    startDate: startDateISO, 
    competitor: [
      {
        "@type": "SportsTeam",
        name: teamA
      },
      {
        "@type": "SportsTeam", 
        name: teamB
      }
    ],
    location: {
      "@type": "Place",
      name: getVenueName(sport),
      address: {
        "@type": "PostalAddress",
        addressCountry: "Global"
      }
    },
    organizer: {
      "@type": "Organization",
      name: "SportyPredict",
      url: "https://sportypredict.com"
    },
    url: `https://sportypredict.com/${sport}/prediction/${slug}${date ? `?date=${date}` : ''}`,
    image: "https://sportypredict.com/assets/banner.png",
    offers: { 
      "@type": "Offer",
      description: "Betting predictions and tips",
      url: `https://sportypredict.com/${sport}/prediction/${slug}${date ? `?date=${date}` : ''}`,
      seller: {
        "@type": "Organization",
        name: "SportyPredict"
      }
    },
    performer: [
      {
        "@type": "SportsTeam",
        name: teamA
      },
      {
        "@type": "SportsTeam",
        name: teamB
      }
    ],
    eventStatus: "https://schema.org/EventScheduled"
  };
  
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${teamA} vs ${teamB} Prediction & Betting Tips`,
    description: `Expert ${sport} prediction and betting tips for ${teamA} vs ${teamB}`,
    author: {
      "@type": "Organization",
      name: "SportyPredict",
      url: "https://sportypredict.com"
    },
    publisher: {
      "@type": "Organization",
      name: "SportyPredict",
      logo: {
        "@type": "ImageObject",
        url: "https://sportypredict.com/assets/logo.png",
        width: 400,
        height: 400
      }
    },
    datePublished: startDateISO,
    dateModified: new Date().toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://sportypredict.com/${sport}/prediction/${slug}${date ? `?date=${date}` : ''}`
    },
    about: {
      "@type": "SportsEvent",
      name: `${teamA} vs ${teamB}`,
      startDate: startDateISO
    },
    image: {
      "@type": "ImageObject",
      url: "https://sportypredict.com/assets/banner.png",
      width: 1200,
      height: 630
    },
    articleSection: sport.charAt(0).toUpperCase() + sport.slice(1),
    keywords: `${teamA}, ${teamB}, ${sport}, prediction, betting tips, sports analysis`
  };
  
  // Enhanced Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://sportypredict.com"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `${sport.charAt(0).toUpperCase() + sport.slice(1)} Predictions`,
        item: `https://sportypredict.com/${sport}`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${teamA} vs ${teamB}`,
        item: `https://sportypredict.com/${sport}/prediction/${slug}${date ? `?date=${date}` : ''}`
      }
    ]
  };
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(matchSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
      {children}
    </>
  );
}