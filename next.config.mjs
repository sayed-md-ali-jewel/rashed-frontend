const nextConfig = {
  output: "standalone",
  env: {
    NEXT_PUBLIC_SITE_URL:
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://drrashed.bd"),
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "drrashed.bd",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "drrashed.bd",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/admin/:path*",
        headers: [
          {
            key: "Cache-Control",
            value:
              "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
          {
            key: "Expires",
            value: "0",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value:
              "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
          {
            key: "Expires",
            value: "0",
          },
        ],
      },
    ];
  },
  typedRoutes: true,
};

export default nextConfig;
