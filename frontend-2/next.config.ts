import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  server:{
    proxy: {
      "/shorten": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  }
};

export default nextConfig;
