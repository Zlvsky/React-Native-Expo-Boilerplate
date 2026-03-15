import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { memo } from 'react'
import { StatusBar } from 'react-native'

import HomeScreen from '@/screens/auth/HomeScreen'
import SignInScreen from '@/screens/auth/SignInScreen'
import SignUpScreen from '@/screens/auth/SignUpScreen'

export type AuthStackParamList = {
  Home: undefined
  SignIn: undefined
  SignUp: undefined
}

const Stack = createNativeStackNavigator<AuthStackParamList>()

const SCREEN_OPTIONS = {
  headerShown: false,
  animation: 'slide_from_right' as const,
}

const AuthNavigator = memo(() => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Stack.Navigator screenOptions={SCREEN_OPTIONS} initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
      </Stack.Navigator>
    </>
  )
})

AuthNavigator.displayName = 'AuthNavigator'

export default AuthNavigator
