import React from 'react'
import Nav from './Nav'

export default function Layout({ children }: { children: React.ReactNode }){
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100">
      <Nav />
      <div className="max-w-7xl mx-auto px-6 pt-24 md:pt-32 pb-16">
        {children}
      </div>
    </div>
  )
}
