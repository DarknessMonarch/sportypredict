export const metadata = {
  title: "VIP Betting Tips & Premium Predictions Today",
  description: "Get exclusive VIP betting tips and premium predictions. High-value insider tips with detailed analysis. Premium subscription required for access.",
  keywords: [
    "VIP betting tips", "premium predictions", "exclusive tips", 
    "high value bets", "VIP subscription", "insider betting",
    "premium analysis", "exclusive predictions", "VIP tips"
  ],
  
  openGraph: {
    title: "VIP Betting Tips & Premium Predictions | SportyPredict",
    description: "Get exclusive VIP betting tips and premium predictions. High-value insider tips with detailed analysis.",
    url: "https://sportypredict.com/page/vip",
    images: [{
      url: "https://sportypredict.com/assets/banner.png",
      width: 1200,
      height: 630,
      alt: 'VIP Betting Tips - SportyPredict',
    }]
  },
  
  twitter: {
    title: "VIP Betting Tips & Premium Predictions Today",
    description: "Get exclusive VIP betting tips and premium predictions from our expert tipsters.",
  },
  
  alternates: {
    canonical: "https://sportypredict.com/page/vip",
  }
};

// Structured Data Schemas
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "SportyPredict VIP Tips",
  url: "https://sportypredict.com/page/vip",
  description: "Exclusive VIP betting tips and premium predictions",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://sportypredict.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

const sportsEventSchema = {
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  name: "VIP Premium Predictions",
  description: "Exclusive VIP betting tips across all sports",
  sport: "Multiple Sports",
  location: {
    "@type": "VirtualLocation",
    url: "https://sportypredict.com/page/vip"
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
      name: "VIP Tips",
      item: "https://sportypredict.com/page/vip"
    }
  ]
};

import ClientLayout from "@/app/page/vip/clientLayout";

export default function VipLayout({ children }) {
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