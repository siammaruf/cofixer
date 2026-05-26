import { get } from '../httpMethods/get'
import { post } from '../httpMethods/post'
import { put } from '../httpMethods/put'
import { del } from '../httpMethods/delete'
import type { User, CreateUserRequest } from '~/types/user'
import type { ApiResponse, PaginatedApiResponse } from '~/types/api'

export const userService = {
  getUsers: () =>
    get<PaginatedApiResponse<User>>('/users'),

  getUserById: (id: string) =>
    get<ApiResponse<User>>(`/users/${id}`),

  createUser: (user: CreateUserRequest) =>
    post<ApiResponse<User>>('/users', user as any),

  updateUser: (id: string, user: Partial<User>) =>
    put<ApiResponse<User>>(`/users/${id}`, user),

  deleteUser: (id: string) =>
    del<ApiResponse<void>>(`/users/${id}`),
}
