export const metadata = {
  title: "Best Betting Sign Up Offers & Welcome Bonuses - SportyPredict",
  description:
    "Discover the best betting sign up offers and welcome bonuses from top bookmakers. Get free bets, deposit match bonuses, and enhanced odds for new customers.",
  keywords: [
    "betting sign up offers",
    "welcome bonuses",
    "free bets",
    "deposit match bonus",
    "no deposit bonus",
    "cashback bonus",
    "enhanced odds",
    "betting promotions",
    "bookmaker offers",
    "new customer bonuses",
    "sports betting bonuses",
    "best betting deals",
    "betting site offers",
    "welcome offers",
  ],

  openGraph: {
    title: "Best Betting Sign Up Offers & Welcome Bonuses - SportyPredict",
    description:
      "Discover the best betting sign up offers and welcome bonuses from top bookmakers. Get free bets, deposit match bonuses, and enhanced odds.",
    url: "https://sportypredict.com/offers",
    images: [
      {
        url: "https://sportypredict.com/assets/banner.png",
        width: 1200,
        height: 630,
        alt: "Best Betting Sign Up Offers & Welcome Bonuses - SportyPredict",
      },
    ],
  },

  twitter: {
    title: "Best Betting Sign Up Offers & Welcome Bonuses",
    description:
      "Discover the best betting sign up offers and welcome bonuses from top bookmakers with SportyPredict.",
  },

  alternates: {
    canonical: "https://sportypredict.com/offers",
  },
};

// Structured Data Schemas
const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Best Betting Sign Up Offers & Welcome Bonuses",
  description:
    "Comprehensive guide to the best betting sign up offers, welcome bonuses, free bets, and promotional deals from top bookmakers",
  url: "https://sportypredict.com/offers",
  mainEntity: {
    "@type": "ItemList",
    name: "Betting Sign Up Offers",
    description: "List of the best betting welcome bonuses and sign up offers",
    numberOfItems: "Multiple",
    itemListElement: [
      {
        "@type": "Offer",
        name: "Deposit Match Bonus",
        description: "Betting sites match a percentage of your initial deposit",
      },
      {
        "@type": "Offer",
        name: "Free Bet Bonus",
        description:
          "Free bet tokens to place wagers without risking your own money",
      },
      {
        "@type": "Offer",
        name: "No Deposit Bonus",
        description: "Bonus funds for signing up without making a deposit",
      },
    ],
  },
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Choose the Best Betting Welcome Bonus",
  description:
    "Step-by-step guide to selecting the best welcome bonus for betting sites",
  totalTime: "PT5M",
  step: [
    {
      "@type": "HowToStep",
      name: "Read Terms and Conditions",
      text: "Carefully read and understand the terms and conditions associated with the welcome bonus",
    },
    {
      "@type": "HowToStep",
      name: "Check Wagering Requirements",
      text: "Review wagering requirements, minimum deposit amounts, and withdrawal restrictions",
    },
    {
      "@type": "HowToStep",
      name: "Compare Bonus Types",
      text: "Compare different bonus types like deposit match, free bets, and cashback offers",
    },
  ],
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SportyPredict",
  url: "https://sportypredict.com",
  description:
    "Leading sports betting predictions and betting offers comparison platform",
  service: [
    {
      "@type": "Service",
      name: "Betting Offers Comparison",
      description:
        "Compare the best betting sign up offers and welcome bonuses",
    },
    {
      "@type": "Service",
      name: "Sports Betting Tips",
      description: "Expert football, basketball, and tennis predictions",
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://sportypredict.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Offers",
      item: "https://sportypredict.com/offers",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What are welcome bonuses in betting sites?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Welcome bonuses are promotional offers designed to entice new customers to register and start betting on a platform. They typically provide financial incentives when users create an account and make their first deposit.",
      },
    },
    {
      "@type": "Question",
      name: "What types of welcome bonuses are available?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Common types include deposit match bonuses, free bets, no deposit bonuses, cashback bonuses, and enhanced odds offers for new customers.",
      },
    },
    {
      "@type": "Question",
      name: "What should I consider when choosing a betting welcome bonus?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Consider wagering requirements, minimum deposit amounts, withdrawal restrictions, bonus terms and conditions, and how the bonus funds can be used.",
      },
    },
    {
      "@type": "Question",
      name: "Are there age restrictions for betting bonuses?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, betting bonuses are available for new customers only with an 18+ age limit. Terms and conditions apply to all promotional offers.",
      },
    },
    {
      "@type": "Question",
      name: "How do deposit match bonuses work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Deposit match bonuses match a percentage of your initial deposit. For example, a 100% deposit match bonus on a $100 deposit gives you an additional $100 in bonus funds to bet with.",
      },
    },
  ],
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Best Betting Sign Up Offers & Welcome Bonuses Guide",
  description:
    "Comprehensive guide to understanding and choosing the best betting welcome bonuses including deposit match, free bets, and no deposit offers",
  author: {
    "@type": "Organization",
    name: "SportyPredict",
  },
  publisher: {
    "@type": "Organization",
    name: "SportyPredict",
    logo: {
      "@type": "ImageObject",
      url: "https://sportypredict.com/assets/logo.png",
    },
  },
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://sportypredict.com/offers",
  },
};

export default function OffersLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            webPageSchema,
            howToSchema,
            organizationSchema,
            breadcrumbSchema,
            faqSchema,
            articleSchema,
          ]),
        }}
      />

      {children}
    </>
  );
}
