type Props = { title: string; desc: string; icon?: string }

export default function FeatureCard({ title, desc, icon = '/images/icon-referral.svg' }: Props){
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 flex items-start space-x-4 hover:shadow-md transform hover:scale-105 transition-all duration-200 animate-fade-in-up">
      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded flex items-center justify-center">
        <img src={icon} alt="icon" className="w-6 h-6" />
      </div>
      <div>
        <div className="font-semibold text-gray-800">{title}</div>
        <div className="text-sm text-gray-500 mt-1">{desc}</div>
      </div>
    </div>
  )
}
