import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  output: "standalone",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
