import { Toaster } from 'sonner';
import "@/app/style/global.css";
import Script from "next/script";
import { Roboto_Condensed } from "next/font/google";

const roboto_Condensed = Roboto_Condensed({
  weight: ["200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const SITE_URL = "https://sportypredict.433tips.com";
const BANNER_URL = "https://raw.githubusercontent.com/DarknessMonarch/sportypredict/refs/heads/master/public/assets/banner.png";

export const viewport = { 
  themeColor: "#031e3c",
};

export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "SportyPredict - Free Sports Predictions",
    template: "%s | SportyPredict"
  },
  applicationName: "SportyPredict",
  description: "SportyPredict is the ultimate destination for accurate sports betting predictions, specializing in Sports, basketball, and tennis. We provide reliable information, tips and predictions for today, tomorrow and this weekend.",
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
  ],

  openGraph: {
    type: "website",
    locale: "en_US",
    title: "SportyPredict - Free Sports Predictions",
    description: "SportyPredict is the ultimate destination for accurate sports betting predictions, specializing in Sports, basketball, and tennis. We provide reliable information, tips and predictions for today, tomorrow and this weekend.",
    url: SITE_URL,
    siteName: "SportyPredict",
    images: [{
      url: BANNER_URL,
      width: 1200,
      height: 630,
      alt: "SportyPredict Banner"
    }]
  },

  twitter: {
    card: "summary_large_image",
    title: "SportyPredict - Sports Betting Predictions & Tips",
    description: "Expert sports betting predictions and tips",
    images: [BANNER_URL],
    creator: "@SportyPredict"
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
    canonical: `${SITE_URL}/page/day`,
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
    shortcut: "/favicon.ico"
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
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
            style={{ display: 'none', visibility: 'hidden' }}
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