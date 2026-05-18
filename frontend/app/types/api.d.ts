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
  email: string
  password: string
  rememberMe?: boolean
}

export interface AuthUser {
  id: string
  email: string
  fullName: string
  role?: string
  image?: string | null
  isActive?: boolean
}

export interface LoginResponse {
  token: string
  refreshToken: string
  user: AuthUser
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  email: string
  otp: string
  password: string
  confirmPassword: string
}

export interface VerifyOtpRequest {
  otp: string
  email: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName?: string
  lastName?: string
}

// Form Action Response Types (for server actions)
export interface FormActionResponse<T = unknown> {
  message?: string
  error?: string
  data?: T
}

export type LoginFormResponse = FormActionResponse<{
  email: string
  password: string
  rememberMe?: boolean
}>

export type RegisterFormResponse = FormActionResponse<{
  email: string
  password: string
  name?: string
}>

export interface ChangePasswordRequest {
  currentPassword?: string
  newPassword: string
  confirmNewPassword: string
}

export interface UpdateProfileRequest {
  fullName?: string
  email?: string
  image?: string | null
}
