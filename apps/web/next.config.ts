import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@nodi/design-system'],
  // Root eslint flat config uses a CSS text parser; Next's build worker cannot serialize it.
  // Design adherence is enforced via `pnpm lint` instead.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
