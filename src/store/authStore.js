import { create } from 'zustand'
import { applyLanguage } from '../i18n'

const persisted = (() => {
  try {
    const data = JSON.parse(localStorage.getItem('bis-auth'))
    // Migrate the old locally cached demo profile. It must never auto-open
    // the platform as Dhruv Yadav; users should start at the login screen.
    if (data?.user?.name?.trim().toLowerCase() === 'dhruv yadav') {
      localStorage.removeItem('bis-auth')
      return null
    }
    if (data?.user) {
      data.user.role = data.user.role || data.user.userType || 'CONSUMER'
    }
    return data || null
  } catch {
    return null
  }
})()

export const useAuthStore = create((set) => ({
  user: persisted?.user ?? null,
  token: persisted?.token ?? null,
  isLoggedIn: persisted ? Boolean(persisted.token) : false,

  login: ({ token, user }) => {
    const normalizedUser = {
      ...user,
      role: user.role || user.userType || 'CONSUMER',
    }
    localStorage.setItem('bis-auth', JSON.stringify({ token, user: normalizedUser }))
    set({ token, user: normalizedUser, isLoggedIn: true })
    // If the backend returned the saved preferred language, switch the UI to it.
    applyLanguage(normalizedUser.preferredLanguage)
  },

  switchRole: (newRole) => {
    set((state) => {
      if (!state.user) return state
      const updatedUser = { ...state.user, role: newRole, userType: newRole }
      localStorage.setItem('bis-auth', JSON.stringify({ token: state.token, user: updatedUser }))
      return { user: updatedUser }
    })
  },

  logout: () => {
    localStorage.removeItem('bis-auth')
    set({ token: null, user: null, isLoggedIn: false })
  },
}))
