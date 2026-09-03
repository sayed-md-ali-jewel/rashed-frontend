const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337"
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "1337"
      },
      {
        protocol: "https",
        hostname: "**"
      }
    ]
  },
  typedRoutes: true
};

export default nextConfig;
