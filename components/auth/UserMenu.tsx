'use client'

import { useState } from 'react'
import { useAuth } from './AuthProvider'
import Link from 'next/link'

export function UserMenu() {
  const { user, loading, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (loading) {
    return (
      <div className="w-8 h-8 bg-paper-warm rounded-full animate-pulse" />
    )
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="px-4 py-2 text-sm font-medium text-accent hover:text-accent-soft transition-colors"
      >
        Sign In
      </Link>
    )
  }

  const handleSignOut = async () => {
    await signOut()
    setIsOpen(false)
    globalThis.location.href = '/'
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-paper-warm transition-colors"
      >
        <div className="w-8 h-8 bg-ink rounded-full flex items-center justify-center text-white text-sm font-medium">
          {user.email?.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm text-ink-soft hidden sm:inline">
          {user.email}
        </span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <button
            type="button"
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border z-20">
            <div className="py-1">
              <div className="px-4 py-2 text-sm text-ink-muted border-b border-border">
                {user.email}
              </div>
              <Link
                href="/contacts"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-sm text-ink hover:bg-paper-warm transition-colors"
              >
                My Contacts
              </Link>
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 text-sm text-error hover:bg-paper-warm transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
