import { get } from '../httpMethods/get'
import { post } from '../httpMethods/post'
import type {
  LoginCredentials,
  LoginResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyOtpRequest,
  RegisterRequest,
} from '~/types/api'

export const authService = {
  login: (credentials: LoginCredentials) =>
    post<LoginResponse>('/auth/login', credentials),

  logout: () =>
    post<void>('/auth/logout'),

  refreshToken: (refreshToken: string) =>
    post<{ accessToken: string }>('/auth/refresh', { refreshToken }),

  register: (data: RegisterRequest) =>
    post<{ email: string; expiresAt: string }>('/auth/register', data),

  verifyEmail: (data: VerifyOtpRequest) =>
    post<LoginResponse>('/auth/verify-email', data),

  forgotPassword: (data: ForgotPasswordRequest) =>
    post<{ message: string }>('/auth/forgot-password', data),

  resetPassword: (data: ResetPasswordRequest) =>
    post<{ message: string }>('/auth/reset-password', data),

  verifyOtp: (data: VerifyOtpRequest) =>
    post<{ verified: boolean }>('/auth/verify-otp', data),

  getCurrentUser: () =>
    get<LoginResponse['user']>('/auth/me'),
}
