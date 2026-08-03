import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // This checkout lives inside the ProfitMe repo, which has its own lockfile at
  // the parent level. Pin the root so Turbopack traces the monorepo and not it.
  turbopack: {
    root: path.join(__dirname, '..'),
  },
  transpilePackages: ['workflow-builder'],
  async rewrites() {
    const apiUrl = process.env.API_URL || 'http://localhost:8000';
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
