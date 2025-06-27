export const metadata = {
  title: "Refund Policy - SportyPredict | Subscription Cancellation Terms",
  description: "Read SportyPredict's refund policy for VIP subscriptions. Learn about cancellation procedures, payment terms, and subscription policies for betting tips services.",
  keywords: [
    "refund policy", "subscription cancellation", "VIP plan refund", "payment terms",
    "sportypredict refund", "betting subscription policy", "cancellation policy",
    "no refund policy", "subscription terms", "payment policy", "VIP cancellation",
    "betting tips refund", "subscription billing", "automatic renewal policy"
  ],
  
  openGraph: {
    title: "Refund Policy - SportyPredict Subscription Terms",
    description: "Understand SportyPredict's refund policy for VIP subscriptions, cancellation procedures, and payment terms for betting tips services.",
    url: "https://sportypredict.com/refund-policy",
    images: [{
      url: "https://sportypredict.com/assets/banner.png",
      width: 1200,
      height: 630,
      alt: 'SportyPredict Refund Policy - Subscription Terms',
    }]
  },
  
  twitter: {
    title: "Refund Policy - SportyPredict",
    description: "Read SportyPredict's refund policy and subscription cancellation terms.",
  },
  
  alternates: {
    canonical: "https://sportypredict.com/refund-policy",
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
  name: "Refund Policy - SportyPredict",
  description: "Official refund policy for SportyPredict VIP subscriptions and betting tips services",
  url: "https://sportypredict.com/refund-policy",
  isPartOf: {
    "@type": "WebSite",
    name: "SportyPredict",
    url: "https://sportypredict.com"
  },
  about: {
    "@type": "Thing",
    name: "Refund Policy",
    description: "Legal document outlining refund and cancellation terms for subscriptions"
  }
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SportyPredict",
  url: "https://sportypredict.com",
  description: "Sports betting predictions platform with clear refund and subscription policies",
  termsOfService: "https://sportypredict.com/terms",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "VIP Betting Plans",
    itemListElement: [
      {
        "@type": "Offer",
        name: "VIP Plan Subscription",
        url: "https://sportypredict.com/page/vip",
        description: "Premium betting tips subscription service"
      }
    ]
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Support",
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
      name: "Refund Policy",
      item: "https://sportypredict.com/refund-policy"
    }
  ]
};

const policySchema = {
  "@context": "https://schema.org",
  "@type": "DigitalDocument",
  name: "SportyPredict Refund Policy",
  description: "Legal document outlining refund terms and subscription cancellation procedures",
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  publisher: {
    "@type": "Organization",
    name: "SportyPredict"
  },
  about: [
    {
      "@type": "Thing",
      name: "Subscription Refunds",
      description: "Policy regarding refunds for VIP subscription payments"
    },
    {
      "@type": "Thing",
      name: "Cancellation Terms",
      description: "Requirements for cancelling automatic subscriptions"
    },
    {
      "@type": "Thing",
      name: "Age Restrictions",
      description: "18+ age requirement for subscription services"
    }
  ]
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Does SportyPredict offer refunds for subscription payments?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, SportyPredict does not offer refunds for subscription payments. All subscription fees are non-refundable once processed."
      }
    },
    {
      "@type": "Question",
      name: "How can I cancel my VIP subscription?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "To cancel your automatic VIP subscription, you must contact us at least 3 days before the next payment date. Failing to inform us earlier means we cannot refund the subscription fee and you must complete the charged subscription period."
      }
    },
    {
      "@type": "Question",
      name: "What are the age requirements for SportyPredict subscriptions?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SportyPredict services are intended solely for individuals who are above the age of 18. Users must be of legal age to subscribe to our betting tips services."
      }
    },
    {
      "@type": "Question",
      name: "Can I subscribe if betting is illegal in my country?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, individuals from countries where betting is illegal are advised to refrain from subscribing to our plans. SportyPredict assumes no liability for legal compliance in your jurisdiction."
      }
    },
    {
      "@type": "Question",
      name: "What happens if I don't cancel my subscription in time?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "If you don't contact us at least 3 days before your next payment date, we cannot process a cancellation or refund. You will need to complete the full charged subscription period."
      }
    },
    {
      "@type": "Question",
      name: "Does SportyPredict take responsibility for betting losses?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, SportyPredict assumes no liability for any financial losses or gains. Our service provides predictions and tips only, and users bet at their own risk."
      }
    }
  ]
};

const serviceTermsSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "VIP Betting Subscription",
  provider: {
    "@type": "Organization",
    name: "SportyPredict"
  },
  termsOfService: "https://sportypredict.com/refund-policy",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "VIP Plans",
    itemListElement: [
      {
        "@type": "Offer",
        name: "VIP Plan",
        url: "https://sportypredict.com/page/vip",
        description: "Premium betting tips with no refund policy"
      }
    ]
  }
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "SportyPredict Refund Policy - Subscription Terms & Conditions",
  description: "Official refund policy explaining SportyPredict's no-refund terms for VIP subscriptions and cancellation procedures",
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
    "@id": "https://sportypredict.com/refund-policy"
  },
  about: [
    {
      "@type": "Thing",
      name: "Refund Terms"
    },
    {
      "@type": "Thing", 
      name: "Subscription Policy"
    },
    {
      "@type": "Thing",
      name: "Cancellation Procedures"
    }
  ]
};

import ClientLayout from "@/app/refund-policy/clientLayout";

export default function RefundPolicyLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            webPageSchema,
            organizationSchema,
            breadcrumbSchema,
            policySchema,
            faqSchema,
            serviceTermsSchema,
            articleSchema
          ])
        }}
      />
      
      <ClientLayout>{children}</ClientLayout>
    </>
  );
}