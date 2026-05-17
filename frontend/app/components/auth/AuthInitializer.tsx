import { useEffect } from 'react'
import { useAppDispatch } from '~/redux/store/hooks'
import { getCurrentUser } from '~/redux/features/authSlice'
import { fetchCsrfToken } from '~/services/csrfManager'

interface AuthInitializerProps {
  children: React.ReactNode
}

/**
 * Checks authentication status on app load.
 * Also fetches CSRF token for subsequent mutating requests.
 */
export function AuthInitializer({ children }: AuthInitializerProps) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getCurrentUser())
    fetchCsrfToken()
  }, [dispatch])

  return <>{children}</>
}
