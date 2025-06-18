export default function manifest() {
  return {
    name: 'Sportypredict',
    short_name: 'Sportypredict',
    description: 'Get expert sports betting predictions and tips on football, soccer, basketball, tennis and more at Sportypredict. Join us for winning insights and tips to boost your betting game.',
    start_url: '/page/football',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: '#031e3c',
    categories: ['sports', 'tips', 'predictions', 'betting', 'football', 'soccer', 'basketball', 'tennis'],
    
    icons: [
      {
        src: '/assets/logo.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: '/assets/logo.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/assets/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/assets/logo.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon'
      }
    ],
    
    prefer_related_applications: false,
    
    lang: 'en',
    dir: 'ltr',
    
    shortcuts: [
      {
        name: 'Football Tips',
        short_name: 'Football',
        description: 'View latest football predictions',
        url: '/page/football',
        icons: [{ src: '/assets/logo.png', sizes: '96x96' }]
      },
      {
        name: 'Bet of Day',
        short_name: 'Day',
        description: 'View bet of the day predictions',
        url: '/page/day',
        icons: [{ src: '/assets/logo.png', sizes: '96x96' }]
      },
      {
        name: 'Basketball Tips',
        short_name: 'Basketball',
        description: 'View basketball predictions',
        url: '/page/basketball',
        icons: [{ src: '/assets/logo.png', sizes: '96x96' }]
      },
      {
        name: 'Tennis Tips',
        short_name: 'Tennis',
        description: 'View tennis predictions',
        url: '/page/tennis',
        icons: [{ src: '/assets/logo.png', sizes: '96x96' }]
      },
      {
        name: 'VIP Tips',
        short_name: 'VIP',
        description: 'View VIP sports predictions',
        url: '/page/vip',
        icons: [{ src: '/assets/logo.png', sizes: '96x96' }]
      }
    ],
    
    screenshots: [
      {
        src: '/assets/banner.png',
        sizes: '1280x720',
        type: 'image/png',
        platform: 'wide',
        label: 'Home Screen'
      }
    ]
  }
}