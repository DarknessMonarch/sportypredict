export const metadata = {
  title: "Contact SportyPredict - Get in Touch with Our Sports Betting Experts",
  description: "Contact SportyPredict for inquiries about our sports betting tips and predictions. Get expert support for football, basketball, tennis predictions and VIP services.",
  keywords: [
    "contact sportypredict", "sports betting support", "betting tips inquiry", 
    "customer service", "VIP plan support", "football predictions help",
    "basketball betting support", "tennis tips contact", "betting expert contact"
  ],
  
  openGraph: {
    title: "Contact SportyPredict - Sports Betting Experts Support",
    description: "Contact SportyPredict for inquiries about our sports betting tips and predictions. Get expert support for all your betting needs.",
    url: "https://sportypredict.com/contact",
    images: [{
      url: "https://sportypredict.com/assets/banner.png",
      width: 1200,
      height: 630,
      alt: 'Contact SportyPredict - Sports Betting Support',
    }]
  },
  
  twitter: {
    title: "Contact SportyPredict - Sports Betting Support",
    description: "Get in touch with SportyPredict for expert sports betting tips and predictions support.",
  },
  
  alternates: {
    canonical: "https://sportypredict.com/contact",
  }
};

// Structured Data Schemas
const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact SportyPredict",
  description: "Get in touch with SportyPredict for sports betting tips and predictions support",
  url: "https://sportypredict.com/contact",
  mainEntity: {
    "@type": "Organization",
    name: "SportyPredict",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      availableLanguage: "English",
      areaServed: "Worldwide"
    }
  }
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "SportyPredict Contact",
  url: "https://sportypredict.com/contact",
  description: "Contact form for SportyPredict sports betting tips and predictions support",
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
  description: "Leading sports betting predictions and tips provider",
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      availableLanguage: "English",
      areaServed: "Worldwide",
      serviceArea: {
        "@type": "Place",
        name: "Global"
      }
    },
    {
      "@type": "ContactPoint", 
      contactType: "Technical Support",
      availableLanguage: "English",
      areaServed: "Worldwide"
    }
  ],
  service: [
    {
      "@type": "Service",
      name: "Sports Betting Tips",
      description: "Expert football, basketball, and tennis predictions"
    },
    {
      "@type": "Service",
      name: "VIP Betting Plans",
      description: "Premium sports betting tips with high success rates"
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
      name: "Contact",
      item: "https://sportypredict.com/contact"
    }
  ]
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How can I contact SportyPredict support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can contact SportyPredict support through our contact form. Fill in your username, email, and message, and our team will get back to you soon."
      }
    },
    {
      "@type": "Question",
      name: "What types of betting tips does SportyPredict offer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SportyPredict offers expert betting tips for football, basketball, tennis, and VIP premium predictions with high success rates."
      }
    },
    {
      "@type": "Question",
      name: "How quickly will I receive a response to my inquiry?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our support team typically responds to inquiries within 24 hours. For VIP members, we provide priority support with faster response times."
      }
    }
  ]
};


export default function ContactLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            contactPageSchema, 
            websiteSchema, 
            organizationSchema, 
            breadcrumbSchema, 
            faqSchema
          ])
        }}
      />
      
     {children}
    </>
  );
}