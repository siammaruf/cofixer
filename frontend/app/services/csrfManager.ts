import { csrfService } from './httpServices/csrfService'

let csrfToken: string | null = null

export async function fetchCsrfToken(): Promise<string | null> {
  try {
    const response = await csrfService.getToken()
    csrfToken = response.data.token
    return csrfToken
  } catch (error) {
    console.error('Failed to fetch CSRF token', error)
    return null
  }
}

export function getCsrfToken(): string | null {
  return csrfToken
}

export function clearCsrfToken(): void {
  csrfToken = null
}
