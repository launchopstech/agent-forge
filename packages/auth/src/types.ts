export interface AuthUser {
  id: string
  email: string | null
  name: string | null
  avatarUrl: string | null
}

export interface AuthSession {
  user: AuthUser
}

export interface UseUserReturn {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
}
