export const metadata = {
  title: "Basketball Betting Tips & Predictions Today",
  description: "Get today's best basketball betting tips and predictions. Expert analysis on NBA, NCAA, and more. Free daily basketball tips.",
  keywords: [
    "basketball betting tips", "basketball predictions", "NBA tips", 
    "NCAA predictions", "basketball betting", "NBA predictions",
    "Over/Under points", "Point spread", "Moneyline predictions"
  ],
  
  openGraph: {
    title: "Basketball Betting Tips & Predictions Today | SportyPredict",
    description: "Get today's best basketball betting tips and predictions. Expert analysis on NBA, NCAA, and more.",
    url: "https://sportypredict.com/page/basketball",
    images: [{
      url: "https://sportypredict.com/assets/banner.png",
      width: 1200,
      height: 630,
      alt: 'Basketball Betting Tips - SportyPredict',
    }]
  },
  
  twitter: {
    title: "Basketball Betting Tips & Predictions Today",
    description: "Get today's best basketball betting tips and predictions from our experts.",
  },
  
  alternates: {
    canonical: "https://sportypredict.com/page/basketball",
  }
};

// Structured Data Schemas
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "SportyPredict Basketball Tips",
  url: "https://sportypredict.com/page/basketball",
  description: "Expert basketball betting tips and predictions",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://sportypredict.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

const sportsEventSchema = {
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  name: "Basketball Betting Predictions",
  description: "Daily basketball betting tips and predictions",
  sport: "Basketball",
  location: {
    "@type": "VirtualLocation",
    url: "https://sportypredict.com/page/basketball"
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
      name: "Basketball Tips",
      item: "https://sportypredict.com/page/basketball"
    }
  ]
};

import ClientLayout from "@/app/page/basketball/clientLayout";

export default function BasketballLayout({ children }) {
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