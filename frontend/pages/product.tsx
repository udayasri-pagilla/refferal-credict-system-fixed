// frontend/pages/product.tsx
import Link from 'next/link'
import ProductCard from '../components/ProductCard'
import CreditBanner from '../components/CreditBanner'
import Nav from '../components/Nav'
import useAuth from '../store/useAuth'
import { authHeaders } from '../lib/api'
import { useState } from 'react'
import { useRouter } from 'next/router'

const DEMO_PRODUCTS = [
  { id: 'p1', title: 'Demo Product A', price: '₹799', img: '/images/phone.jpeg', desc: 'A short description of demo product A.' },
  { id: 'p2', title: 'Demo Product B', price: '₹1299', img: '/images/laptop.jpg', desc: 'A short description of demo product B.' },
  { id: 'p3', title: 'Demo Product C', price: '₹1999', img: '/images/headset.jpeg', desc: 'A short description of demo product C.' },
]

function buildAuthHeaders(tok?: string | null): Record<string, string> {
  const base: Record<string, string> = { 'Content-Type': 'application/json' }
  if (!tok) return base

  try {
    const h = (authHeaders as any)(tok)
    if (!h || typeof h !== 'object') {
      base.Authorization = `Bearer ${tok}`
      return base
    }
    Object.entries(h).forEach(([k, v]) => {
      base[k] = typeof v === 'string' ? v : String(v)
    })
    return base
  } catch {
    base.Authorization = `Bearer ${tok}`
    return base
  }
}

function normalizeBaseUrl(raw?: string) {
  // Accept either origin or origin + /api; normalize to origin (no trailing slash)
  const fallback = 'http://localhost:4000'
  if (!raw || raw.trim() === '') return fallback
  let url = raw.trim()
  if (url.endsWith('/')) url = url.slice(0, -1)
  // remove trailing /api if present so we can consistently append /api/...
  if (url.toLowerCase().endsWith('/api')) url = url.slice(0, -4)
  return url
}

export default function Product(): JSX.Element {
  const router = useRouter()
  const { token } = useAuth()
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  const buy = async (productId: string, amount = 10) => {
    if (!token) {
      alert('Please login to buy')
      return
    }

    setErr(null)
    setLoadingId(productId)

    try {
      const rawBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'
      const origin = normalizeBaseUrl(rawBase)
      const url = `${origin}/api/purchase/buy` // -> http(s)://host/api/purchase/buy

      const headers = buildAuthHeaders(token)
      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ productId, amount }),
      })

      const text = await res.text()
      let body: any = null
      try {
        body = text ? JSON.parse(text) : null
      } catch {
        // when server returns HTML or empty; create a fallback
        throw new Error(`Server returned non-JSON (status ${res.status}). Preview: ${text?.slice?.(0, 300) || ''}`)
      }

      if (!res.ok) {
        // body might be an object with message or error
        const msg = body?.message || body?.error || `Purchase failed (status ${res.status})`
        throw new Error(msg)
      }

      // success -> expect credits in response
      const json = body
      // navigate to success page with query params
      router.push({
        pathname: '/purchase-success',
        query: {
          amount,
          creditsRemaining: json.credits ?? 0,
          referralBonus: json.purchase?.referralBonus ? 'true' : 'false',
        },
      })
    } catch (e: any) {
      console.error('Purchase error', e)
      setErr(e?.message || (typeof e === 'string' ? e : 'Purchase failed'))
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <main className="max-w-6xl mx-auto p-6">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Store</h1>
            <p className="text-sm text-slate-500">Browse premium digital products</p>
          </div>
          <div className="w-full md:w-96">
            <CreditBanner />
          </div>
        </header>

        <div className="mb-6 flex items-center justify-between">
          <div className="text-sm text-slate-500">Showing {DEMO_PRODUCTS.length} products</div>
          <div className="flex items-center gap-3">
            <select className="border rounded px-3 py-2 text-sm">
              <option>Sort: Featured</option>
              <option>Price: Low → High</option>
              <option>Price: High → Low</option>
            </select>
          </div>
        </div>

        <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {DEMO_PRODUCTS.map((p) => (
            <div key={p.id} className="bg-transparent">
              <ProductCard title={p.title} price={p.price} img={p.img} desc={p.desc} />
              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={() => buy(p.id, 10)}
                  disabled={!!loadingId}
                  aria-disabled={!!loadingId}
                  className={`flex-1 px-4 py-2 text-sm font-semibold rounded-lg transition ${
                    loadingId ? 'bg-slate-300 text-slate-700 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {loadingId === p.id ? 'Processing...' : 'Buy'}
                </button>

                <Link
                  href={`/product`}
                  className="px-3 py-2 border rounded text-sm text-slate-700 hover:bg-slate-50 transition"
                >
                  Details
                </Link>
              </div>
            </div>
          ))}
        </section>

        {err && <div className="mt-6 text-sm text-rose-700 bg-rose-50 p-3 rounded-md border border-rose-100">{err}</div>}
      </main>
    </div>
  )
}
