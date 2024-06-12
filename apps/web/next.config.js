/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: ["@repo/ui"],
  reactStrictMode: false,
  images: {
    domains: ['avatars.githubusercontent.com'],
    formats: ['image/avif', 'image/webp']
  }
};
