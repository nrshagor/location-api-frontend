/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "_next",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
