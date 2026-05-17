import { get } from '../httpMethods/get'
import { post } from '../httpMethods/post'
import type {
  LoginCredentials,
  LoginResponse,
  ApiResponse,
  AuthUser,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyOtpRequest,
  RegisterRequest,
} from '~/types/api'

export const authService = {
  login: (credentials: LoginCredentials) =>
    post<ApiResponse<LoginResponse>>('/auth/login', credentials),

  logout: () =>
    post<ApiResponse<void>>('/auth/logout'),

  refreshToken: (refreshToken: string) =>
    post<ApiResponse<{ token: string }>>('/auth/refresh', { refreshToken }),

  register: (data: RegisterRequest) =>
    post<ApiResponse<{ email: string; expiresAt: string }>>('/auth/register', data),

  verifyEmail: (data: VerifyOtpRequest) =>
    post<ApiResponse<LoginResponse>>('/auth/verify-email', data),

  forgotPassword: (data: ForgotPasswordRequest) =>
    post<ApiResponse<{ message: string }>>('/auth/forgot-password', data),

  resetPassword: (data: ResetPasswordRequest) =>
    post<ApiResponse<{ message: string }>>('/auth/reset-password', data),

  verifyOtp: (data: VerifyOtpRequest) =>
    post<ApiResponse<{ verified: boolean }>>('/auth/verify-otp', data),

  getCurrentUser: () =>
    get<ApiResponse<AuthUser>>('/auth/me'),
}
