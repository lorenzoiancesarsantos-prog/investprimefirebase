
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      }
    ],
  },
  webpack: (config, { isServer }) => {
    config.experiments = { ...config.experiments, asyncWebAssembly: true };

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
      };
    }
    
    config.module.rules.push({
        test: /\.wasm$/,
        type: "webassembly/async",
    });

    return config;
  },
};

export default nextConfig;
