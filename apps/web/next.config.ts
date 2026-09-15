import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@nodi/design-system', '@nodi/shared'],
  images: {
    qualities: [75, 100],
  },
  // `/free/[slug]/read` renders per request and reads image dimensions off disk,
  // so the covers and body images have to travel with the server bundle.
  outputFileTracingIncludes: {
    '/free/[slug]/read': ['./public/img/**/*'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve.extensionAlias = {
      ...(config.resolve.extensionAlias ?? {}),
      '.js': ['.ts', '.tsx', '.js'],
    };
    return config;
  },
};

export default nextConfig;
