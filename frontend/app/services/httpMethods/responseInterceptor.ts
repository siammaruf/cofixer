import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import { createErrorResponse } from '~/utils/errorHandler'
import type { ApiError } from '~/types/api'
import { fetchCsrfToken } from '../csrfManager'

export function setupResponseInterceptor(instance: AxiosInstance): void {
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError<ApiError>) => {
      const originalRequest = error.config
      
      // Handle CSRF token expiry - retry once with fresh token
      if (error.response?.status === 403 && originalRequest && !originalRequest.headers['X-Retry-CSRF']) {
        const newToken = await fetchCsrfToken()
        if (newToken) {
          originalRequest.headers = originalRequest.headers || {}
          originalRequest.headers['X-CSRF-Token'] = newToken
          originalRequest.headers['X-Retry-CSRF'] = '1'
          return instance(originalRequest)
        }
      }
      
      const errorResponse = createErrorResponse(error)
      return Promise.reject(errorResponse)
    }
  )
}
