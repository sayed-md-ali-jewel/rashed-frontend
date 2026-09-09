const nextConfig = {
  output: "standalone",
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**"
      },
      {
        protocol: "https",
        hostname: "**"
      }
    ]
  },
  async headers() {
    return [
      {
        source: "/admin/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
          },
          {
            key: "Pragma",
            value: "no-cache"
          },
          {
            key: "Expires",
            value: "0"
          }
        ]
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
          },
          {
            key: "Pragma",
            value: "no-cache"
          },
          {
            key: "Expires",
            value: "0"
          }
        ]
      }
    ];
  },
  typedRoutes: true
};

export default nextConfig;
