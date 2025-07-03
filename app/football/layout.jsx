export const metadata = {
  title: "Football Betting Tips & Predictions Today",
  description: "Get today's best football betting tips and predictions. Expert analysis on Premier League, Champions League, and more. Free daily football tips.",
  keywords: [
    "football betting tips", "football predictions", "soccer tips", 
    "Premier League predictions", "Champions League tips", "football betting",
    "Over 2.5 Goals", "Both Teams to Score", "1X2 predictions"
  ],
  
  openGraph: {
    title: "Football Betting Tips & Predictions Today | SportyPredict",
    description: "Get today's best football betting tips and predictions. Expert analysis on Premier League, Champions League, and more.",
    url: "https://sportypredict.com/football",
    images: [{
      url: "https://sportypredict.com/assets/banner.png",
      width: 1200,
      height: 630,
      alt: 'Football Betting Tips - SportyPredict',
    }]
  },
  
  twitter: {
    title: "Football Betting Tips & Predictions Today",
    description: "Get today's best football betting tips and predictions from our experts.",
  },
  
  alternates: {
    canonical: "https://sportypredict.com/football",
  }
}; 

// Structured Data Schemas
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "SportyPredict Football Tips",
  url: "https://sportypredict.com/football",
  description: "Expert football betting tips and predictions",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://sportypredict.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

const sportsEventSchema = {
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  name: "Football Betting Predictions",
  description: "Daily football betting tips and predictions",
  sport: "Football",
  location: {
    "@type": "VirtualLocation",
    url: "https://sportypredict.com/football"
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
      name: "Football Tips",
      item: "https://sportypredict.com/football"
    }
  ]
};

import ClientLayout from "@/app/football/clientLayout";

export default function FootballLayout({ children }) {
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