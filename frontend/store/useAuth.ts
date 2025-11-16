import { create } from 'zustand'

type User = { email: string; referralCode: string }

type State = {
  token: string | null
  user: User | null
  setAuth: (token: string, user: User) => void
  clearAuth: () => void
  initialize: () => void
}

const useAuth = create<State>((set) => {
  // Initialize from localStorage if available
  if (typeof window !== 'undefined') {
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('auth_user')
    if (savedToken && savedUser) {
      set({ token: savedToken, user: JSON.parse(savedUser) })
    }
  }

  return {
    token: null,
    user: null,
    setAuth: (token, user) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token)
        localStorage.setItem('auth_user', JSON.stringify(user))
      }
      set({ token, user })
    },
    clearAuth: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
      }
      set({ token: null, user: null })
    },
    initialize: () => {
      if (typeof window !== 'undefined') {
        const savedToken = localStorage.getItem('auth_token')
        const savedUser = localStorage.getItem('auth_user')
        if (savedToken && savedUser) {
          set({ token: savedToken, user: JSON.parse(savedUser) })
        }
      }
    },
  }
})

export default useAuth

