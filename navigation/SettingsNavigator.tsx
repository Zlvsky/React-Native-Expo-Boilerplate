import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { memo, useMemo } from 'react'
import { useColorScheme } from 'react-native'

import { THEME_COLORS } from '@/constants/theme'
import SettingsScreen from '@/screens/settings/SettingsScreen'

const SettingsStack = createNativeStackNavigator<{ Settings: undefined }>()

const SettingsNavigator = memo(() => {
  const colorScheme = useColorScheme()
  const themeMode = colorScheme === 'dark' ? 'dark' : 'light'

  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      animation: 'slide_from_right' as const,
      contentStyle: {
        backgroundColor: THEME_COLORS[themeMode].background,
      },
    }),
    [themeMode]
  )

  return (
    <SettingsStack.Navigator
      screenOptions={screenOptions}
      initialRouteName="Settings">
      <SettingsStack.Screen name="Settings" component={SettingsScreen} />
    </SettingsStack.Navigator>
  )
})

SettingsNavigator.displayName = 'SettingsNavigator'

export default SettingsNavigator
