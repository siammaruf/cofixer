import { get } from '../httpMethods/get'
import { post } from '../httpMethods/post'
import { patch } from '../httpMethods/patch'
import type {
  LoginCredentials,
  LoginResponse,
  ApiResponse,
  AuthUser,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyOtpRequest,
  RegisterRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
} from '~/types/api'

export const authService = {
  login: (credentials: LoginCredentials) =>
    post<ApiResponse<LoginResponse>>('/auth/login', credentials),

  logout: () =>
    get<ApiResponse<void>>('/auth/logout'),

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

  changePassword: (data: ChangePasswordRequest) =>
    post<ApiResponse<{ message: string }>>('/auth/change-password', data),

  updateProfile: (id: string, data: UpdateProfileRequest) =>
    patch<ApiResponse<AuthUser>>(`/users/${id}`, data),
}
