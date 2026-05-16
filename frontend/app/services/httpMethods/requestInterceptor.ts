import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { getCsrfToken, fetchCsrfToken } from '../csrfManager'

export function setupRequestInterceptor(instance: AxiosInstance): void {
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      // Token is handled via httpOnly cookies - no manual injection needed
      
      // Add CSRF token for mutating requests
      if (config.method && ['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
        let token = getCsrfToken()
        if (!token) {
          token = await fetchCsrfToken()
        }
        if (token) {
          config.headers = config.headers || {}
          config.headers['X-CSRF-Token'] = token
        }
      }
      
      return config
    },
    (error) => Promise.reject(error)
  )
}
