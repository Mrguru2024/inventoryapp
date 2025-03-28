/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
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
