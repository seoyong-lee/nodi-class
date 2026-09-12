import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@nodi/design-system', '@nodi/shared'],
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
