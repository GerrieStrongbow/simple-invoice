'use client'

import { useState } from 'react'
import { useAuth } from './AuthProvider'
import { useRouter } from 'next/navigation'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const { signIn, signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password)
        if (error) {
          setError(error.message)
        } else {
          setMessage('Check your email to confirm your account!')
        }
      } else {
        const { error } = await signIn(email, password)
        if (error) {
          setError(error.message)
        } else {
          router.push('/')
          router.refresh()
        }
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Card Container */}
      <div className="bg-white rounded-xl border border-border shadow-soft p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-ink mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-ink-muted text-sm">
            {isSignUp ? 'Start creating professional invoices' : 'Sign in to your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ink-soft mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-border rounded-lg bg-paper-warm/50 text-ink placeholder:text-ink-faint outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-muted"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-ink-soft mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2.5 border border-border rounded-lg bg-paper-warm/50 text-ink placeholder:text-ink-faint outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-muted"
              placeholder="********"
            />
          </div>

          {error && (
            <div className="p-3 bg-error/5 border border-error/20 text-error rounded-lg text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="p-3 bg-success/5 border border-success/20 text-success rounded-lg text-sm">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-ink text-white rounded-lg font-medium transition hover:bg-ink-soft active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {loading && 'Loading...'}
            {!loading && (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError(null)
              setMessage(null)
            }}
            className="text-accent hover:text-accent-soft transition-colors text-sm"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>

      {/* Development hint - only shown in dev mode */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-paper-warm rounded-lg border border-border text-sm text-ink-muted text-center">
          <strong className="text-ink-soft">Dev Mode:</strong> Check emails at{' '}
          <a
            href="http://127.0.0.1:54324"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Mailpit
          </a>
        </div>
      )}
    </div>
  )
}
