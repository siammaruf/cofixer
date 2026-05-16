import type { AxiosError } from 'axios'
import type { ApiError } from '~/types/api'

/**
 * Create a standardized error response from an Axios error
 */
export const createErrorResponse = (error: AxiosError<ApiError>): ApiError => {
  const errorResponse: ApiError = {
    success: false,
    message: 'An unexpected error occurred',
    statusCode: 500,
    timestamp: new Date().toISOString(),
    path: error.config?.url || '',
  }

  if (error.response) {
    errorResponse.statusCode = error.response.status
    errorResponse.message = error.response.data?.message || error.message
    errorResponse.error = error.response.data?.error

    // Handle 401 Unauthorized
    if (error.response.status === 401) {
      handleUnauthorized()
    }
  } else if (error.request) {
    errorResponse.message = 'No response from server'
    errorResponse.statusCode = 503
  }

  return errorResponse
}

/**
 * Handle unauthorized access
 */
export const handleUnauthorized = (): void => {
  // Cookies are cleared by the server on logout
  window.location.href = '/login'
}

/**
 * Check if an error is an API error
 */
export const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'statusCode' in error
  )
}

/**
 * Get error message from an unknown error
 */
export const getErrorMessage = (error: unknown): string => {
  if (isApiError(error)) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred'
}

/**
 * Get error status from an unknown error
 */
export const getErrorStatus = (error: unknown): number => {
  if (isApiError(error)) {
    return error.statusCode
  }
  return 500
}

/**
 * Format validation errors for display
 */
export const formatValidationErrors = (
  errors: { field?: string; reason?: string; code?: string }[] | undefined
): Record<string, string> => {
  if (!errors) return {}

  const formatted: Record<string, string> = {}
  for (const err of errors) {
    if (err.field) {
      formatted[err.field] = err.reason || 'Invalid value'
    }
  }
  return formatted
}
