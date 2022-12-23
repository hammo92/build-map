import { NextApiRequest, NextApiResponse } from 'next'
import httpProxyMiddleware from 'next-http-proxy-middleware'
import auth0 from '../../../utils/auth0'

export const config = {
    api: {
        // Enable `externalResolver` option in Next.js
        externalResolver: true,
    },
}

const proxy = (req: NextApiRequest, res: NextApiResponse) => {
    const session = auth0.getSession(req, res)
    const headers = {
        ...req.cookies,
        ...(session && { Authorization: `Bearer ${session.idToken}` }),
    }

    const prox = httpProxyMiddleware(req, res, {
        // You can use the `http-proxy` option
        target: 'https://dev-nwr0-alx.us.auth0.com/api/v2/',
        changeOrigin: true,
        proxyTimeout: 5000,
        // In addition, you can use the `pathRewrite` option provided by `next-http-proxy-middleware`
        pathRewrite: [
            {
                patternStr: '^/api/auth0',
                replaceStr: '/',
            },
        ],
        headers,
    })
    return prox
}

export default proxy
