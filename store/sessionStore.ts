import * as SecureStore from 'expo-secure-store'
import React from 'react'
import { Platform } from 'react-native'
import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

import type { User } from '@/types'
import {
  parseStoredSession,
  serializeStoredSession,
  type IStoredSession
} from './sessionPersistence'

const SESSION_STORAGE_KEY = 'app-session'

interface ISessionState {
  session: string | null
  user: User | null
  isHydrated: boolean
  isAuthenticated: boolean
  hydrate: () => Promise<void>
  signIn: (token: string, user: User) => Promise<void>
  signOut: () => Promise<void>
}

const readSession = async (): Promise<IStoredSession | null> => {
  const value =
    Platform.OS === 'web'
      ? globalThis.localStorage?.getItem(SESSION_STORAGE_KEY)
      : await SecureStore.getItemAsync(SESSION_STORAGE_KEY)

  return parseStoredSession(value ?? null)
}

const writeSession = async (value: IStoredSession): Promise<void> => {
  const serialized = serializeStoredSession(value)

  if (Platform.OS === 'web') {
    globalThis.localStorage?.setItem(SESSION_STORAGE_KEY, serialized)
    return
  }

  await SecureStore.setItemAsync(SESSION_STORAGE_KEY, serialized)
}

const removeSession = async (): Promise<void> => {
  if (Platform.OS === 'web') {
    globalThis.localStorage?.removeItem(SESSION_STORAGE_KEY)
    return
  }

  await SecureStore.deleteItemAsync(SESSION_STORAGE_KEY)
}

let hydrationPromise: Promise<void> | null = null

const useSessionStore = create<ISessionState>((set, get) => ({
  session: null,
  user: null,
  isHydrated: false,
  isAuthenticated: false,

  hydrate: async () => {
    if (get().isHydrated) {
      return
    }

    if (hydrationPromise) {
      return hydrationPromise
    }

    hydrationPromise = readSession()
      .then((storedSession) => {
        set({
          session: storedSession?.session ?? null,
          user: storedSession?.user ?? null,
          isAuthenticated: Boolean(storedSession?.session),
          isHydrated: true
        })
      })
      .catch(() => {
        set({
          session: null,
          user: null,
          isAuthenticated: false,
          isHydrated: true
        })
      })
      .finally(() => {
        hydrationPromise = null
      })

    return hydrationPromise
  },

  signIn: async (token, user) => {
    await writeSession({ session: token, user })
    set({ session: token, user, isAuthenticated: true, isHydrated: true })
  },

  signOut: async () => {
    try {
      await removeSession()
    } finally {
      set({ session: null, user: null, isAuthenticated: false, isHydrated: true })
    }
  }
}))

export const useSessionData = () =>
  useSessionStore(
    useShallow((state) => ({
      session: state.session,
      user: state.user,
      isLoading: !state.isHydrated
    }))
  )

export const useUser = () => useSessionStore(selectUser)
export const useSessionInitializer = () => {
  const isHydrated = useSessionStore(selectIsHydrated)
  const hydrate = useSessionStore(selectHydrate)

  React.useEffect(() => {
    if (!isHydrated) {
      void hydrate()
    }
  }, [hydrate, isHydrated])
}

export const useSessionActions = () =>
  useSessionStore(
    useShallow((state) => ({
      signIn: state.signIn,
      signOut: state.signOut
    }))
  )

const selectUser = (state: ISessionState) => state.user
const selectIsHydrated = (state: ISessionState) => state.isHydrated
const selectHydrate = (state: ISessionState) => state.hydrate
