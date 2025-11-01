'use client'

import { createClient } from '@/utils/supabase/client'
import type { User } from '@supabase/supabase-js'
import { User as UserIcon, CheckCircle, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

interface UserStatusProps {
  user: User | null
  loading?: boolean
  className?: string
  showIcon?: boolean
  variant?: 'default' | 'compact'
}

export default function UserStatus({ 
  user, 
  loading = false, 
  className = '',
  showIcon = true,
  variant = 'default'
}: UserStatusProps) {
  const [sessionValid, setSessionValid] = useState<boolean | null>(null)

  useEffect(() => {
    if (user) {
      // Verify session is still valid
      const checkSession = async () => {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()
        setSessionValid(!!session)
      }
      checkSession()
    } else {
      setSessionValid(null)
    }
  }, [user])

  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Loader2 className="w-4 h-4 animate-spin text-secondary" />
        {variant === 'default' && (
          <span className="text-sm text-secondary">Checking...</span>
        )}
      </div>
    )
  }

  if (!user) {
    return null
  }

  const userEmail = user.email || 'User'
  const userName = user.user_metadata?.full_name || 
                   user.user_metadata?.name || 
                   userEmail.split('@')[0]

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {showIcon && sessionValid && (
          <CheckCircle className="w-4 h-4 text-green-500" />
        )}
        {showIcon && !sessionValid && sessionValid !== null && (
          <UserIcon className="w-4 h-4 text-secondary" />
        )}
        <span className="text-sm text-secondary truncate max-w-[150px]">
          {userName}
        </span>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showIcon && (
        <div className="relative">
          {sessionValid ? (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold/20 to-gold/40 flex items-center justify-center border border-gold/30">
              <CheckCircle className="w-4 h-4 text-gold" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-elev-2 border border-[var(--border-default)] flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-secondary" />
            </div>
          )}
        </div>
      )}
      <div className="flex flex-col">
        <span className="text-sm font-medium text-primary">
          {userName}
        </span>
        <span className="text-xs text-secondary">
          {sessionValid ? 'Signed in' : 'Connecting...'}
        </span>
      </div>
    </div>
  )
}
