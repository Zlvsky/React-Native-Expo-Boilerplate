import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { memo, useMemo } from 'react'
import { StatusBar, useColorScheme } from 'react-native'

import { THEME_COLORS } from '@/constants/theme'
import HomeScreen from '@/screens/auth/HomeScreen'
import SignInScreen from '@/screens/auth/SignInScreen'
import SignUpScreen from '@/screens/auth/SignUpScreen'
import ComponentGalleryScreen from '@/screens/development/ComponentGalleryScreen'

export type AuthStackParamList = {
  Home: undefined
  SignIn: undefined
  SignUp: undefined
  Development: undefined
}

const Stack = createNativeStackNavigator<AuthStackParamList>()

const AuthNavigator = memo(() => {
  const colorScheme = useColorScheme()
  const themeMode = colorScheme === 'dark' ? 'dark' : 'light'

  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      animation: 'slide_from_right' as const,
      contentStyle: {
        backgroundColor: THEME_COLORS[themeMode].background
      }
    }),
    [themeMode]
  )

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Stack.Navigator screenOptions={screenOptions} initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        {__DEV__ ? (
          <Stack.Screen name="Development" component={ComponentGalleryScreen} />
        ) : null}
      </Stack.Navigator>
    </>
  )
})

AuthNavigator.displayName = 'AuthNavigator'

export default AuthNavigator
