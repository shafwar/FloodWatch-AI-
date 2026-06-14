import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow server-side to not fail on Leaflet's window references
  experimental: {
    // Optimize package imports for better tree-shaking
    optimizePackageImports: ['lucide-react', 'recharts', 'framer-motion'],
  },
  // Leaflet uses window, ensure it's only bundled client-side
  transpilePackages: ['react-leaflet', 'leaflet'],
};

export default nextConfig;
