import Link from 'next/link'
import Nav from '../components/Nav'
import FeatureCard from '../components/FeatureCard'
import ProductCard from '../components/ProductCard'
import Testimonials from '../components/Testimonials'

export default function Home(){
  return (
    <div>
      <Nav />
      <main className="max-w-6xl mx-auto p-6">
        {/* Hero */}
        <section className="grid md:grid-cols-2 gap-8 items-center py-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900 animate-fade-in-up">Make referrals that reward you.</h1>
            <p className="mt-4 text-gray-700 text-lg md:text-xl max-w-xl animate-fade-in-up">Create an account, share your personal referral link, and earn bonus credits when referred users complete their first purchase. Fast to set up and easy to share.</p>
            <div className="mt-8 flex items-center space-x-4">
              <Link
  href="/register"
  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md text-base transition"
>
  Get Started
</Link>

              <Link href="/product" className="px-6 py-3 border rounded-lg text-base">Browse Store</Link>
            </div>
          </div>
          <div>
            <div className="bg-white p-6 rounded-lg shadow animate-fade-in-up">
              <div className="text-sm text-gray-500">Featured Product</div>
              <div className="mt-3 font-semibold text-lg">Demo Product</div>
              <div className="mt-2 text-gray-600">Price: $10</div>
              <div className="mt-4">
                <Link href="/product" className="px-4 py-2 bg-indigo-600 text-white rounded">Buy Now</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Why use Referral & Credit?</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <FeatureCard title="Earn with referrals" desc="Get bonus credits when people you refer make their first purchase." />
            <FeatureCard title="Instant access" desc="Sign up and start sharing your referral link immediately." />
            <FeatureCard title="Secure" desc="Simple, secure authentication and purchase simulation." />
          </div>
        </section>

        {/* Product previews */}
        <section className="py-8">
          <h3 className="text-xl font-semibold mb-4">Product previews</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <ProductCard title="Demo Product A" price="$10" />
            <ProductCard title="Demo Product B" price="$15" />
            <ProductCard title="Demo Product C" price="$20" />
          </div>
        </section>

        {/* Testimonials / Trust */}
        <section className="py-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Trusted by users</h3>
          <Testimonials />
        </section>

      </main>
    </div>
  )
}
