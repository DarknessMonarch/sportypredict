export const metadata = {
  title: "Privacy Policy - SportyPredict | Data Protection & User Privacy",
  description: "Read SportyPredict's privacy policy to understand how we collect, use, and protect your personal information. Learn about your data rights and our commitment to privacy.",
  keywords: [
    "privacy policy", "data protection", "personal information", "user privacy",
    "data collection", "information security", "privacy rights", "data processing",
    "sportypredict privacy", "user data protection", "privacy statement",
    "data policy", "information handling", "privacy practices"
  ],
  
  openGraph: {
    title: "Privacy Policy - SportyPredict Data Protection",
    description: "Learn how SportyPredict protects your privacy and handles your personal information. Comprehensive privacy policy and data protection guidelines.",
    url: "https://sportypredict.com/privacy-policy",
    images: [{
      url: "https://sportypredict.com/assets/banner.png",
      width: 1200,
      height: 630,
      alt: 'SportyPredict Privacy Policy - Data Protection',
    }]
  },
  
  twitter: {
    title: "Privacy Policy - SportyPredict",
    description: "Read SportyPredict's comprehensive privacy policy and data protection practices.",
  },
  
  alternates: {
    canonical: "https://sportypredict.com/privacy-policy",
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
  name: "Privacy Policy - SportyPredict",
  description: "Comprehensive privacy policy explaining how SportyPredict collects, uses, and protects user personal information",
  url: "https://sportypredict.com/privacy-policy",
  isPartOf: {
    "@type": "WebSite",
    name: "SportyPredict",
    url: "https://sportypredict.com"
  },
  about: {
    "@type": "Thing",
    name: "Privacy Policy",
    description: "Legal document outlining data protection and privacy practices"
  }
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SportyPredict",
  url: "https://sportypredict.com",
  description: "Sports betting predictions platform committed to user privacy and data protection",
  privacyPolicy: "https://sportypredict.com/privacy-policy",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Privacy Officer",
    availableLanguage: "English",
    areaServed: "Worldwide"
  },
  service: [
    {
      "@type": "Service",
      name: "Sports Betting Tips",
      description: "Expert predictions with privacy-focused user experience"
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
      name: "Privacy Policy",
      item: "https://sportypredict.com/privacy-policy"
    }
  ]
};

const policySchema = {
  "@context": "https://schema.org",
  "@type": "DigitalDocument",
  name: "SportyPredict Privacy Policy",
  description: "Legal document outlining privacy practices and data protection measures",
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  publisher: {
    "@type": "Organization",
    name: "SportyPredict"
  },
  about: [
    {
      "@type": "Thing",
      name: "Data Collection",
      description: "Information about how personal data is collected"
    },
    {
      "@type": "Thing",
      name: "Data Usage",
      description: "How collected information is used and processed"
    },
    {
      "@type": "Thing",
      name: "User Rights",
      description: "Rights users have regarding their personal data"
    }
  ]
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What personal information does SportyPredict collect?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SportyPredict may collect your name, contact information (email address and phone number), date of birth, and other relevant information through customer surveys and special offers to provide enhanced service."
      }
    },
    {
      "@type": "Question",
      name: "How does SportyPredict use my personal information?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The sole purpose of collecting information is to provide you with enhanced service and improve our products and services. We may also send promotional emails and SMS messages about new products and offers."
      }
    },
    {
      "@type": "Question",
      name: "Can I opt out of promotional communications?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, if you no longer wish to receive promotional emails and SMS messages, please contact us and we will remove you from our communications list."
      }
    },
    {
      "@type": "Question",
      name: "What rights do I have regarding my personal data?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "According to Data Protection Laws, you have the right to request information about the personal data we hold about you. You can also contact us to correct any incorrect or incomplete information."
      }
    },
    {
      "@type": "Question",
      name: "What happens when I delete my SportyPredict account?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "If you delete your account, all associated data and content, including active subscriptions, will be permanently lost. However, you can still access services by registering with a new email address and phone number."
      }
    },
    {
      "@type": "Question",
      name: "How often is the privacy policy updated?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "This privacy policy may be updated periodically. We encourage you to regularly review this page for any changes or updates to stay informed about our privacy practices."
      }
    }
  ]
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "SportyPredict Privacy Policy - Data Protection & User Privacy",
  description: "Comprehensive privacy policy explaining SportyPredict's commitment to protecting user privacy and personal information security",
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
    "@id": "https://sportypredict.com/privacy-policy"
  },
  about: [
    {
      "@type": "Thing",
      name: "Privacy Protection"
    },
    {
      "@type": "Thing", 
      name: "Data Security"
    },
    {
      "@type": "Thing",
      name: "User Rights"
    }
  ]
};


export default function PrivacyPolicyLayout({ children }) {
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
            articleSchema
          ])
        }}
      />
      
   {children}
    </>
  );
}