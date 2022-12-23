import withCloud from '@serverless/cloud/nextjs'
import CopyPlugin from 'copy-webpack-plugin'
import path from 'path'

const nextConfig = {
    reactStrictMode: true,
    output: 'standalone',
    experimental: {
        transpilePackages: ['ol', 'rlayers'],
        appDir: true,
    },
    webpack(config) {
        config.externals.push('@serverless/cloud')
        config.module.rules.unshift({
            test: /pdf\.worker\.(min\.)?js/,
            type: 'asset/resource',
            generator: {
                filename: 'static/worker/[hash][ext][query]',
            },
        })
        return config
    },
}

export default nextConfig
