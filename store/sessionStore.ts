import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import React from 'react'
import { Platform } from 'react-native'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'

import type { User } from '@/types'

// Secure storage adapter — uses SecureStore for session tokens, AsyncStorage otherwise
const createSecureStorage = () => ({
  getItem: async (key: string): Promise<string | null> => {
    try {
      if (Platform.OS === 'web') return localStorage.getItem(key)
      if (key.includes('session') || key.includes('token')) {
        return await SecureStore.getItemAsync(key)
      }
      return await AsyncStorage.getItem(key)
    } catch {
      return null
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(key, value)
        return
      }
      if (key.includes('session') || key.includes('token')) {
        await SecureStore.setItemAsync(key, value)
        return
      }
      await AsyncStorage.setItem(key, value)
    } catch (error) {
      throw error
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(key)
        return
      }
      if (key.includes('session') || key.includes('token')) {
        await SecureStore.deleteItemAsync(key)
        return
      }
      await AsyncStorage.removeItem(key)
    } catch {
      // Do not throw on remove errors to prevent crashes
    }
  }
})

interface SessionState {
  session: string | null
  user: User | null
  isLoading: boolean
  secureDataLoaded: boolean
  isAuthenticated: boolean
  setSession: (session: string | null) => void
  setUser: (user: User | null) => void
  setIsLoading: (loading: boolean) => void
  signIn: (token: string, userData: User) => Promise<void>
  signOut: () => Promise<void>
  reset: () => void
  loadSecureData: () => Promise<void>
}

const INITIAL_STATE = {
  session: null,
  user: null,
  isLoading: true,
  secureDataLoaded: false,
  isAuthenticated: false
} as const

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      setSession: (session) => set({ session, isAuthenticated: !!session }),

      setUser: (user) => set({ user }),

      setIsLoading: (isLoading) => set({ isLoading }),

      signIn: async (token, userData) => {
        try {
          if (Platform.OS !== 'web') {
            await SecureStore.setItemAsync('session', token)
          } else {
            localStorage.setItem('session', token)
          }
        } catch (error) {
          throw error
        }
        set({
          session: token,
          user: userData,
          isAuthenticated: true,
          isLoading: false,
          secureDataLoaded: true
        })
      },

      signOut: async () => {
        try {
          if (Platform.OS !== 'web') {
            await SecureStore.deleteItemAsync('session')
          } else {
            localStorage.removeItem('session')
          }
        } catch {
          // Continue even if clearing storage fails
        }
        set({ session: null, user: null, isAuthenticated: false })
      },

      reset: () => set({ ...INITIAL_STATE }),

      loadSecureData: async () => {
        try {
          let session: string | null = null
          if (Platform.OS !== 'web') {
            session = await SecureStore.getItemAsync('session')
          } else {
            session = localStorage.getItem('session')
          }
          set({
            session,
            isAuthenticated: !!session,
            secureDataLoaded: true,
            isLoading: false
          })
        } catch {
          set({
            session: null,
            isAuthenticated: false,
            secureDataLoaded: true,
            isLoading: false
          })
        }
      }
    }),
    {
      name: 'session-storage',
      storage: createJSONStorage(() => createSecureStorage()),
      partialize: (state) => ({ session: state.session, user: state.user }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isAuthenticated = !!state.session
          state.isLoading = false
        }
      }
    }
  )
)

// --- Hooks ---

export const useSessionData = () => {
  const session = useSessionStore((state) => state.session)
  const secureDataLoaded = useSessionStore((state) => state.secureDataLoaded)
  const isLoading = useSessionStore((state) => state.isLoading)
  return { session, isLoading: !secureDataLoaded || isLoading }
}

export const useSession = () => useSessionData()
export const useUser = () => useSessionStore((state) => state.user)
export const useIsAuthenticated = () => useSessionStore((state) => state.isAuthenticated)

export const useSessionInitializer = () => {
  const secureDataLoaded = useSessionStore((state) => state.secureDataLoaded)
  const loadSecureData = useSessionStore((state) => state.loadSecureData)
  React.useEffect(() => {
    if (!secureDataLoaded) {
      loadSecureData()
    }
  }, [secureDataLoaded, loadSecureData])
}

export const useSessionActions = () =>
  useSessionStore(
    useShallow((state) => ({
      setSession: state.setSession,
      setUser: state.setUser,
      setIsLoading: state.setIsLoading,
      signIn: state.signIn,
      signOut: state.signOut,
      reset: state.reset,
      loadSecureData: state.loadSecureData
    }))
  )

// --- Selectors ---

export const selectSession = (state: SessionState) => state.session
export const selectUser = (state: SessionState) => state.user
export const selectIsAuthenticated = (state: SessionState) => state.isAuthenticated
export const selectIsLoading = (state: SessionState) => state.isLoading
