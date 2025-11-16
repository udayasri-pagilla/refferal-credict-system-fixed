import { create } from 'zustand'

type User = { email: string; referralCode: string }

type State = {
  token: string | null
  user: User | null
  setAuth: (token: string, user: User) => void
  clearAuth: () => void
}

const useAuth = create<State>((set) => ({
  token: null,
  user: null,
  setAuth: (token, user) => set({ token, user }),
  clearAuth: () => set({ token: null, user: null }),
}))

export default useAuth
