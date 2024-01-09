const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const million = require("million/compiler");


const path = require('path')

const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.plugins.push(new DuplicatePackageCheckerPlugin())

    config.resolve.alias['tailwind-merge'] = path.resolve(
      __dirname,
      'node_modules',
      'tailwind-merge'
    )

    config.resolve.alias['clsx'] = path.resolve(
      __dirname,
      'node_modules',
      'clsx'
    )

    return config
  },
}



module.exports = million.next(withBundleAnalyzer(nextConfig), {
  mute: true,
  
  auto: {
    rsc: true,
  }
})