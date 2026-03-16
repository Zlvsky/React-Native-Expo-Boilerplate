export const THEME_COLORS = {
  light: {
    background: '#f8f3e8',
  },
  dark: {
    background: '#18140e',
  },
} as const

export type ThemeColors = typeof THEME_COLORS
