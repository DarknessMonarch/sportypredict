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
      hostname: 'minio.swiftsyn.com',
      port: '',
      pathname: '/**', 
    }
    ],
    
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