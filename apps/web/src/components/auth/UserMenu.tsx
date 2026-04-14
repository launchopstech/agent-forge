'use client'

/**
 * User menu dropdown — replaces Clerk UserButton.
 * Displays user avatar, profile info, and logout action.
 */

import { useUser } from '@/hooks/use-user'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Skeleton,
} from '@forge/ui'
import { LogOut, Settings, User, CheckCircle2 } from 'lucide-react'
const handleTestApi = async () => {
  try {
    const baseUrl = process.env.PUBLIC_FORGE_API_BASE_URL || ''
    const url = baseUrl.replace(/\/$/, '') + '/api/test'
    const accessToken = sessionStorage.getItem('forge_access_token')
    const res = await fetch(url, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    })
    const data = await res.json()
    alert(`API /api/test: ${res.status} - ${JSON.stringify(data)}`)
  } catch (err) {
    alert('API /api/test error: ' + (err instanceof Error ? err.message : String(err)))
  }
}

export function UserMenu() {
  const { user, isLoading } = useUser()

  const handleLogout = () => {
    // Clear sessionStorage before navigating to logout endpoint
    sessionStorage.removeItem('forge_access_token')
    sessionStorage.removeItem('forge_token_expires_at')
    window.location.href = '/api/auth/logout'
  }

  if (isLoading) {
    return <Skeleton className="h-8 w-8 rounded-full" />
  }

  if (!user) {
    return null
  }

  // Generate initials from name or email
  const initials = user.name
    ? user.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : (user.email?.slice(0, 2).toUpperCase() ?? '??')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name ?? 'User'} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name ?? 'User'}</p>
            {user.email && (
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleTestApi}>
          <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
          <span>Test Authorizer (/api/test)</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
