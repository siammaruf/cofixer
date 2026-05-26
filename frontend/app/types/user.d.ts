export type UserStatus = 'Active' | 'Inactive' | 'Suspended'

export interface User {
  id: string
  email: string
  fullName?: string | null
  firstName?: string
  lastName?: string
  role: number
  isActive: number
  emailVerified: boolean
  isVerified: boolean
  image?: string | null
  rememberMe?: boolean
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
}

export interface UserState {
  users: User[]
  selectedUser: User | null
  loading: boolean
  error: string | null
}

export interface CreateUserRequest {
  name: string
  email: string
  phone?: string
  position: string
  status?: UserStatus
  startDate?: string
}