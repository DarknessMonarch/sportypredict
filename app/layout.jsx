import { Toaster } from "sonner";
import "@/app/style/global.css";
import Script from "next/script";
import { Roboto_Condensed } from "next/font/google";

const roboto_Condensed = Roboto_Condensed({
  weight: ["200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://sportypredict.com";
const BANNER_URL =
  "https://raw.githubusercontent.com/DarknessMonarch/sportypredict/refs/heads/master/public/assets/banner.png";

export const viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
};

export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Sportypredict - Expert Sports Betting Predictions & Tips",
    template: "%s | SportyPredict",
  },
  applicationName: "SportyPredict",
  description:
    "Get expert sports betting predictions and tips on football, soccer, basketball, tennis and more at Sportypredict. Join us for winning insights and tips to boost your betting game.",
  authors: [{ name: "SportyPredict", url: SITE_URL }],
  generator: "Next.js",
  keywords: [
    "SportyPredict",
    "sports betting",
    "betting predictions",
    "football tips",
    "soccer predictions",
    "basketball betting",
    "betting strategies",
    "sports analysis",
    "betting odds",
    "expert predictions",
    "vip tips",
    "betting tips",
    "sports predictions",
    "banker tips",
    "straight wins",
    "winning predictions",
    "sportypredict",
    "sports betting",
    "predictions",
    "tips",
    "Sports",
    "soccer",
    "basketball",
    "betting strategies",
    "Over 2.5 Goals",
    "Double Chance",
    "Over 1.5 Goals",
    "Under 2.5 Goals",
    "bet of the day",
    "sports predictions",
  ],

  referrer: "origin-when-cross-origin",
  creator: "SportyPredict",
  publisher: "SportyPredict",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "SportyPredict",
    title: "SportyPredict - Expert Sports Betting Predictions & Tips",
    description:
      "Get expert sports betting predictions and tips on football, soccer, basketball, tennis and more.",
    images: [
      {
        url: BANNER_URL,
        width: 1200,
        height: 630,
        alt: "SportyPredict - Sports Betting Predictions",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "SportyPredict - Expert Sports Betting Predictions & Tips",
    description:
      "Get expert sports betting predictions and tips on football, soccer, basketball, tennis and more.",
    images: [BANNER_URL],
    creator: "@SportyPredict",
  },

 robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    }
  },

  verification: {
    google: "",
    yandex: "",
  },

  alternates: {
    canonical: `${SITE_URL}`,
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SportyPredict",
  url: SITE_URL,
  logo: `${SITE_URL}/assets/logo.png`,
  description: "Expert sports betting predictions and tips platform",
  sameAs: [
    "https://www.facebook.com/profile.php?id=100093225097104&mibextid=LQQJ4d",
    "https://whatsapp.com/channel/0029VaADp5iL7UVSqjrKVw2h",
    "https://twitter.com/sportypredict?s=21&t=ordgrMn8HjrBLUy3PdpsBA",
    "https://instagram.com/sportypredict_?igshid=MTIzZWMxMTBkOA==",
    "https://www.youtube.com/@Sportypredict",
    "https://t.me/sportyPredictTG",
    "https://www.tiktok.com/@sportypredict?_t=8dxjShAnRI5&_r=1"

  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "contact@sportypredict.com",
    contactType: "Customer Support",
    url: SITE_URL,
    telephone: "254703147237",
    areaServed: "Worldwide",
    availableLanguage: "English",
  },
  sameAs: [
    "https://www.facebook.com/profile.php?id=100093225097104&mibextid=LQQJ4d",
    "https://whatsapp.com/channel/0029VaADp5iL7UVSqjrKVw2h",
    "https://twitter.com/sportypredict?s=21&t=ordgrMn8HjrBLUy3PdpsBA",
    "https://instagram.com/sportypredict_?igshid=MTIzZWMxMTBkOA==",
    "https://www.youtube.com/@Sportypredict",
    "https://t.me/sportyPredictTG",
    "https://www.tiktok.com/@sportypredict?_t=8dxjShAnRI5&_r=1"
  ],
      
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
            {/* Organization Schema - Global */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema)
          }}
        />

        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-K2Z5KL8G');
            `,
          }}
        />

        {/* PayPal SDK */}
        {/* <Script
          id="paypal-sdk"
          strategy="lazyOnload"
          src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}`}
        /> */}
      </head>
      <body className={roboto_Condensed.className}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-K2Z5KL8G"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/* Google Analytics */}
        <Script
          id="ga-tag"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-SY8V8H1BQ9"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-SY8V8H1BQ9', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />

        <Toaster
          position="top-center"
          richColors={true}
          toastOptions={{
            style: {
              background: "#25c7e7",
              color: "#ffffff",
              borderRadius: "15px",
              border: "1px solid #25c7e7",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
