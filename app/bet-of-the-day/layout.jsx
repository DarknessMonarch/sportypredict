export const metadata = {
  title: "Bet of the Day - Best Daily Betting Tips & Predictions",
  description: "Get today's best bet of the day with expert analysis. Handpicked daily betting tips across all sports. High confidence predictions with detailed analysis.",
  keywords: [
    "bet of the day", "daily betting tips", "best bet today", 
    "daily predictions", "betting tip of the day", "sports betting",
    "BTTS", "Over 2.5", "1X2", "acca tips"
  ],
  
  openGraph: {
    title: "Bet of the Day - Best Daily Betting Tips | SportyPredict",
    description: "Get today's best bet of the day with expert analysis. Handpicked daily betting tips across all sports.",
    url: "https://sportypredict.com/bet-of-the-day",
    images: [{
      url: "https://sportypredict.com/assets/banner.png",
      width: 1200,
      height: 630,
      alt: 'Bet of the Day - SportyPredict',
    }]
  },
  
  twitter: {
    title: "Bet of the Day - Best Daily Betting Tips",
    description: "Get today's best bet of the day with expert analysis from our tipsters.",
  },
  
  alternates: {
    canonical: "https://sportypredict.com/bet-of-the-day",
  }
};

// Structured Data Schemas
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "SportyPredict Bet of the Day",
  url: "https://sportypredict.com/bet-of-the-day",
  description: "Daily handpicked betting tips with expert analysis",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://sportypredict.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

const sportsEventSchema = {
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  name: "Bet of the Day Predictions",
  description: "Daily handpicked betting tips across all sports",
  sport: "Multiple Sports",
  location: {
    "@type": "VirtualLocation",
    url: "https://sportypredict.com/bet-of-the-day"
  }
};

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
      name: "Bet of the Day",
      item: "https://sportypredict.com/bet-of-the-day"
    }
  ]
};

import ClientLayout from "@/app/bet-of-the-day/clientLayout";

export default function BetOfTheDayLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([websiteSchema, sportsEventSchema, breadcrumbSchema])
        }}
      />
      
      <ClientLayout>{children}</ClientLayout>
    </>
  );
}