import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Nav from '../components/Nav'

export default function PurchaseSuccess() {
  const router = useRouter()
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    // Get success data from router query params
    if (router.query.amount) {
      setData({
        amount: router.query.amount,
        creditsRemaining: router.query.creditsRemaining,
        referralBonus: router.query.referralBonus === 'true',
      })
    }
  }, [router.query])

  const goToDashboard = () => {
    router.push('/dashboard')
  }

  return (
    <div>
      <Nav />
      <main className="max-w-2xl mx-auto p-6 text-center">
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-8 mt-8">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-3xl font-bold text-green-700 mb-4">Order Successful!</h2>
          
          {data && (
            <div className="space-y-4 text-lg">
              <div className="bg-white p-4 rounded">
                <p className="text-gray-600">Amount Deducted</p>
                <p className="text-2xl font-semibold text-gray-900">${data.amount}</p>
              </div>

              <div className="bg-white p-4 rounded">
                <p className="text-gray-600">Credits Remaining</p>
                <p className="text-2xl font-semibold text-gray-900">{data.creditsRemaining}</p>
              </div>

              {data.referralBonus && (
                <div className="bg-yellow-50 border-2 border-yellow-400 p-4 rounded">
                  <p className="text-yellow-700 font-semibold">🎉 Referral Bonus!</p>
                  <p className="text-yellow-700">You and your referrer each earned 2 bonus credits!</p>
                </div>
              )}
            </div>
          )}

          <button
            onClick={goToDashboard}
            className="mt-8 px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </main>
    </div>
  )
}
