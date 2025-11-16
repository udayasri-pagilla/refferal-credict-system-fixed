// pages/register.tsx
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Nav from '../components/Nav'
import useAuth from '../store/useAuth'

export default function RegisterPage(): JSX.Element {
  const router = useRouter()
  const setAuth = useAuth(state => state.setAuth)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [referral, setReferral] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // If URL contains ?ref=XXXX populate referral
  useEffect(() => {
    if (router.query.ref && typeof router.query.ref === 'string') {
      setReferral(router.query.ref)
    }
  }, [router.query.ref])

  function normalizeBaseUrl(raw?: string) {
    // FRONTEND env must be just the origin (no trailing /api)
    if (!raw || raw.trim() === '') return 'http://localhost:4000'
    let url = raw.trim()
    if (url.endsWith('/')) url = url.slice(0, -1)
    return url
  }

  function getApiBase() {
    return normalizeBaseUrl(process.env.NEXT_PUBLIC_API_BASE)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!name || !email || !password) {
      setError('Please fill all required fields')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    try {
      const base = getApiBase() // e.g. https://your-backend.example.com
      const url = `${base}/api/auth/register`

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          referralCode: referral || undefined,
        }),
      })

      // read raw text first to avoid JSON.parse errors on HTML responses
      const raw = await res.text()
      let json: any = null
      try {
        json = raw ? JSON.parse(raw) : null
      } catch (parseErr) {
        throw new Error(`Server returned non-JSON (status ${res.status}). Preview: ${raw.slice(0, 400)}`)
      }

      if (!res.ok) {
        throw new Error(json?.message || json?.error || `Registration failed (status ${res.status})`)
      }

      // success: expect { token, user }
      if (json?.token && json?.user) {
        // update global state
        setAuth(json.token, json.user)

        // persist using keys your store expects
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('auth_token', json.token)
            localStorage.setItem('auth_user', JSON.stringify(json.user))
          } catch (storageErr) {
            console.warn('Could not write auth to localStorage', storageErr)
          }
        }
      } else {
        // backend returned ok but missing token/user
        throw new Error('Registration succeeded but server returned unexpected data.')
      }

      // navigate to dashboard
      router.replace('/dashboard')
    } catch (err: any) {
      console.error('Registration error:', err)
      setError(err?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100">
      <Nav />
      <main className="w-full max-w-7xl mx-auto px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="bg-white rounded-2xl shadow-xl p-12">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-2xl mx-auto">
                RS
              </div>
              <h2 className="mt-4 text-3xl font-bold text-slate-900">Create your account</h2>
              <p className="mt-2 text-sm text-slate-500">
                Join Referral Store — earn credits when friends make their first purchase.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6" noValidate>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Full name</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full rounded-xl border border-slate-200 px-5 py-3 text-base focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 px-5 py-3 text-base focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Choose a secure password"
                  className="w-full rounded-xl border border-slate-200 px-5 py-3 text-base focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
                  required
                />
                <div className="mt-2 text-xs text-slate-400">Use at least 8 characters for a strong password.</div>
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-1">Referral code (optional)</label>
                <input
                  value={referral}
                  onChange={e => setReferral(e.target.value)}
                  placeholder="ABCD1234"
                  className="w-full rounded-xl border border-slate-200 px-5 py-3 text-base focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <button
                  disabled={loading}
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:opacity-95 active:scale-[0.98] transition text-lg"
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </div>

              <div className="relative my-2">
                <div className="absolute left-0 right-0 top-1/2 h-px bg-slate-200"></div>
                <div className="relative text-center text-sm text-slate-500 bg-white px-3 inline-block z-10">or continue with</div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setError('Google sign-in not setup in demo')}
                  className="w-full border border-slate-200 rounded-xl py-3 flex items-center justify-center gap-3 hover:bg-slate-50 text-slate-700 transition"
                >
                  {/* Google SVG */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 12.23c0-.68-.06-1.33-.17-1.96H12v3.7h5.48c-.23 1.26-.93 2.33-1.98 3.05v2.53h3.2c1.87-1.72 2.95-4.27 2.95-7.32z" fill="#4285F4" />
                    <path d="M12 22c2.7 0 4.97-.9 6.63-2.43l-3.2-2.53c-.88.6-2.02.96-3.43.96-2.64 0-4.88-1.78-5.68-4.18H3.02v2.62C4.7 19.8 8.06 22 12 22z" fill="#34A853" />
                    <path d="M6.32 13.82A6.98 6.98 0 016 12c0-.66.12-1.3.32-1.82V7.56H3.02A9.98 9.98 0 002 12c0 1.52.35 2.95.97 4.24l3.33-2.42z" fill="#FBBC05" />
                    <path d="M12 6.5c1.47 0 2.8.5 3.85 1.49l2.82-2.82C16.97 2.98 14.7 2 12 2 8.06 2 4.7 4.2 3.02 7.56l3.33 2.62C7.12 8.28 9.36 6.5 12 6.5z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </button>
              </div>

              {error && <div className="text-sm text-red-600 text-center">{error}</div>}

              <div className="text-sm text-slate-600 mt-2 text-center">
                Already have an account?{' '}
                <Link href="/login" className="text-indigo-600 hover:underline font-semibold">Log in</Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
