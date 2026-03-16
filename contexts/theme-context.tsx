import { styled } from 'nativewind'
import { type ReactNode } from 'react'
import { View, useColorScheme } from 'react-native'

const ThemedRoot = styled(View)

interface IThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: IThemeProviderProps) {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  return (
    <ThemedRoot className={isDark ? 'dark flex-1' : 'light flex-1'}>
      {children}
    </ThemedRoot>
  )
}
