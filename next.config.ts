import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_RPC_URL: process.env.NEXT_PUBLIC_RPC_URL || "https://api.devnet.solana.com",
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
};

export default nextConfig;
