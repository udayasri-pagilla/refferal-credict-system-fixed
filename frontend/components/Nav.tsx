import Link from 'next/link'
import useAuth from '../store/useAuth'

export default function Nav({ wide }: { wide?: boolean } = {}){
  const { token, user, clearAuth } = useAuth()
  const containerWidth = wide ? 'max-w-7xl' : 'max-w-6xl'
  const navPadding = wide ? 'px-6 md:px-8 py-4' : 'px-4 py-3'
  const linkTextClass = wide ? 'text-sm md:text-base' : 'text-sm'

  return (
    <nav className={`bg-white shadow ${navPadding}`}>
      <div className={`${containerWidth} mx-auto flex items-center justify-between`}>
        <div className={`flex items-center gap-3 flex-1 ${wide ? 'md:gap-4' : ''}`}>
          <div className={`${wide ? 'w-12 h-12 md:w-14 md:h-14' : 'w-10 h-10'} rounded-lg flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg shadow-md`}>RS</div>
          <div>
            <div className={`${wide ? 'text-sm md:text-base' : 'text-sm'} font-semibold text-slate-900`}>Referral Store</div>
            <div className={`${wide ? 'text-xs md:text-sm' : 'text-xs'} text-slate-500`}>Earn credits with referrals</div>
          </div>
        </div>

        <div className={`flex items-center gap-4 ${wide ? 'md:gap-6' : ''} justify-end`}>
          <Link href="/" className={`${linkTextClass} text-slate-700`}>Home</Link>
          <Link href="/product" className={`${linkTextClass} text-slate-700`}>Store</Link>
          {token ? (
            <>
              <Link href="/dashboard" className={`${linkTextClass} text-slate-700`}>Dashboard</Link>
              <button onClick={() => clearAuth()} className={`ml-2 ${linkTextClass} text-red-600`}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className={`${linkTextClass} text-slate-700`}>Login</Link>
              <Link href="/register" className={`${linkTextClass} text-indigo-600 font-semibold`}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
