/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Ensure SWC is used for compilation
    forceSwcTransforms: true,
  },
  // Configure SWC
  compiler: {
    // Disable Babel
    emotion: false,
    styledComponents: false,
    reactRemoveProperties: true,
  },
  images: {
    domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // Temporarily ignore ESLint during builds
  },
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  async redirects() {
    return [
      {
        source: "/technician",
        destination: "/technician/dashboard",
        permanent: true,
      },
      {
        source: "/admin",
        destination: "/admin/dashboard",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
