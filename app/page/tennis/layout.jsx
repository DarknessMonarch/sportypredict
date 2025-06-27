export const metadata = {
  title: "Tennis Betting Tips & Predictions Today",
  description: "Get today's best tennis betting tips and predictions. Expert analysis on ATP, WTA, Grand Slams, and more. Free daily tennis tips.",
  keywords: [
    "tennis betting tips", "tennis predictions", "ATP tips", 
    "WTA predictions", "Grand Slam predictions", "tennis betting",
    "Match Winner", "Set Betting", "Over/Under Games"
  ],
  
  openGraph: {
    title: "Tennis Betting Tips & Predictions Today | SportyPredict",
    description: "Get today's best tennis betting tips and predictions. Expert analysis on ATP, WTA, Grand Slams, and more.",
    url: "https://sportypredict.com/page/tennis",
    images: [{
      url: "https://sportypredict.com/assets/banner.png",
      width: 1200,
      height: 630,
      alt: 'Tennis Betting Tips - SportyPredict',
    }]
  },
  
  twitter: {
    title: "Tennis Betting Tips & Predictions Today",
    description: "Get today's best tennis betting tips and predictions from our experts.",
  },
  
  alternates: {
    canonical: "https://sportypredict.com/page/tennis",
  }
};

// Structured Data Schemas
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "SportyPredict Tennis Tips",
  url: "https://sportypredict.com/page/tennis",
  description: "Expert tennis betting tips and predictions",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://sportypredict.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

const sportsEventSchema = {
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  name: "Tennis Betting Predictions",
  description: "Daily tennis betting tips and predictions",
  sport: "Tennis",
  location: {
    "@type": "VirtualLocation",
    url: "https://sportypredict.com/page/tennis"
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
      name: "Tennis Tips",
      item: "https://sportypredict.com/page/tennis"
    }
  ]
};

import ClientLayout from "@/app/page/tennis/clientLayout";

export default function TennisLayout({ children }) {
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