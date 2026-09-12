import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@nodi/design-system', '@nodi/shared'],
  // Root eslint flat config uses a CSS text parser; Next's build worker cannot serialize it.
  // Design adherence is enforced via `pnpm lint` instead.
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
