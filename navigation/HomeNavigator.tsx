import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { memo, useMemo } from 'react'
import { useColorScheme } from 'react-native'

import { THEME_COLORS } from '@/constants/theme'
import CharacterScreen from '@/screens/character/CharacterScreen'

const HomeStack = createNativeStackNavigator<{ Home: undefined }>()

const HomeNavigator = memo(() => {
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
    <HomeStack.Navigator screenOptions={screenOptions} initialRouteName="Home">
      <HomeStack.Screen name="Home" component={CharacterScreen} />
    </HomeStack.Navigator>
  )
})

HomeNavigator.displayName = 'HomeNavigator'

export default HomeNavigator
