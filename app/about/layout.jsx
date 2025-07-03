export const metadata = {
  title: "About SportyPredict - Leading Sports Betting Tips & Predictions",
  description: "Learn about SportyPredict, the leading provider of sports betting analysis and predictions. Expert football, basketball, and tennis tips with 96% success rate.",
  keywords: [
    "about sportypredict", "sports betting predictions", "football predictions", 
    "basketball tips", "tennis predictions", "betting analysis", "sports tipsters",
    "accurate predictions", "VIP betting tips", "bet365 tips", "reliable sports tips"
  ],
  
  openGraph: {
    title: "About SportyPredict - Leading Sports Betting Tips & Predictions",
    description: "Learn about SportyPredict, the leading provider of sports betting analysis and predictions. Expert tips with 96% success rate.",
    url: "https://sportypredict.com/about",
    images: [{
      url: "https://sportypredict.com/assets/banner.png",
      width: 1200,
      height: 630,
      alt: 'About SportyPredict - Sports Betting Tips',
    }]
  },
  
  twitter: {
    title: "About SportyPredict - Leading Sports Betting Tips",
    description: "Learn about SportyPredict, the leading provider of sports betting analysis and predictions with expert tipsters.",
  },
  
  alternates: {
    canonical: "https://sportypredict.com/about",
  }
};

// Structured Data Schemas
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SportyPredict",
  url: "https://sportypredict.com",
  description: "Leading provider of sports betting analysis and predictions specializing in football, basketball, and tennis",
  foundingDate: "2020",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Service",
    url: "https://sportypredict.com/contact"
  },
  sameAs: [
    "https://twitter.com/sportypredict",
    "https://facebook.com/sportypredict"
  ],
  service: {
    "@type": "Service",
    name: "Sports Betting Predictions",
    description: "Expert sports betting tips and predictions for football, basketball, and tennis",
    provider: {
      "@type": "Organization",
      name: "SportyPredict"
    }
  }
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "SportyPredict About Us",
  url: "https://sportypredict.com/about",
  description: "Learn about SportyPredict - leading sports betting predictions platform",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://sportypredict.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About SportyPredict",
  description: "Learn about SportyPredict, our mission, and why we're the leading sports betting predictions platform",
  mainEntity: {
    "@type": "Organization",
    name: "SportyPredict"
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
      name: "About",
      item: "https://sportypredict.com/about"
    }
  ]
};


export default function AboutLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([organizationSchema, websiteSchema, aboutPageSchema, breadcrumbSchema])
        }}
      />
      
      {children}
    </>
  );
}