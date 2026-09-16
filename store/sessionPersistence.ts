import type { User } from '@/types'

export interface IStoredSession {
  session: string
  user: User
}

export const parseStoredSession = (value: string | null): IStoredSession | null => {
  if (!value) {
    return null
  }

  try {
    const parsed = JSON.parse(value) as Partial<IStoredSession>

    if (!parsed.session || !parsed.user) {
      return null
    }

    return {
      session: parsed.session,
      user: parsed.user
    }
  } catch {
    return null
  }
}

export const serializeStoredSession = (value: IStoredSession): string =>
  JSON.stringify(value)
