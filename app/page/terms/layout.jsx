export const metadata = {
  title: "Terms & Conditions - SportyPredict | Legal Terms for Betting Tips Service",
  description: "Read SportyPredict's complete terms and conditions for our sports betting tips service. Understand user responsibilities, liability terms, and legal compliance for betting predictions.",
  keywords: [
    "terms and conditions", "legal terms", "betting tips terms", "user agreement",
    "sportypredict terms", "liability terms", "betting disclaimer", "service terms",
    "user responsibilities", "legal compliance", "betting regulations", "terms of service",
    "sports predictions terms", "website terms", "user agreement betting"
  ],
  
  openGraph: {
    title: "Terms & Conditions - SportyPredict Legal Terms",
    description: "Complete terms and conditions for SportyPredict's sports betting tips service. Understand your rights and responsibilities as a user.",
    url: "https://sportypredict.com/terms",
    images: [{
      url: "https://sportypredict.com/assets/banner.png",
      width: 1200,
      height: 630,
      alt: 'SportyPredict Terms & Conditions - Legal Agreement',
    }]
  },
  
  twitter: {
    title: "Terms & Conditions - SportyPredict",
    description: "Read SportyPredict's comprehensive terms and conditions for betting tips services.",
  },
  
  alternates: {
    canonical: "https://sportypredict.com/terms",
  },
  
  robots: {
    index: true,
    follow: true,
  }
};

// Structured Data Schemas
const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Terms & Conditions - SportyPredict",
  description: "Comprehensive terms and conditions governing the use of SportyPredict's sports betting tips and predictions service",
  url: "https://sportypredict.com/terms",
  isPartOf: {
    "@type": "WebSite",
    name: "SportyPredict",
    url: "https://sportypredict.com"
  },
  about: {
    "@type": "Thing",
    name: "Terms and Conditions",
    description: "Legal agreement outlining user rights, responsibilities, and service terms"
  }
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SportyPredict",
  url: "https://sportypredict.com",
  description: "Sports betting predictions platform with comprehensive legal terms and user protections",
  termsOfService: "https://sportypredict.com/terms",
  privacyPolicy: "https://sportypredict.com/privacy-policy",
  service: [
    {
      "@type": "Service",
      name: "Sports Betting Tips",
      description: "Expert predictions and analysis for football, basketball, and tennis",
      termsOfService: "https://sportypredict.com/terms"
    },
    {
      "@type": "Service",
      name: "VIP Betting Plans",
      description: "Premium betting tips with enhanced analysis and support"
    }
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Legal Support",
    availableLanguage: "English",
    areaServed: "Worldwide"
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
      name: "Terms & Conditions",
      item: "https://sportypredict.com/terms"
    }
  ]
};

const legalDocumentSchema = {
  "@context": "https://schema.org",
  "@type": "DigitalDocument",
  name: "SportyPredict Terms & Conditions",
  description: "Legal document governing the use of SportyPredict's betting tips and predictions service",
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  publisher: {
    "@type": "Organization",
    name: "SportyPredict"
  },
  about: [
    {
      "@type": "Thing",
      name: "User Responsibilities",
      description: "Obligations and responsibilities of users accessing betting tips"
    },
    {
      "@type": "Thing",
      name: "Service Liability",
      description: "Limitations of liability for betting predictions and outcomes"
    },
    {
      "@type": "Thing",
      name: "Legal Compliance",
      description: "Requirements for users to comply with local betting regulations"
    },
    {
      "@type": "Thing",
      name: "Intellectual Property",
      description: "Protection of content, analysis, and betting strategies"
    }
  ]
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What do I agree to by using SportyPredict?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "By accessing SportyPredict, you agree to comply with our Privacy Policy, Disclaimer Notice, Terms and Conditions, and rules applicable to our betting products."
      }
    },
    {
      "@type": "Question",
      name: "Are SportyPredict's betting tips guaranteed to win?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, our betting tips and predictions are recommendations and personal opinions. They are not definitive or guaranteed predictions with no possibility of loss. Every user engages in betting at their own risk."
      }
    },
    {
      "@type": "Question",
      name: "What is SportyPredict's liability for betting losses?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SportyPredict does not accept any liability for damages, losses, or liabilities arising from our services, picks, and predictions. Any profits or losses from gambling are solely the user's responsibility."
      }
    },
    {
      "@type": "Question",
      name: "Can I use SportyPredict if betting is illegal in my country?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Users must comply with relevant regulations in their jurisdiction. You are responsible for acting in accordance with your local laws regarding betting and gambling."
      }
    },
    {
      "@type": "Question",
      name: "Can I reproduce content from SportyPredict?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Reproduction and unauthorized use of materials such as tips, analysis, and strategies from SportyPredict are strictly prohibited. Contact us to discuss any reproduction requests."
      }
    },
    {
      "@type": "Question",
      name: "Does SportyPredict guarantee the accuracy of information?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "While we strive for accuracy, we do not guarantee the accuracy or completeness of information provided. The website may contain typographical errors, inaccuracies, or outdated information."
      }
    },
    {
      "@type": "Question",
      name: "What happens if part of the terms becomes invalid?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "If any provision is found invalid or unenforceable, it shall not affect the validity of the remaining provisions, which shall remain in full force and effect."
      }
    }
  ]
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Sports Betting Tips Service",
  provider: {
    "@type": "Organization",
    name: "SportyPredict"
  },
  description: "Professional sports betting predictions and tips with comprehensive legal terms",
  termsOfService: "https://sportypredict.com/terms",
  serviceType: "Sports Betting Analysis",
  areaServed: {
    "@type": "Place",
    name: "Global"
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Betting Tips Services",
    itemListElement: [
      {
        "@type": "Offer",
        name: "Free Betting Tips",
        description: "Basic sports predictions and analysis"
      },
      {
        "@type": "Offer",
        name: "VIP Betting Plans",
        url: "https://sportypredict.com/page/vip",
        description: "Premium betting tips with enhanced analysis"
      }
    ]
  }
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "SportyPredict Terms & Conditions - Complete Legal Agreement",
  description: "Comprehensive terms and conditions governing SportyPredict's sports betting tips service, user responsibilities, and legal compliance requirements",
  author: {
    "@type": "Organization",
    name: "SportyPredict"
  },
  publisher: {
    "@type": "Organization",
    name: "SportyPredict",
    logo: {
      "@type": "ImageObject",
      url: "https://sportypredict.com/assets/logo.png"
    }
  },
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://sportypredict.com/terms"
  },
  about: [
    {
      "@type": "Thing",
      name: "Legal Terms"
    },
    {
      "@type": "Thing", 
      name: "User Agreement"
    },
    {
      "@type": "Thing",
      name: "Service Liability"
    },
    {
      "@type": "Thing",
      name: "Responsible Betting"
    }
  ]
};

import ClientLayout from "@/app/terms/clientLayout";

export default function TermsConditionsLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            webPageSchema,
            organizationSchema,
            breadcrumbSchema,
            legalDocumentSchema,
            faqSchema,
            serviceSchema,
            articleSchema
          ])
        }}
      />
      
      <ClientLayout>{children}</ClientLayout>
    </>
  );
}