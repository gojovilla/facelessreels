import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@remotion/lambda",
    "@remotion/renderer",
    "@remotion/bundler",
    "remotion",
  ],
};

export default nextConfig;
