import { getCookie } from 'cookies-next'
import axios from 'axios'

export const NEXT_PUBLIC_APP_URL =
    typeof window === 'undefined'
        ? ''
        : window.location.hostname === 'localhost'
        ? `${window.location.protocol}//${window.location.hostname}:${window.location.port}`
        : `${window.location.protocol}//${window.location.hostname}`

export const CLOUD_API_URL =
    typeof window === 'undefined' || window.location.hostname === 'localhost'
        ? process.env.NEXT_PUBLIC_CLOUD_API_URL
        : `${window.location.protocol}//${window.location.hostname}`

export const TOKEN = getCookie('token')

export const apiClient = axios.create({
    baseURL: '',
    headers: {
        'Content-type': 'application/json',
    },
})

apiClient.interceptors.request.use(
    (config) => {
        const token = getCookie('token')
        if (token) {
            config!.headers!['Authorization'] = 'Bearer ' + token
        }
        return config
    },
    function (error) {
        return Promise.reject(error)
    }
)
