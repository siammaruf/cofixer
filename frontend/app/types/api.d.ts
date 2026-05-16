export interface ApiResponse<T> {
  success: boolean
  statusCode: number
  message: string
  data: T
  timestamp: string
  path: string
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export interface ApiError {
  success: false
  statusCode: number
  message: string
  error?: { field?: string; reason?: string; code?: string }[]
  timestamp: string
  path: string
}

export interface LoginCredentials {
  username: string
  password: string
  rememberMe?: boolean
}

export interface AuthTokens {
  accessToken: string
  refreshToken?: string
}

export interface AuthUser {
  id: number
  email: string
  name: string
}

export interface LoginResponse {
  user: AuthUser
  tokens: AuthTokens
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
  confirmPassword: string
}

export interface VerifyOtpRequest {
  otp: string
  email: string
}

// Form Action Response Types (for server actions)
export interface FormActionResponse<T = unknown> {
  message?: string
  error?: string
  data?: T
}

export type LoginFormResponse = FormActionResponse<{
  username: string
  password: string
  rememberMe?: boolean
}>

export type RegisterFormResponse = FormActionResponse<{
  email: string
  password: string
  name?: string
}>
