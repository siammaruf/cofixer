import type { AxiosError } from 'axios'
import type { ApiError } from '~/types/api'

/**
 * Map HTTP status codes to user-friendly messages.
 * Avoids leaking technical/internal details to end users.
 */
const getUserFriendlyMessage = (status: number, rawMessage?: string): string => {
  // If the server sent a clean, non-HTML message, prefer it for 4xx/5xx we know
  const isHtml = typeof rawMessage === 'string' && /<(html|body|head)/i.test(rawMessage)

  switch (status) {
    case 400:
      return isHtml ? 'Something was wrong with that request. Please check your input and try again.' : (rawMessage || 'Something was wrong with that request. Please check your input and try again.')
    case 401:
      return 'Your session has expired or you are not logged in. Please sign in again.'
    case 403:
      return "You don't have permission to do that. If you think this is a mistake, please contact support."
    case 404:
      return isHtml ? 'The service you requested is temporarily unavailable. Please try again later.' : (rawMessage || 'The service you requested is temporarily unavailable. Please try again later.')
    case 409:
      return isHtml ? 'That action could not be completed because of a conflict. Please try again.' : (rawMessage || 'That action could not be completed because of a conflict. Please try again.')
    case 422:
      return isHtml ? 'Some of the information provided is not valid. Please review and try again.' : (rawMessage || 'Some of the information provided is not valid. Please review and try again.')
    case 429:
      return 'Too many attempts. Please wait a moment and try again.'
    case 500:
    case 502:
    case 503:
    case 504:
      return 'Something went wrong on our end. Please try again in a few moments.'
    default:
      return isHtml ? 'Something went wrong. Please try again later.' : (rawMessage || 'Something went wrong. Please try again later.')
  }
}

/**
 * Create a standardized error response from an Axios error
 */
export const createErrorResponse = (error: AxiosError<ApiError>): ApiError => {
  const errorResponse: ApiError = {
    success: false,
    message: 'Something went wrong. Please try again later.',
    statusCode: 500,
    timestamp: new Date().toISOString(),
    path: error.config?.url || '',
  }

  if (error.response) {
    errorResponse.statusCode = error.response.status
    const rawMessage = error.response.data?.message || error.message
    errorResponse.message = getUserFriendlyMessage(error.response.status, rawMessage)
    errorResponse.error = error.response.data?.error

    // Handle 401 Unauthorized
    if (error.response.status === 401) {
      handleUnauthorized()
    }
  } else if (error.request) {
    errorResponse.message = 'Unable to connect to the server. Please check your internet connection and try again.'
    errorResponse.statusCode = 503
  }

  return errorResponse
}

/**
 * Handle unauthorized access
 */
export const handleUnauthorized = (): void => {
  // Avoid redirect loop if already on the login page or other auth pages
  const path = window.location.pathname
  if (path === '/login' || path.startsWith('/auth/')) {
    return
  }
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
