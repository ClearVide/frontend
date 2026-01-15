/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        // Only proxy /api/polish to your Gemini backend
        source: "/api/polish",
        destination: "http://localhost:8080/api/polish",
      },
      {
        source: "/api/analyze",
        destination: "http://localhost:8080/api/analyze",
      },
    ]
  },
}

export default nextConfig
