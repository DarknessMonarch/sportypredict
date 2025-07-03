export const vipMetadata = {
  title: "VIP Sports Betting Tips & Predictions Today",
  description: "Get exclusive VIP sports betting tips and predictions. Premium analysis on football, tennis, basketball with high-accuracy predictions. Expert VIP tips daily.",
  keywords: [
    "VIP sports betting tips", "premium sports predictions", "VIP football tips", 
    "VIP tennis predictions", "VIP basketball tips", "exclusive sports betting",
    "high accuracy sports tips", "premium betting predictions", "VIP daily tips",
    "expert sports analysis", "VIP over 2.5 goals", "VIP both teams to score"
  ],
  
  openGraph: {
    title: "VIP Sports Betting Tips & Predictions",
    description: "Get exclusive VIP sports betting tips across football, tennis, and basketball. Premium predictions with high accuracy rates from expert analysts.",
    url: "https://sportypredict.com/vip",
    images: [{
      url: "https://sportypredict.com/assets/banner.png",
      width: 1200,
      height: 630,
      alt: 'VIP Sports Betting Tips - Football, Tennis, Basketball | SportyPredict',
    }]
  },
  
  twitter: {
    title: "VIP Sports Betting Tips & Predictions Today",
    description: "Exclusive VIP sports betting tips for football, tennis, and basketball. Premium predictions from expert analysts.",
  },
  
  alternates: {
    canonical: "https://sportypredict.com/vip",
  }
}; 

const vipWebsiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "SportyPredict VIP Sports Tips",
  url: "https://sportypredict.com/vip",
  description: "Premium VIP sports betting tips for football, tennis, and basketball with expert analysis",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://sportypredict.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

const vipServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "VIP Sports Betting Predictions",
  description: "Premium VIP betting tips covering football, tennis, and basketball with high-accuracy predictions",
  provider: {
    "@type": "Organization",
    name: "SportyPredict",
    url: "https://sportypredict.com"
  },
  serviceType: "Sports Analysis",
  areaServed: "Worldwide"
};

const vipOfferSchema = {
  "@context": "https://schema.org",
  "@type": "Offer",
  name: "VIP Sports Betting Tips",
  description: "Premium sports betting predictions and tips",
  category: "Sports Betting",
  itemOffered: {
    "@type": "Service",
    name: "VIP Sports Analysis",
    description: "Expert analysis and predictions for football, tennis, and basketball"
  }
};

const vipBreadcrumbSchema = {
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
      name: "VIP Sports Tips",
      item: "https://sportypredict.com/vip"
    }
  ]
};

import ClientLayout from "@/app/vip/clientLayout";

export default function VipSportsLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([vipWebsiteSchema, vipServiceSchema, vipOfferSchema, vipBreadcrumbSchema])
        }}
      />
      
      <ClientLayout>{children}</ClientLayout>
    </>
  );
}