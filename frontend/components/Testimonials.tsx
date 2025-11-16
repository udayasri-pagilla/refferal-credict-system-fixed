export default function Testimonials(){
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="bg-white p-4 rounded-lg shadow-sm transform hover:scale-102 transition-all duration-200 animate-fade-in-up transform-gpu">
        <div className="text-sm text-gray-600">“Simple to use and boosted our referrals — love it!”</div>
        <div className="mt-3 text-sm font-semibold">— Alex, Product Manager</div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm transform hover:scale-102 transition-all duration-200 animate-fade-in-up transform-gpu">
        <div className="text-sm text-gray-600">“Trusted flow and easy analytics for our small team.”</div>
        <div className="mt-3 text-sm font-semibold">— Priya, Founder</div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm transform hover:scale-102 transition-all duration-200 animate-fade-in-up transform-gpu">
        <div className="text-sm text-gray-600">“Great for demos — clear and reliable behavior.”</div>
        <div className="mt-3 text-sm font-semibold">— Sam, Developer</div>
      </div>
    </div>
  )
}
