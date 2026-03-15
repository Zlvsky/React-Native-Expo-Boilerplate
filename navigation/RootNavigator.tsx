import LoadingScreen from '@/screens/LoadingScreen'
import { useSessionData, useSessionInitializer } from '@/store/sessionStore'
import React, { memo } from 'react'

import AuthNavigator from './AuthNavigator'
import MainTabNavigator from './MainTabNavigator'

const RootNavigator = memo(() => {
  useSessionInitializer()

  const { session, isLoading } = useSessionData()

  if (isLoading) {
    return <LoadingScreen />
  }

  if (session) {
    return <MainTabNavigator />
  }

  return <AuthNavigator />
})

RootNavigator.displayName = 'RootNavigator'

export default RootNavigator
