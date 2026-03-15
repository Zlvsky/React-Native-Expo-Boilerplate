import { create } from "zustand"
import i18n from "@/i18n/config"

export type ToastType = "SUCCESS" | "FAILURE" | "WARN"

export interface ToastOptions {
  type?: ToastType
}

export interface IToast {
  id: string
  message: string
  type: ToastType
}

interface ToastStore {
  toasts: IToast[]
  addToast: (message: string, options?: ToastOptions) => void
  removeToast: (id: string) => void
}

/**
 * Check if a message is an API translation key (uppercase with underscores)
 * Examples: ERROR_UNAUTHORIZED, SUCCESS_TASK_TAKEN, INFO_NO_ACTIVE_TASK
 */
const isApiTranslationKey = (message: string): boolean => {
  if (!message || typeof message !== 'string') return false
  // Match API keys: starts with ERROR_, SUCCESS_, INFO_, or other uppercase patterns
  return /^[A-Z][A-Z0-9_]+$/.test(message)
}

/**
 * Translate a message if it's an API translation key
 * Falls back to the original message if no translation is found
 */
export const translateApiMessage = (message: string): string => {
  if (!message) return message
  
  if (isApiTranslationKey(message)) {
    const apiKey = `api.${message}`
    const translated = i18n.t(apiKey)
    // If translation found (not same as key), return it
    if (translated && translated !== apiKey) {
      return translated
    }
  }
  
  return message
}

// Zustand store for managing toasts
export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, options = {}) => {
    const id = Math.random().toString(36).substring(2, 11)
    const type = options.type || "FAILURE"
    // Automatically translate API messages
    const translatedMessage = translateApiMessage(message)
    set((state) => ({ toasts: [...state.toasts, { id, message: translatedMessage, type }] }))
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id)
    }))
}))
