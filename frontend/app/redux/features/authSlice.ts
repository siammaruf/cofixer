import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from '~/services'
import type { AuthUser, LoginCredentials, ApiError, ChangePasswordRequest, UpdateProfileRequest } from '~/types/api'

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  profileUpdating: boolean
  profileUpdateError: string | null
  passwordChanging: boolean
  passwordChangeError: string | null
  passwordChangeSuccess: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  profileUpdating: false,
  profileUpdateError: null,
  passwordChanging: false,
  passwordChangeError: null,
  passwordChangeSuccess: false,
}

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials)
      // Token is stored in httpOnly cookie by the server
      return response.data.user
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Server clears the httpOnly cookie on logout
      await authService.logout()
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  }
)

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser()
      return response.data
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  }
)

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (data: ChangePasswordRequest, { rejectWithValue }) => {
    try {
      const response = await authService.changePassword(data)
      return response.data?.message ?? 'Password changed successfully'
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  }
)

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ id, data }: { id: string; data: UpdateProfileRequest }, { rejectWithValue }) => {
    try {
      const response = await authService.updateProfile(id, data)
      return response.data
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload
    },
    clearAuth: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.loading = false
      state.error = null
      state.profileUpdating = false
      state.profileUpdateError = null
      state.passwordChanging = false
      state.passwordChangeError = null
      state.passwordChangeSuccess = false
    },
    clearProfileUpdateState: (state) => {
      state.profileUpdating = false
      state.profileUpdateError = null
    },
    clearPasswordChangeState: (state) => {
      state.passwordChanging = false
      state.passwordChangeError = null
      state.passwordChangeSuccess = false
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        // Don't set isAuthenticated here — wait for getCurrentUser() to verify the cookie
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false
        state.user = null
        state.isAuthenticated = false
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false
        state.user = null
        state.isAuthenticated = false
        state.error = action.payload as string
      })
      // Get Current User (silent background check — no visible error)
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        if (action.payload) {
          state.user = action.payload
          state.isAuthenticated = true
        } else {
          state.user = null
          state.isAuthenticated = false
        }
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false
        state.user = null
        state.isAuthenticated = false
        // Don't set error — this is a silent background check
      })
      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.passwordChanging = true
        state.passwordChangeError = null
        state.passwordChangeSuccess = false
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.passwordChanging = false
        state.passwordChangeError = null
        state.passwordChangeSuccess = true
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.passwordChanging = false
        state.passwordChangeError = action.payload as string
        state.passwordChangeSuccess = false
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.profileUpdating = true
        state.profileUpdateError = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profileUpdating = false
        state.profileUpdateError = null
        state.user = action.payload
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.profileUpdating = false
        state.profileUpdateError = action.payload as string
      })
  },
})

export const { clearError, setAuthenticated, clearAuth, clearProfileUpdateState, clearPasswordChangeState } = authSlice.actions
export default authSlice.reducer
