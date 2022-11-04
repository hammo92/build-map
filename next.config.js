import withCloud from '@serverless/cloud/nextjs'

export default withCloud({
    //reactStrictMode: true,
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    output: 'standalone',
})
