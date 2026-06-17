import axios from 'axios'
import type { AxiosInstance } from 'axios'
import { setupRequestInterceptor } from './httpMethods/requestInterceptor'
import { setupResponseInterceptor } from './httpMethods/responseInterceptor'

function getBaseURL(): string {
  if (typeof window !== 'undefined' && window.ENV?.API_URL) {
    return window.ENV.API_URL
  }
  return import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'
}

const httpService: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true, // Enable httpOnly cookie auth
})

// Setup interceptors
setupRequestInterceptor(httpService)
setupResponseInterceptor(httpService)

export default httpService
