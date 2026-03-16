import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React, { memo } from 'react'
import { StatusBar } from 'react-native'

import HomeNavigator from '@/navigation/HomeNavigator'
import SettingsNavigator from '@/navigation/SettingsNavigator'

export type MainTabParamList = {
  Home: undefined
  Settings: undefined
}

const Tab = createBottomTabNavigator<MainTabParamList>()

const SCREEN_OPTIONS = {
  headerShown: false,
  tabBarShowLabel: true,
}

const MainTabNavigator = memo(() => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Tab.Navigator screenOptions={SCREEN_OPTIONS} initialRouteName="Home">
        <Tab.Screen name="Home" component={HomeNavigator} />
        <Tab.Screen name="Settings" component={SettingsNavigator} />
      </Tab.Navigator>
    </>
  )
})

MainTabNavigator.displayName = 'MainTabNavigator'

export default MainTabNavigator
