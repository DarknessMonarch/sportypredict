/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/djuta2tca/image/upload/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/dttvkmjpd/image/upload/**',
      },
      {
        protocol: 'https',
        hostname: 'minio.swiftsyn.com',
        port: '',
        pathname: '/**',
      }
    ],

  },

    env: {
    TZ: 'Africa/Nairobi',
  },
  
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    process.env.TZ = 'Africa/Nairobi';
    return config;
  },

  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    process.env.TZ = 'Africa/Nairobi';
    return config;
  },
  
 async headers() {
    return [
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=3600',
          },
          {
            key: 'X-Timezone',
            value: 'Africa/Nairobi',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;