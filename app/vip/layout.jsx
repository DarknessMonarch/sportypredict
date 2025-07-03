export const metadata = {
  title: "VIP Tips and Predictions - Premium Tennis, Basketball & Football Tips",
  description: "Get exclusive VIP betting tips for tennis, basketball, and football. Premium daily predictions with expert analysis.",
  keywords: [
    "VIP betting tips", "premium betting tips", "VIP bet of the day",
    "tennis betting tips", "basketball betting tips", "football betting tips",
    "VIP sports predictions", "premium daily tips", "exclusive betting tips",
    "VIP tennis predictions", "VIP basketball tips", "VIP football tips"
  ],
  
  openGraph: {
    title: "VIP Tips and Predictions - Premium Tennis, Basketball & Football Tips",
    description: "Get exclusive VIP betting tips for tennis, basketball, and football. Premium daily predictions with expert analysis.",
    url: "https://sportypredict.com/vip",
    images: [{
      url: "https://sportypredict.com/assets/banner.png",
      width: 1200,
      height: 630,
      alt: 'VIP Bet of the Day - SportyPredict',
    }]
  },
  
  twitter: {
    title: "VIP Bet of the Day - Premium Tennis, Basketball & Football Tips",
    description: "Get exclusive VIP betting tips for tennis, basketball, and football with expert analysis from our tipsters.",
  },
  
  alternates: {
    canonical: "https://sportypredict.com/vip",
  }
};

// Structured Data Schemas
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "SportyPredict VIP Bet of the Day",
  url: "https://sportypredict.com/vip",
  description: "Premium VIP betting tips for tennis, basketball, and football with expert analysis",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://sportypredict.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

const sportsEventSchema = {
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  name: "VIP Bet of the Day Predictions",
  description: "Premium VIP betting tips for tennis, basketball, and football",
  sport: "Tennis, Basketball, Football",
  location: {
    "@type": "VirtualLocation",
    url: "https://sportypredict.com/vip"
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
      name: "VIP Bet of the Day",
      item: "https://sportypredict.com/vip"
    }
  ]
};

export default function BetOfTheDayLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([websiteSchema, sportsEventSchema, breadcrumbSchema])
        }}
      />
      
      {children}
    </>
  );
}