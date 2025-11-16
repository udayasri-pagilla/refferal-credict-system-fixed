import useAuth from '../store/useAuth'
import { useEffect, useState } from 'react'

export default function CreditBanner(){
  const { token, user } = useAuth()
  const [credits, setCredits] = useState<number | null>(null)
  const [ref, setRef] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    (async ()=>{
      try {
        const res = await fetch((process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api') + '/dashboard', { headers: { Authorization: `Bearer ${token}` } })
        if (!res.ok) return
        const json = await res.json()
        setCredits(json.credits)
        setRef(json.referralCode)
      } catch (e) {}
    })()
  }, [token])

  const copy = async () => {
    if (!ref) return
    const link = `${location.origin}/register?ref=${ref}`
    await navigator.clipboard.writeText(link)
    alert('Referral link copied')
  }

  if (!token) return (
    <div className="bg-white p-3 rounded-md shadow-sm text-sm text-gray-700">Login to see your credits and referral link.</div>
  )

  return (
    <div className="bg-white p-4 rounded-md shadow-sm flex items-center justify-between">
      <div>
        <div className="text-sm text-gray-500">Your credits</div>
        <div className="text-2xl font-semibold">{credits ?? 0}</div>
      </div>
      <div className="text-right">
        <div className="text-sm text-gray-500">Referral</div>
        <div className="flex items-center gap-2">
          <div className="font-mono text-sm text-gray-700">{ref ?? '—'}</div>
          <button onClick={copy} className="px-3 py-1 border rounded text-sm">Copy</button>
        </div>
      </div>
    </div>
  )
}
