/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@google-translate-select/react'],
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
        hostname: 'media.api-sports.io',
        port: '',
        pathname: '/football/**',
      },
      {
        protocol: "https",
        hostname: "minioapi.swiftsyn.com",
        port: "",
      }
    ],
    
  },
  webpack: (config, { isServer }) => {
    config.externals = config.externals || [];
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    
    config.resolve.alias = {
      ...config.resolve.alias,
      'react/jsx-runtime': require.resolve('react/jsx-runtime')
    };
    
    return config;
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/page/football',
        permanent: true,
      },
    ];
  }
};

module.exports = nextConfig;