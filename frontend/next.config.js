/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 不使用 standalone，使用默认模式（支持 SSR 和客户端渲染）
  images: {
    unoptimized: false,
    domains: ['s.coze.cn', 'via.placeholder.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }
    return config
  },
}

module.exports = nextConfig

