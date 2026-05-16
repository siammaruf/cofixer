import { get } from '../httpMethods/get'
import type { ApiResponse } from '~/types/api'

export interface CsrfTokenResponse {
  token: string
}

export const csrfService = {
  getToken: () => get<ApiResponse<CsrfTokenResponse>>('/auth/csrf-token'),
}
