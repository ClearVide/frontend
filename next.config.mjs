/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";
    console.log("Proxying API requests to:", backendUrl);
    return [
      {
        source: "/api/polish",
        destination: `${backendUrl}/api/polish`,
      },
      {
        source: "/api/analyze",
        destination: `${backendUrl}/api/analyze`,
      },
      // Proxy all other /api requests to the backend (except internal Next.js API routes)
      // Note: Next.js gives priority to existing pages/api routes, so /api/admin/... will still be handled by Next.js if it exists.
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      }
    ]
  },
}

export default nextConfig
