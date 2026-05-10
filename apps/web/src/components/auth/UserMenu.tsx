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
import { LogOut, Settings, User } from 'lucide-react'
import { useSessionStatus } from '@forge/auth/adapters/auth-handler/client'
import type { AuthUser } from '@forge/auth/server'

interface UserMenuProps {
  initialUser?: AuthUser | null
}

export function UserMenu({ initialUser }: UserMenuProps = {}) {
  const { user: contextUser, isLoading } = useUser()
  const { signOut } = useSessionStatus()

  // Use server-provided user as fallback until client-side fetchSession completes.
  // This ensures the menu renders immediately on first load without waiting for
  // the async /api/auth/session fetch.
  const user = contextUser ?? initialUser ?? null

  const handleLogout = () => {
    void signOut('logout')
  }

  if (isLoading && !user) {
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
