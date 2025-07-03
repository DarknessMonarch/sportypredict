export const metadata = {
  title: "Disclaimer - SportyPredict Sports Betting Predictions Terms",
  description: "SportyPredict disclaimer and terms of use for sports betting predictions. Understand our liability limitations, user responsibilities, and entertainment guidelines.",
  keywords: [
    "sportypredict disclaimer", "betting predictions disclaimer", "sports betting terms", 
    "gambling disclaimer", "prediction liability", "betting entertainment warning",
    "sports tips disclaimer", "user responsibility betting", "gambling warning notice"
  ],
  
  openGraph: {
    title: "SportyPredict Disclaimer - Sports Betting Terms & Conditions",
    description: "Important disclaimer information for SportyPredict users regarding our sports betting predictions and user responsibilities.",
    url: "https://sportypredict.com/disclaimer",
    images: [{
      url: "https://sportypredict.com/assets/banner.png",
      width: 1200,
      height: 630,
      alt: 'SportyPredict Disclaimer - Betting Terms',
    }]
  },
  
  twitter: {
    title: "SportyPredict Disclaimer - Betting Terms",
    description: "Read SportyPredict's disclaimer regarding sports betting predictions and user responsibilities.",
  },
  
  alternates: {
    canonical: "https://sportypredict.com/disclaimer",
  }
};

// Structured Data Schemas
const disclaimerPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "SportyPredict Disclaimer",
  description: "Disclaimer and terms of use for SportyPredict sports betting predictions service",
  url: "https://sportypredict.com/disclaimer",
  mainEntity: {
    "@type": "Article",
    headline: "SportyPredict Disclaimer",
    description: "Important disclaimer information regarding sports betting predictions and user responsibilities",
    author: {
      "@type": "Organization",
      name: "SportyPredict"
    },
    publisher: {
      "@type": "Organization",
      name: "SportyPredict",
      url: "https://sportypredict.com"
    }
  }
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "SportyPredict Disclaimer",
  url: "https://sportypredict.com/disclaimer",
  description: "Disclaimer page for SportyPredict sports betting predictions and tips service",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://sportypredict.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SportyPredict",
  url: "https://sportypredict.com",
  description: "Sports betting predictions and tips provider with clear disclaimer and user guidelines",
  disclaimer: "SportyPredict is not a bookmaker and does not accept bets. All predictions are for entertainment purposes only.",
  termsOfService: "https://sportypredict.com/disclaimer",
  service: [
    {
      "@type": "Service",
      name: "Sports Betting Predictions",
      description: "Entertainment-based football, basketball, and tennis predictions",
      disclaimer: "All predictions are recommendations only and not encouragement to bet"
    },
    {
      "@type": "Service",
      name: "Betting Analysis",
      description: "Sports analysis and insights for entertainment purposes",
      disclaimer: "Users are solely responsible for their betting decisions"
    }
  ]
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
      name: "Disclaimer",
      item: "https://sportypredict.com/disclaimer"
    }
  ]
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is SportyPredict a betting platform?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, SportyPredict is not a bookmaker or betting platform and does not accept bets. We only provide predictions and recommendations."
      }
    },
    {
      "@type": "Question",
      name: "Are SportyPredict's predictions guaranteed to be accurate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, our predictions are provided to the best of our ability but errors may occur. All predictions should be considered as recommendations only."
      }
    },
    {
      "@type": "Question",
      name: "Who is responsible for betting decisions made using SportyPredict tips?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The visitor and user of SportyPredict are solely responsible for their actions and decisions. SportyPredict and its employees cannot be held accountable for betting outcomes."
      }
    },
    {
      "@type": "Question",
      name: "How should gambling be viewed according to SportyPredict?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Gambling should be viewed as a form of entertainment only. SportyPredict predictions are recommendations and not encouragement to engage in betting activities."
      }
    }
  ]
};

const legalDocumentSchema = {
  "@context": "https://schema.org",
  "@type": "DigitalDocument",
  name: "SportyPredict Disclaimer",
  description: "Legal disclaimer document outlining terms of use and user responsibilities for SportyPredict services",
  url: "https://sportypredict.com/disclaimer",
  author: {
    "@type": "Organization",
    name: "SportyPredict"
  },
  about: [
    {
      "@type": "Thing",
      name: "Sports Betting Disclaimer"
    },
    {
      "@type": "Thing", 
      name: "User Responsibility"
    },
    {
      "@type": "Thing",
      name: "Entertainment Guidelines"
    }
  ]
};


export default function DisclaimerLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            disclaimerPageSchema, 
            websiteSchema, 
            organizationSchema, 
            breadcrumbSchema, 
            faqSchema,
            legalDocumentSchema
          ])
        }}
      />
      
   {children}
    </>
  );
}