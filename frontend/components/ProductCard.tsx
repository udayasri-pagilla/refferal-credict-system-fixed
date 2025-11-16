import Link from 'next/link'

type Props = { title: string; price: string; href?: string; img?: string; desc?: string }

export default function ProductCard({ title, price, href = '/product', img = '/images/download2.jpeg', desc = 'A useful demo product.' }: Props){
  return (
    <article className="border rounded-lg bg-white p-4 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 animate-fade-in-up transform-gpu flex flex-col">
      <div className="h-44 bg-gray-100 rounded overflow-hidden flex items-center justify-center text-gray-400">
        <img src={img} alt={title} className="w-full h-full object-cover" />
      </div>

      <div className="mt-3 flex-1">
        <h4 className="font-medium text-gray-800">{title}</h4>
        <p className="text-sm text-gray-500 mt-1">{desc}</p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-lg font-semibold text-gray-900">{price}</div>
        <div className="flex items-center gap-2">
          <Link href={href} className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-md text-sm">Buy</Link>
          <Link href={href} className="px-3 py-2 border rounded-md text-sm text-gray-700">Details</Link>
        </div>
      </div>
    </article>
  )
}
