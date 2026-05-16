import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '~/redux/store/hooks'
import { getCurrentUser } from '~/redux/features/authSlice'
import { fetchCsrfToken } from '~/services/csrfManager'
import { SuspenseLoader } from '~/components/ui/suspense-loader'

interface AuthInitializerProps {
  children: React.ReactNode
}

/**
 * Checks authentication status on app load.
 * Shows loading state while verifying session via httpOnly cookie.
 * Also fetches CSRF token for subsequent mutating requests.
 */
export function AuthInitializer({ children }: AuthInitializerProps) {
  const dispatch = useAppDispatch()
  const { loading, isAuthenticated } = useAppSelector((state) => state.auth)

  useEffect(() => {
    dispatch(getCurrentUser())
    fetchCsrfToken()
  }, [dispatch])

  // Show loading state during initial auth check
  if (loading && !isAuthenticated) {
    return <SuspenseLoader size="fullScreen" message="Loading..." />
  }

  return <>{children}</>
}
