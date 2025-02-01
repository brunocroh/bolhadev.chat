const nextConfig = {
  transpilePackages: ['@repo/ui'],
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['pages', 'components', 'lib', 'src'], // Specify directories to lint
  },
}

export default nextConfig
