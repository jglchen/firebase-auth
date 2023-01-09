/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  serverRuntimeConfig: {
    SECRET_COOKIE_PASSWORD: process.env.SECRET_COOKIE_PASSWORD,
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
    NODE_ENV: process.env.NODE_ENV,
  },
  output: 'standalone',
}

module.exports = nextConfig
