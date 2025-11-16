import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import useAuth from '../store/useAuth'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    useAuth.getState().initialize()
  }, [])

  return <Component {...pageProps} />
}
