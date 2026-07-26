/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Allows next/image (if you adopt it later) to load the QR code images
    // fetched from the public QR-generation API used by the certificate.
    remotePatterns: [
      { protocol: 'https', hostname: 'api.qrserver.com' },
    ],
  },
};

module.exports = nextConfig;
