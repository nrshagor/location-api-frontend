/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const domain = process.env.NEXT_PUBLIC_URL
  ? process.env.NEXT_PUBLIC_URL.replace(/^https?:\/\//, "")
  : "";

const nextConfig = {
  distDir: "_next",
  images: {
    ...(isProd
      ? {
          // Use domains in production
          domains: [domain],
        }
      : {
          // Use remotePatterns in development
          remotePatterns: [
            {
              protocol: "http", // Assuming local dev is on http
              hostname: "localhost",
              port: "3000", // Your local port, e.g., 3000
              pathname: "/**", // Match all paths in local development
            },
          ],
        }),
  },
};

export default nextConfig;
